import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import Stripe from 'stripe';

@Injectable()
export class PaymentsService {
  private stripe: Stripe;

  constructor(
    private configService: ConfigService,
    private prisma: PrismaService,
  ) {
    const stripeSecretKey = this.configService.get<string>('STRIPE_SECRET_KEY');
    if (stripeSecretKey) {
      this.stripe = new Stripe(stripeSecretKey,      {
        apiVersion: '2026-06-24.dahlia' as any,
      },);
    }
  }

  async createPaymentIntent(orderId: string, amount: number) {
    if (!this.stripe) {
      // Return a mock client secret for development if Stripe isn't configured
      return { clientSecret: 'mock_client_secret_for_dev', orderId };
    }

    try {
      const paymentIntent = await this.stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Stripe expects amounts in cents
        currency: 'usd',
        metadata: { orderId },
      });

      return {
        clientSecret: paymentIntent.client_secret,
        orderId,
      };
    } catch (error: any) {
      throw new BadRequestException(error.message);
    }
  }

  async handleWebhook(signature: string, payload: Buffer) {
    if (!this.stripe) return { received: true };

    const webhookSecret = this.configService.get<string>('STRIPE_WEBHOOK_SECRET');
    let event: Stripe.Event;

    try {
      event = this.stripe.webhooks.constructEvent(payload, signature, webhookSecret!);
    } catch (err: any) {
      throw new BadRequestException(`Webhook Error: ${err.message}`);
    }

    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        await this.handlePaymentSuccess(paymentIntent);
        break;
      // Handle other event types
      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    return { received: true };
  }

  private async handlePaymentSuccess(paymentIntent: Stripe.PaymentIntent) {
    const orderId = paymentIntent.metadata.orderId;
    if (!orderId) return;

    await this.prisma.$transaction(async (tx) => {
      await tx.payment.create({
        data: {
          orderId,
          provider: 'stripe',
          transactionId: paymentIntent.id,
          amount: paymentIntent.amount / 100,
          currency: paymentIntent.currency.toUpperCase(),
          status: 'succeeded',
        },
      });

      await tx.order.update({
        where: { id: orderId },
        data: { status: 'CONFIRMED' },
      });

      await tx.orderStatusHistory.create({
        data: {
          orderId,
          status: 'CONFIRMED',
          note: 'Payment received via Stripe',
        },
      });
    });
  }
}

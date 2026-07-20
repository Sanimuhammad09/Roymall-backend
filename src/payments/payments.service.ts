import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import Stripe from 'stripe';
import * as crypto from 'crypto';

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

  // ==============================================================================
  // PAYSTACK INTEGRATION
  // ==============================================================================

  async initializePaystackTransaction(orderId: string, amount: number, paymentMethod: string = 'card') {
    const paystackSecretKey = this.configService.get<string>('PAYSTACK_SECRET_KEY');
    if (!paystackSecretKey) {
      throw new BadRequestException('Paystack secret key is not configured');
    }

    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: { user: true },
    });

    if (!order) {
      throw new BadRequestException('Order not found');
    }

    const email = order.user.email;
    // Paystack expects amount in kobo/cents.
    const amountInKobo = Math.round(amount * 100);

    try {
      const response = await fetch('https://api.paystack.co/transaction/initialize', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${paystackSecretKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          amount: amountInKobo,
          reference: orderId,
          currency: 'NGN', // Explicitly setting to NGN for Bank Transfer support
          channels: paymentMethod === 'bank_transfer' ? ['bank_transfer'] : ['card', 'bank', 'ussd', 'qr', 'mobile_money', 'bank_transfer'],
          callback_url: `${this.configService.get<string>('FRONTEND_URL')}/checkout/success?orderId=${orderId}`,
        }),
      });

      const data = await response.json();

      if (!data.status) {
        throw new BadRequestException(`Paystack Error: ${data.message}`);
      }

      return {
        authorizationUrl: data.data.authorization_url,
        accessCode: data.data.access_code,
        reference: data.data.reference,
      };
    } catch (error: any) {
      throw new BadRequestException(error.message);
    }
  }

  async handlePaystackWebhook(signature: string, payload: any) {
    const paystackSecretKey = this.configService.get<string>('PAYSTACK_SECRET_KEY');
    if (!paystackSecretKey) return { received: true };

    // Validate signature
    const hash = crypto.createHmac('sha512', paystackSecretKey).update(JSON.stringify(payload)).digest('hex');
    if (hash !== signature) {
      throw new BadRequestException('Invalid Paystack Signature');
    }

    const event = payload.event;
    const data = payload.data;

    switch (event) {
      case 'charge.success':
        await this.handlePaystackSuccess(data);
        break;
      // Handle other events as needed
      default:
        console.log(`Unhandled Paystack event type: ${event}`);
    }

    return { received: true };
  }

  private async handlePaystackSuccess(data: any) {
    const orderId = data.reference;
    if (!orderId) return;

    // Check if order exists and is not already paid
    const order = await this.prisma.order.findUnique({ where: { id: orderId } });
    if (!order || order.status === 'CONFIRMED') return;

    await this.prisma.$transaction(async (tx) => {
      // Upsert payment to handle potential duplicate webhooks safely
      const existingPayment = await tx.payment.findUnique({ where: { transactionId: String(data.id) } });
      if (!existingPayment) {
        await tx.payment.create({
          data: {
            orderId,
            provider: 'paystack',
            transactionId: String(data.id),
            amount: data.amount / 100,
            currency: data.currency.toUpperCase(),
            status: 'succeeded',
          },
        });
      }

      await tx.order.update({
        where: { id: orderId },
        data: { status: 'CONFIRMED' },
      });

      await tx.orderStatusHistory.create({
        data: {
          orderId,
          status: 'CONFIRMED',
          note: 'Payment received via Paystack (incl. Bank Transfer)',
        },
      });
    });
  }
}

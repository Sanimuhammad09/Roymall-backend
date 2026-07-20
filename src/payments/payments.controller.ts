import { Controller, Post, Body, Headers, Req, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { PaymentsService } from './payments.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { Public } from '../common/decorators/public.decorator';

@ApiTags('payments')
@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('create-intent')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create Stripe payment intent for an order' })
  async createPaymentIntent(@Body() body: { orderId: string; amount: number }) {
    return this.paymentsService.createPaymentIntent(body.orderId, body.amount);
  }

  @Public()
  @Post('webhook')
  @ApiOperation({ summary: 'Stripe webhook endpoint' })
  async handleWebhook(
    @Headers('stripe-signature') signature: string,
    @Req() req: any, // In NestJS to get raw body for stripe you often need raw payload
  ) {
    // Note: To receive raw body, you might need to configure the body parser in main.ts
    // For simplicity, assuming payload is available on req.rawBody or handled via middleware
    return this.paymentsService.handleWebhook(signature, req.rawBody || req.body);
  }

  @Post('paystack/initialize')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Initialize a Paystack transaction (supports Bank Transfer)' })
  async initializePaystack(@Body() body: { orderId: string; amount: number; paymentMethod?: string }) {
    return this.paymentsService.initializePaystackTransaction(body.orderId, body.amount, body.paymentMethod);
  }

  @Public()
  @Post('paystack/webhook')
  @ApiOperation({ summary: 'Paystack webhook endpoint' })
  async handlePaystackWebhook(
    @Headers('x-paystack-signature') signature: string,
    @Req() req: any,
  ) {
    return this.paymentsService.handlePaystackWebhook(signature, req.body);
  }
}

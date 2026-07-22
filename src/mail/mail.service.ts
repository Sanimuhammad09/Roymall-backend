import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;

  constructor(private readonly configService: ConfigService) {
    const host = this.configService.get<string>('mail.host');

    if (host) {
      this.transporter = nodemailer.createTransport({
        host,
        port: this.configService.get<number>('mail.port'),
        auth: {
          user: this.configService.get<string>('mail.user'),
          pass: this.configService.get<string>('mail.pass'),
        },
      });
    } else {
      // Use a fake transport in development when no SMTP is configured
      this.transporter = nodemailer.createTransport({
        jsonTransport: true,
      });
    }
  }

  private get from(): string {
    return this.configService.get<string>('mail.from', 'no-reply@roymallscents.com');
  }

  async sendWelcomeEmail(to: string, firstName: string): Promise<void> {
    await this.transporter.sendMail({
      from: this.from,
      to,
      subject: 'Welcome to Roymall Scents!',
      html: `
        <div style="font-family: 'Helvetica Neue', sans-serif; max-width: 600px; margin: 0 auto; background: #fafaf8; padding: 40px;">
          <div style="text-align: center; margin-bottom: 32px;">
            <h1 style="font-size: 28px; letter-spacing: 4px; font-weight: 900; color: #1a1a2e;">ROYMALL SCENTS</h1>
          </div>
          <h2 style="font-size: 22px; color: #1a1a2e; margin-bottom: 16px;">Welcome, ${firstName}!</h2>
          <p style="font-size: 14px; color: #555; line-height: 1.8;">
            Thank you for joining the Roymall Scents community. We're thrilled to have you.
          </p>
          <p style="font-size: 14px; color: #555; line-height: 1.8;">
            Explore our premium collections, discover your signature scent, and elevate your fragrance wardrobe.
          </p>
          <div style="text-align: center; margin: 32px 0;">
            <a href="${process.env.VITE_APP_URL || 'http://localhost:3000'}" style="display: inline-block; background: #1a1a2e; color: #fff; padding: 14px 36px; font-size: 12px; letter-spacing: 2px; text-decoration: none; text-transform: uppercase; font-weight: 600;">
              Start Shopping
            </a>
          </div>
          <p style="font-size: 12px; color: #999; text-align: center; margin-top: 40px;">
            &copy; ${new Date().getFullYear()} Roymall Scents. All rights reserved.
          </p>
        </div>
      `,
    });
  }

  async sendPasswordResetEmail(
    to: string,
    firstName: string,
    resetToken: string,
  ): Promise<void> {
    const resetUrl = `${process.env.VITE_APP_URL || 'http://localhost:3000'}/auth/reset-password?token=${resetToken}`;

    await this.transporter.sendMail({
      from: this.from,
      to,
      subject: 'Reset Your Password — Roymall Scents',
      html: `
        <div style="font-family: 'Helvetica Neue', sans-serif; max-width: 600px; margin: 0 auto; background: #fafaf8; padding: 40px;">
          <div style="text-align: center; margin-bottom: 32px;">
            <h1 style="font-size: 28px; letter-spacing: 4px; font-weight: 900; color: #1a1a2e;">ROYMALL SCENTS</h1>
          </div>
          <h2 style="font-size: 22px; color: #1a1a2e; margin-bottom: 16px;">Hi ${firstName},</h2>
          <p style="font-size: 14px; color: #555; line-height: 1.8;">
            We received a request to reset your password. Click the button below to set a new password.
          </p>
          <div style="text-align: center; margin: 32px 0;">
            <a href="${resetUrl}" style="display: inline-block; background: #1a1a2e; color: #fff; padding: 14px 36px; font-size: 12px; letter-spacing: 2px; text-decoration: none; text-transform: uppercase; font-weight: 600;">
              Reset Password
            </a>
          </div>
          <p style="font-size: 14px; color: #555; line-height: 1.8;">
            This link will expire in 1 hour. If you didn't request a password reset, you can safely ignore this email.
          </p>
          <p style="font-size: 12px; color: #999; text-align: center; margin-top: 40px;">
            &copy; ${new Date().getFullYear()} Roymall Scents. All rights reserved.
          </p>
        </div>
      `,
    });
  }

  async sendOrderConfirmationEmail(
    to: string,
    firstName: string,
    orderNumber: string,
    totalAmount: number,
  ): Promise<void> {
    await this.transporter.sendMail({
      from: this.from,
      to,
      subject: `Order Confirmed — #${orderNumber}`,
      html: `
        <div style="font-family: 'Helvetica Neue', sans-serif; max-width: 600px; margin: 0 auto; background: #fafaf8; padding: 40px;">
          <div style="text-align: center; margin-bottom: 32px;">
            <h1 style="font-size: 28px; letter-spacing: 4px; font-weight: 900; color: #1a1a2e;">ROYMALL SCENTS</h1>
          </div>
          <h2 style="font-size: 22px; color: #1a1a2e; margin-bottom: 16px;">Thank you, ${firstName}!</h2>
          <p style="font-size: 14px; color: #555; line-height: 1.8;">
            Your order <strong>#${orderNumber}</strong> has been confirmed. We're preparing it with care.
          </p>
          <div style="background: #fff; border: 1px solid #eee; padding: 24px; margin: 24px 0; text-align: center;">
            <p style="font-size: 12px; color: #999; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 8px;">Order Total</p>
            <p style="font-size: 28px; font-weight: 700; color: #1a1a2e;">$${totalAmount.toFixed(2)}</p>
          </div>
          <div style="text-align: center; margin: 32px 0;">
            <a href="${process.env.VITE_APP_URL || 'http://localhost:3000'}/account/orders" style="display: inline-block; background: #1a1a2e; color: #fff; padding: 14px 36px; font-size: 12px; letter-spacing: 2px; text-decoration: none; text-transform: uppercase; font-weight: 600;">
              View Order
            </a>
          </div>
          <p style="font-size: 12px; color: #999; text-align: center; margin-top: 40px;">
            &copy; ${new Date().getFullYear()} Roymall Scents. All rights reserved.
          </p>
        </div>
      `,
    });
  }
  async sendAppointmentConfirmationEmail(
    to: string,
    fullName: string,
    serviceType: string,
    date: Date,
    time: string,
  ): Promise<void> {
    const formattedDate = new Date(date).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    await this.transporter.sendMail({
      from: this.from,
      to,
      subject: 'Appointment Confirmed — Roymall Scents',
      html: `
        <div style="font-family: 'Helvetica Neue', sans-serif; max-width: 600px; margin: 0 auto; background: #fafaf8; padding: 40px;">
          <div style="text-align: center; margin-bottom: 32px;">
            <h1 style="font-size: 28px; letter-spacing: 4px; font-weight: 900; color: #1a1a2e;">ROYMALL SCENTS</h1>
          </div>
          <h2 style="font-size: 22px; color: #1a1a2e; margin-bottom: 16px;">Your Appointment is Confirmed, ${fullName}!</h2>
          <p style="font-size: 14px; color: #555; line-height: 1.8;">
            We're delighted to confirm your <strong>${serviceType}</strong> appointment.
          </p>
          <div style="background: #fff; border: 1px solid #eee; padding: 24px; margin: 24px 0;">
            <p style="font-size: 12px; color: #999; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 8px;">Date & Time</p>
            <p style="font-size: 18px; font-weight: 700; color: #1a1a2e;">${formattedDate} at ${time}</p>
          </div>
          <p style="font-size: 14px; color: #555; line-height: 1.8;">
            If you need to reschedule or cancel, please contact us at least 24 hours in advance.
          </p>
          <p style="font-size: 12px; color: #999; text-align: center; margin-top: 40px;">
            &copy; ${new Date().getFullYear()} Roymall Scents. All rights reserved.
          </p>
        </div>
      `,
    });
  }
}

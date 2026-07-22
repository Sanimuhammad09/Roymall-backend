"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MailService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const nodemailer = __importStar(require("nodemailer"));
let MailService = class MailService {
    configService;
    transporter;
    constructor(configService) {
        this.configService = configService;
        const host = this.configService.get('mail.host');
        if (host) {
            this.transporter = nodemailer.createTransport({
                host,
                port: this.configService.get('mail.port'),
                auth: {
                    user: this.configService.get('mail.user'),
                    pass: this.configService.get('mail.pass'),
                },
            });
        }
        else {
            this.transporter = nodemailer.createTransport({
                jsonTransport: true,
            });
        }
    }
    get from() {
        return this.configService.get('mail.from', 'no-reply@roymallscents.com');
    }
    async sendWelcomeEmail(to, firstName) {
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
    async sendPasswordResetEmail(to, firstName, resetToken) {
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
    async sendOrderConfirmationEmail(to, firstName, orderNumber, totalAmount) {
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
    async sendAppointmentConfirmationEmail(to, fullName, serviceType, date, time) {
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
};
exports.MailService = MailService;
exports.MailService = MailService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], MailService);
//# sourceMappingURL=mail.service.js.map
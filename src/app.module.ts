import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import configuration from './config/configuration';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { MailModule } from './mail/mail.module';
import { ProductsModule } from './products/products.module';
import { CategoriesModule } from './categories/categories.module';
import { JwtAuthGuard } from './common/guards/jwt-auth.guard';
import { OrdersModule } from './orders/orders.module';
import { PaymentsModule } from './payments/payments.module';
import { WishlistModule } from './wishlist/wishlist.module';
import { CouponsModule } from './coupons/coupons.module';
import { WaitlistModule } from './waitlist/waitlist.module';
import { FitProfileModule } from './fit-profile/fit-profile.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { StoreSettingsModule } from './store-settings/store-settings.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    PrismaModule,
    AuthModule,
    UsersModule,
    MailModule,
    ProductsModule,
    CategoriesModule,
    OrdersModule,
    PaymentsModule,
    WishlistModule,
    CouponsModule,
    WaitlistModule,
    FitProfileModule,
    DashboardModule,
    StoreSettingsModule,
  ],
  providers: [
    // Apply JWT guard globally — use @Public() to exempt routes
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}

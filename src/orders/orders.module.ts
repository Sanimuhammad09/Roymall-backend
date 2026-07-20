import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { MailModule } from '../mail/mail.module';
import { InvoiceService } from './invoice.service';

@Module({
  imports: [MailModule],
  providers: [OrdersService, InvoiceService],
  controllers: [OrdersController],
  exports: [OrdersService, InvoiceService],
})
export class OrdersModule {}

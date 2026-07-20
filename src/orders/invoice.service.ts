import { Injectable } from '@nestjs/common';
import PDFDocument from 'pdfkit';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class InvoiceService {
  async generateInvoice(order: any): Promise<string> {
    return new Promise((resolve, reject) => {
      try {
        const doc = new PDFDocument({ margin: 50 });
        const invoicesDir = path.join(process.cwd(), 'uploads', 'invoices');
        
        if (!fs.existsSync(invoicesDir)) {
          fs.mkdirSync(invoicesDir, { recursive: true });
        }

        const fileName = `invoice-${order.orderNumber}.pdf`;
        const filePath = path.join(invoicesDir, fileName);

        const writeStream = fs.createWriteStream(filePath);
        doc.pipe(writeStream);

        // Header
        doc.fillColor('#111111')
           .fontSize(24)
           .text('ROYMALL SCENTS', { align: 'right' });
        
        doc.fontSize(10)
           .text('Invoice for Order:', { align: 'right' })
           .fontSize(12)
           .text(order.orderNumber, { align: 'right' });

        doc.moveDown(2);

        // Customer Details
        doc.fontSize(12).text('Billed To:');
        doc.fontSize(10)
           .text(`${order.user.firstName} ${order.user.lastName}`)
           .text(order.shippingAddress.address1)
           .text(`${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.zipCode}`)
           .text(order.user.email);

        doc.moveDown(2);

        // Items Table Header
        const tableTop = doc.y;
        doc.font('Helvetica-Bold');
        doc.text('Item', 50, tableTop)
           .text('Quantity', 300, tableTop)
           .text('Price', 400, tableTop)
           .text('Total', 480, tableTop);
        
        doc.moveTo(50, tableTop + 15).lineTo(550, tableTop + 15).stroke();
        
        let position = tableTop + 25;
        doc.font('Helvetica');

        order.items.forEach((item: any) => {
          const itemTotal = item.quantity * item.unitPrice;
          
          doc.text(item.variant?.product?.name || 'Product', 50, position, { width: 240 })
             .text(item.quantity.toString(), 300, position)
             .text(`$${item.unitPrice.toFixed(2)}`, 400, position)
             .text(`$${itemTotal.toFixed(2)}`, 480, position);
             
          position += 20;
        });

        doc.moveTo(50, position + 10).lineTo(550, position + 10).stroke();

        // Totals
        position += 25;
        doc.font('Helvetica-Bold');
        doc.text('Subtotal:', 380, position).text(`$${order.subtotal.toFixed(2)}`, 480, position);
        
        if (order.discountAmount > 0) {
          position += 15;
          doc.text('Discount:', 380, position).text(`-$${order.discountAmount.toFixed(2)}`, 480, position);
        }

        position += 15;
        doc.text('Shipping:', 380, position).text(`$${order.shippingCost.toFixed(2)}`, 480, position);
        
        position += 15;
        doc.text('Tax:', 380, position).text(`$${order.taxAmount.toFixed(2)}`, 480, position);

        position += 20;
        doc.fontSize(14).text('Total:', 380, position).text(`$${order.totalAmount.toFixed(2)}`, 480, position);

        doc.end();

        writeStream.on('finish', () => {
          resolve(`/uploads/invoices/${fileName}`);
        });

        writeStream.on('error', (err) => {
          reject(err);
        });

      } catch (error) {
        reject(error);
      }
    });
  }
}

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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvoiceService = void 0;
const common_1 = require("@nestjs/common");
const pdfkit_1 = __importDefault(require("pdfkit"));
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
let InvoiceService = class InvoiceService {
    async generateInvoice(order) {
        return new Promise((resolve, reject) => {
            try {
                const doc = new pdfkit_1.default({ margin: 50 });
                const invoicesDir = path.join(process.cwd(), 'uploads', 'invoices');
                if (!fs.existsSync(invoicesDir)) {
                    fs.mkdirSync(invoicesDir, { recursive: true });
                }
                const fileName = `invoice-${order.orderNumber}.pdf`;
                const filePath = path.join(invoicesDir, fileName);
                const writeStream = fs.createWriteStream(filePath);
                doc.pipe(writeStream);
                doc.fillColor('#111111')
                    .fontSize(24)
                    .text('ROYMALL SCENTS', { align: 'right' });
                doc.fontSize(10)
                    .text('Invoice for Order:', { align: 'right' })
                    .fontSize(12)
                    .text(order.orderNumber, { align: 'right' });
                doc.moveDown(2);
                doc.fontSize(12).text('Billed To:');
                doc.fontSize(10)
                    .text(`${order.user.firstName} ${order.user.lastName}`)
                    .text(order.shippingAddress.address1)
                    .text(`${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.zipCode}`)
                    .text(order.user.email);
                doc.moveDown(2);
                const tableTop = doc.y;
                doc.font('Helvetica-Bold');
                doc.text('Item', 50, tableTop)
                    .text('Quantity', 300, tableTop)
                    .text('Price', 400, tableTop)
                    .text('Total', 480, tableTop);
                doc.moveTo(50, tableTop + 15).lineTo(550, tableTop + 15).stroke();
                let position = tableTop + 25;
                doc.font('Helvetica');
                order.items.forEach((item) => {
                    const itemTotal = item.quantity * item.unitPrice;
                    doc.text(item.variant?.product?.name || 'Product', 50, position, { width: 240 })
                        .text(item.quantity.toString(), 300, position)
                        .text(`$${item.unitPrice.toFixed(2)}`, 400, position)
                        .text(`$${itemTotal.toFixed(2)}`, 480, position);
                    position += 20;
                });
                doc.moveTo(50, position + 10).lineTo(550, position + 10).stroke();
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
            }
            catch (error) {
                reject(error);
            }
        });
    }
};
exports.InvoiceService = InvoiceService;
exports.InvoiceService = InvoiceService = __decorate([
    (0, common_1.Injectable)()
], InvoiceService);
//# sourceMappingURL=invoice.service.js.map
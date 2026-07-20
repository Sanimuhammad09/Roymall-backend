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
exports.AppController = void 0;
const common_1 = require("@nestjs/common");
const app_service_1 = require("./app.service");
const public_decorator_1 = require("./common/decorators/public.decorator");
const prisma_service_1 = require("./prisma/prisma.service");
const bcrypt = __importStar(require("bcrypt"));
let AppController = class AppController {
    appService;
    prisma;
    constructor(appService, prisma) {
        this.appService = appService;
        this.prisma = prisma;
    }
    getHello() {
        return this.appService.getHello();
    }
    async seed() {
        try {
            console.log('Seeding via endpoint...');
            const adminPassword = await bcrypt.hash('admin123', 10);
            const userPassword = await bcrypt.hash('user123', 10);
            const admin = await this.prisma.user.upsert({
                where: { email: 'admin@roymallscents.com' },
                update: {},
                create: {
                    email: 'admin@roymallscents.com',
                    passwordHash: adminPassword,
                    firstName: 'Admin',
                    lastName: 'User',
                    role: 'ADMIN',
                    isEmailVerified: true,
                },
            });
            const user = await this.prisma.user.upsert({
                where: { email: 'customer@example.com' },
                update: {},
                create: {
                    email: 'customer@example.com',
                    passwordHash: userPassword,
                    firstName: 'Jane',
                    lastName: 'Doe',
                    role: 'USER',
                    isEmailVerified: true,
                },
            });
            const womenCol = await this.prisma.collection.upsert({
                where: { slug: 'women' },
                update: {},
                create: { name: 'Women', slug: 'women', description: "Women's Fragrances" },
            });
            const menCol = await this.prisma.collection.upsert({
                where: { slug: 'men' },
                update: {},
                create: { name: 'Men', slug: 'men', description: "Men's Colognes" },
            });
            const categoriesList = [
                { name: "Women's Fragrances", slug: 'womens-fragrances', description: 'Exquisite perfumes for her', image: '/images/perfume_floral.png' },
                { name: "Men's Fragrances", slug: 'mens-fragrances', description: 'Signature colognes for him', image: '/images/perfume_designer.png' },
                { name: 'Eau de Parfum', slug: 'eau-de-parfum', description: 'Highly concentrated, long-lasting scents', image: '/images/perfume_luxury.png' },
                { name: 'Eau de Toilette', slug: 'eau-de-toilette', description: 'Light, fresh daily wear scents', image: '/images/perfume_product.png' },
                { name: 'Travel Sizes', slug: 'travel-sizes', description: 'Compact and ready for travel', image: '/images/perfume_floral.png' },
                { name: 'Gift Sets', slug: 'gift-sets', description: 'Curated premium perfume collections', image: '/images/perfume_oud.png' }
            ];
            const catMap = {};
            for (const cat of categoriesList) {
                const dbCat = await this.prisma.category.upsert({
                    where: { slug: cat.slug },
                    update: { image: cat.image, description: cat.description },
                    create: { name: cat.name, slug: cat.slug, description: cat.description, image: cat.image }
                });
                catMap[cat.slug] = dbCat.id;
            }
            await this.prisma.product.upsert({
                where: { slug: 'velvet-rose-eau-de-parfum' },
                update: { basePrice: 125000 },
                create: {
                    name: 'Velvet Rose Eau de Parfum',
                    slug: 'velvet-rose-eau-de-parfum',
                    description: 'A luxurious blend of damask rose, smoked oud, and delicate praline for a deeply romantic scent.',
                    basePrice: 125000,
                    categoryId: catMap['womens-fragrances'],
                    collectionId: womenCol.id,
                    isFeatured: true,
                    images: {
                        create: [
                            { url: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=1974&auto=format&fit=crop', isMain: true },
                        ],
                    },
                    variants: {
                        create: [
                            { sku: 'W-VROSE-50', color: 'Rose Gold', size: '50ml', inventory: 100 },
                            { sku: 'W-VROSE-100', color: 'Rose Gold', size: '100ml', inventory: 150 },
                        ],
                    },
                },
            });
            await this.prisma.product.upsert({
                where: { slug: 'midnight-wood-cologne' },
                update: { basePrice: 140000 },
                create: {
                    name: 'Midnight Wood Cologne',
                    slug: 'midnight-wood-cologne',
                    description: 'An intense, masculine fragrance featuring rich cedarwood, dark amber, and a hint of black pepper.',
                    basePrice: 140000,
                    categoryId: catMap['mens-fragrances'],
                    collectionId: menCol.id,
                    isFeatured: true,
                    images: {
                        create: [
                            { url: 'https://images.unsplash.com/photo-1622618991746-fe6004db3a47?q=80&w=1974&auto=format&fit=crop', isMain: true },
                        ],
                    },
                    variants: {
                        create: [
                            { sku: 'M-MWOOD-50', color: 'Matte Black', size: '50ml', inventory: 120 },
                            { sku: 'M-MWOOD-100', color: 'Matte Black', size: '100ml', inventory: 130 },
                        ],
                    },
                },
            });
            await this.prisma.product.upsert({
                where: { slug: 'citrus-bliss-cologne' },
                update: { basePrice: 95000 },
                create: {
                    name: 'Citrus Bliss Cologne',
                    slug: 'citrus-bliss-cologne',
                    description: 'An invigorating splash of Sicilian lemon, bergamot, and white musk. Fresh and clean.',
                    basePrice: 95000,
                    categoryId: catMap['mens-fragrances'],
                    collectionId: menCol.id,
                    isFeatured: true,
                    images: {
                        create: [
                            { url: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=800&auto=format&fit=crop&q=60', isMain: true },
                        ],
                    },
                    variants: {
                        create: [
                            { sku: 'M-CITRUS-50', color: 'Clear', size: '50ml', inventory: 200 },
                            { sku: 'M-CITRUS-100', color: 'Clear', size: '100ml', inventory: 100 },
                        ],
                    },
                },
            });
            await this.prisma.product.upsert({
                where: { slug: 'royal-oud-parfum' },
                update: { basePrice: 185000 },
                create: {
                    name: 'Royal Oud Parfum',
                    slug: 'royal-oud-parfum',
                    description: 'A majestic, luxurious blend of rare agarwood, spicy cardamom, and sweet vanilla.',
                    basePrice: 185000,
                    categoryId: catMap['mens-fragrances'],
                    collectionId: menCol.id,
                    isFeatured: true,
                    images: {
                        create: [
                            { url: 'https://images.unsplash.com/photo-1547887537-6158d64c35b3?q=80&w=600&auto=format&fit=crop', isMain: true },
                        ],
                    },
                    variants: {
                        create: [
                            { sku: 'M-ROUD-50', color: 'Gold', size: '50ml', inventory: 80 },
                            { sku: 'M-ROUD-100', color: 'Gold', size: '100ml', inventory: 90 },
                        ],
                    },
                },
            });
            await this.prisma.product.upsert({
                where: { slug: 'aura-eau-de-parfum' },
                update: { basePrice: 150000 },
                create: {
                    name: 'Aura Eau de Parfum',
                    slug: 'aura-eau-de-parfum',
                    description: 'A clean and luminous floral fragrance with notes of white jasmine, fresh pear, and soft cashmere wood.',
                    basePrice: 150000,
                    categoryId: catMap['womens-fragrances'],
                    collectionId: womenCol.id,
                    isFeatured: true,
                    images: {
                        create: [
                            { url: 'https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?w=800&auto=format&fit=crop&q=60', isMain: true },
                        ],
                    },
                    variants: {
                        create: [
                            { sku: 'W-AURA-50', color: 'Silver', size: '50ml', inventory: 150 },
                            { sku: 'W-AURA-100', color: 'Silver', size: '100ml', inventory: 110 },
                        ],
                    },
                },
            });
            await this.prisma.product.upsert({
                where: { slug: 'midnight-rose-extrait' },
                update: { basePrice: 240000 },
                create: {
                    name: 'Midnight Rose Extrait',
                    slug: 'midnight-rose-extrait',
                    description: 'A mysterious, opulent scent combining rich Turkish rose, patchouli, and dark incense.',
                    basePrice: 240000,
                    categoryId: catMap['womens-fragrances'],
                    collectionId: womenCol.id,
                    isFeatured: true,
                    images: {
                        create: [
                            { url: 'https://images.unsplash.com/photo-1616401784845-180882ba9ba8?w=800&auto=format&fit=crop&q=60', isMain: true },
                        ],
                    },
                    variants: {
                        create: [
                            { sku: 'W-MROSE-50', color: 'Purple', size: '50ml', inventory: 60 },
                            { sku: 'W-MROSE-100', color: 'Purple', size: '100ml', inventory: 70 },
                        ],
                    },
                },
            });
            await this.prisma.product.upsert({
                where: { slug: 'santal-noir' },
                update: { basePrice: 195000 },
                create: {
                    name: 'Santal Noir Eau de Parfum',
                    slug: 'santal-noir',
                    description: 'A warm, magnetic sandalwood fragrance wrapped in soft leather and spicy cardamom.',
                    basePrice: 195000,
                    categoryId: catMap['womens-fragrances'],
                    collectionId: womenCol.id,
                    isFeatured: true,
                    images: {
                        create: [
                            { url: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=800&auto=format&fit=crop&q=60', isMain: true },
                        ],
                    },
                    variants: {
                        create: [
                            { sku: 'W-SANTAL-50', color: 'Dark Amber', size: '50ml', inventory: 100 },
                            { sku: 'W-SANTAL-100', color: 'Dark Amber', size: '100ml', inventory: 120 },
                        ],
                    },
                },
            });
            await this.prisma.product.upsert({
                where: { slug: 'discovery-travel-set' },
                update: { basePrice: 45000 },
                create: {
                    name: 'Discovery Travel Set',
                    slug: 'discovery-travel-set',
                    description: 'A curated collection of our signature scents in travel-friendly sizes. The perfect introduction to Roymall Scents.',
                    basePrice: 45000,
                    categoryId: catMap['travel-sizes'],
                    collectionId: womenCol.id,
                    isFeatured: true,
                    images: {
                        create: [
                            { url: 'https://images.unsplash.com/photo-1599839619722-39751411ea63?q=80&w=1200&auto=format&fit=crop', isMain: true },
                        ],
                    },
                    variants: {
                        create: [
                            { sku: 'UNI-DISC-SET', color: 'White Box', size: '5x10ml', inventory: 300 },
                        ],
                    },
                },
            });
            await this.prisma.product.upsert({
                where: { slug: 'premium-gift-box-set' },
                update: { basePrice: 275000 },
                create: {
                    name: 'Premium Gift Box Set',
                    slug: 'premium-gift-box-set',
                    description: 'An elegant gift box featuring a full-size Eau de Parfum and a matching scented body oil.',
                    basePrice: 275000,
                    categoryId: catMap['gift-sets'],
                    collectionId: womenCol.id,
                    isFeatured: true,
                    images: {
                        create: [
                            { url: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?q=80&w=600&auto=format&fit=crop', isMain: true },
                        ],
                    },
                    variants: {
                        create: [
                            { sku: 'UNI-GIFT-SET', color: 'Gold Box', size: '100ml+50ml', inventory: 150 },
                        ],
                    },
                },
            });
            const newProducts = [
                { name: 'Rose & Vanilla Sensuelle', slug: 'rose-vanilla-sensuelle', price: 165000, col: womenCol.id, cat: catMap['eau-de-parfum'], color: 'Rose', hex: '#E8A598' },
                { name: 'Jasmine Bloom', slug: 'jasmine-bloom', price: 145000, col: womenCol.id, cat: catMap['eau-de-parfum'], color: 'Clear', hex: '#FFFFFF' },
                { name: 'Peony & Blush', slug: 'peony-and-blush', price: 180000, col: womenCol.id, cat: catMap['eau-de-parfum'], color: 'Pink', hex: '#FFC0CB' },
                { name: 'Citrus Sun', slug: 'citrus-sun', price: 95000, col: womenCol.id, cat: catMap['eau-de-toilette'], color: 'Yellow', hex: '#FFFF00' },
                { name: 'Ocean Breeze', slug: 'ocean-breeze', price: 110000, col: womenCol.id, cat: catMap['eau-de-toilette'], color: 'Aqua', hex: '#00FFFF' },
                { name: 'Midnight Oud', slug: 'midnight-oud', price: 210000, col: menCol.id, cat: catMap['eau-de-parfum'], color: 'Black', hex: '#000000' },
                { name: 'Leather & Spice', slug: 'leather-and-spice', price: 195000, col: menCol.id, cat: catMap['eau-de-parfum'], color: 'Brown', hex: '#8B4513' },
                { name: 'Cedarwood Intense', slug: 'cedarwood-intense', price: 175000, col: menCol.id, cat: catMap['eau-de-parfum'], color: 'Wood', hex: '#D2B48C' },
                { name: 'Cool Water Burst', slug: 'cool-water-burst', price: 105000, col: menCol.id, cat: catMap['eau-de-toilette'], color: 'Blue', hex: '#0000FF' },
                { name: 'Green Vetiver', slug: 'green-vetiver', price: 120000, col: menCol.id, cat: catMap['eau-de-toilette'], color: 'Green', hex: '#008000' },
                { name: 'Santal Supreme', slug: 'santal-supreme', price: 230000, col: womenCol.id, cat: catMap['eau-de-parfum'], color: 'Amber', hex: '#FFBF00' },
                { name: 'Bergamot & Musk', slug: 'bergamot-and-musk', price: 185000, col: menCol.id, cat: catMap['eau-de-parfum'], color: 'Silver', hex: '#C0C0C0' },
                { name: 'Ultimate Discovery Set', slug: 'ultimate-discovery-set', price: 65000, col: womenCol.id, cat: catMap['gift-sets'], color: 'Multi', hex: '#808080' },
                { name: 'His & Hers Duo', slug: 'his-and-hers-duo', price: 320000, col: womenCol.id, cat: catMap['gift-sets'], color: 'Gold', hex: '#FFD700' },
                { name: 'Aura Travel Spray', slug: 'aura-travel-spray', price: 45000, col: womenCol.id, cat: catMap['travel-sizes'], color: 'Rose', hex: '#E8A598' },
                { name: 'Oud Velvet Mini', slug: 'oud-velvet-mini', price: 55000, col: menCol.id, cat: catMap['travel-sizes'], color: 'Black', hex: '#000000' }
            ];
            for (const p of newProducts) {
                await this.prisma.product.upsert({
                    where: { slug: p.slug },
                    update: { basePrice: p.price },
                    create: {
                        name: p.name,
                        slug: p.slug,
                        description: `Experience the captivating essence of ${p.name}. A truly remarkable fragrance crafted for those who appreciate fine perfumery.`,
                        basePrice: p.price,
                        categoryId: p.cat || catMap['womens-fragrances'],
                        collectionId: p.col,
                        isFeatured: true,
                        fabricDetails: 'Top Notes: Citrus, Floral. Heart Notes: Jasmine, Spice. Base Notes: Wood, Vanilla, Amber.',
                        careInstructions: 'Alcohol Denat., Water (Aqua), Fragrance (Parfum). Store in a cool, dry place.',
                        images: {
                            create: [
                                { url: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=800&auto=format&fit=crop&q=60', isMain: true },
                                { url: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=1974&auto=format&fit=crop', isMain: false },
                            ]
                        },
                        variants: {
                            create: [
                                { sku: `${p.slug.toUpperCase().substring(0, 6)}-50ML`, color: p.color, colorHex: p.hex, size: p.cat === catMap['travel-sizes'] ? '10ml' : '50ml', inventory: 50 },
                            ]
                        }
                    }
                });
            }
            return { status: 'success', message: 'Seeding completed successfully!' };
        }
        catch (e) {
            console.error(e);
            return { status: 'error', error: e.message || e };
        }
    }
};
exports.AppController = AppController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", String)
], AppController.prototype, "getHello", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)('seed'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AppController.prototype, "seed", null);
exports.AppController = AppController = __decorate([
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [app_service_1.AppService,
        prisma_service_1.PrismaService])
], AppController);
//# sourceMappingURL=app.controller.js.map
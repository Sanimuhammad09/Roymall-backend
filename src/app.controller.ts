import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { Public } from './common/decorators/public.decorator';
import { PrismaService } from './prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly prisma: PrismaService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Public()
  @Get('seed')
  async seed() {
    try {
      console.log('Seeding via endpoint...');
      
      // --- 1. Users ---
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

      // --- 2. Collections ---
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

      // --- 3. Categories ---
      const categoriesList = [
        { name: "Women's Fragrances", slug: 'womens-fragrances', description: 'Exquisite perfumes for her', image: '/images/perfume_floral.png' },
        { name: "Men's Fragrances", slug: 'mens-fragrances', description: 'Signature colognes for him', image: '/images/perfume_designer.png' },
        { name: 'Eau de Parfum', slug: 'eau-de-parfum', description: 'Highly concentrated, long-lasting scents', image: '/images/perfume_luxury.png' },
        { name: 'Eau de Toilette', slug: 'eau-de-toilette', description: 'Light, fresh daily wear scents', image: '/images/perfume_product.png' },
        { name: 'Travel Sizes', slug: 'travel-sizes', description: 'Compact and ready for travel', image: '/images/perfume_floral.png' },
        { name: 'Gift Sets', slug: 'gift-sets', description: 'Curated premium perfume collections', image: '/images/perfume_oud.png' }
      ];

      const catMap: Record<string, string> = {};
      for (const cat of categoriesList) {
        const dbCat = await this.prisma.category.upsert({
          where: { slug: cat.slug },
          update: { image: cat.image, description: cat.description },
          create: { name: cat.name, slug: cat.slug, description: cat.description, image: cat.image }
        });
        catMap[cat.slug] = dbCat.id;
      }

      // --- 4. Products ---
      // Velvet Rose
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

      // Midnight Wood
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

      // Citrus Bliss
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

      // Royal Oud
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

      // Aura
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

      // Midnight Rose
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

      // Santal Noir
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

      // Discovery Travel Set
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

      // Premium Gift Box Set
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

      return { status: 'success', message: 'Seeding completed successfully!' };
    } catch (e: any) {
      console.error(e);
      return { status: 'error', error: e.message || e };
    }
  }
}

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding categories and products...');

  // Create Categories
  const parfumCat = await prisma.category.upsert({
    where: { slug: 'eau-de-parfum' },
    update: {},
    create: {
      name: 'Eau de Parfum',
      slug: 'eau-de-parfum',
      description: 'Highly concentrated premium fragrances with long-lasting scent profiles.',
    },
  });

  const toiletteCat = await prisma.category.upsert({
    where: { slug: 'eau-de-toilette' },
    update: {},
    create: {
      name: 'Eau de Toilette',
      slug: 'eau-de-toilette',
      description: 'Light and refreshing daily wear fragrances.',
    },
  });

  // Create Products
  const royalOud = await prisma.product.upsert({
    where: { slug: 'royal-oud-parfum' },
    update: { isFeatured: true },
    create: {
      name: 'Royal Oud Parfum',
      slug: 'royal-oud-parfum',
      description: 'A majestic blend of rich agarwood, spicy cardamom, and sweet vanilla.',
      basePrice: 185000,
      categoryId: parfumCat.id,
      isFeatured: true,
      fabricDetails: 'Top Notes: Cardamom. Heart Notes: Jasmine. Base Notes: Oud, Vanilla.',
      careInstructions: 'Store in a cool, dry place away from direct sunlight.',
      images: {
        create: [
          { url: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?w=800&auto=format&fit=crop&q=60', isMain: true }
        ]
      },
      variants: {
        create: [
          { sku: 'PARF-OUD-50', color: 'Gold', size: '50ml', inventory: 150 },
          { sku: 'PARF-OUD-100', color: 'Gold', size: '100ml', inventory: 120 },
        ]
      }
    },
  });

  const citrusBreeze = await prisma.product.upsert({
    where: { slug: 'citrus-breeze-toilette' },
    update: { isFeatured: true },
    create: {
      name: 'Citrus Breeze Toilette',
      slug: 'citrus-breeze-toilette',
      description: 'An invigorating splash of Sicilian lemon, bergamot, and white musk.',
      basePrice: 95000,
      categoryId: toiletteCat.id,
      isFeatured: true,
      fabricDetails: 'Top Notes: Lemon, Bergamot. Heart Notes: Jasmine. Base Notes: White Musk.',
      careInstructions: 'Store in a cool, dry place.',
      images: {
        create: [
          { url: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=800&auto=format&fit=crop&q=60', isMain: true }
        ]
      },
      variants: {
        create: [
          { sku: 'TOIL-CITRUS-50', color: 'Clear', size: '50ml', inventory: 200 },
          { sku: 'TOIL-CITRUS-100', color: 'Clear', size: '100ml', inventory: 100 }
        ]
      }
    },
  });

  console.log('Seeding complete! Products and Categories added.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

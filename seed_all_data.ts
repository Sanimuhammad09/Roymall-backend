import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding Collections...');
  const womenCol = await prisma.collection.upsert({
    where: { slug: 'women' },
    update: {},
    create: { name: 'Women', slug: 'women', description: "Women's Fragrances" },
  });

  const menCol = await prisma.collection.upsert({
    where: { slug: 'men' },
    update: {},
    create: { name: 'Men', slug: 'men', description: "Men's Colognes" },
  });

  console.log('Seeding Categories...');
  const categories = [
    { name: 'Eau de Parfum', slug: 'eau-de-parfum', image: '/images/perfume_floral.png' },
    { name: 'Eau de Toilette', slug: 'eau-de-toilette', image: '/images/perfume_designer.png' },
    { name: 'Travel Sizes', slug: 'travel-sizes', image: '/images/perfume_luxury.png' },
    { name: 'Gift Sets', slug: 'gift-sets', image: '/images/perfume_oud.png' },
    { name: 'Accessories', slug: 'accessories', image: '/images/perfume_product.png' },
  ];

  const catMap: Record<string, string> = {};
  for (const c of categories) {
    const cat = await prisma.category.upsert({
      where: { slug: c.slug },
      update: { image: c.image },
      create: { name: c.name, slug: c.slug, image: c.image },
    });
    catMap[c.slug] = cat.id;
  }

  console.log('Seeding Products...');
  await prisma.product.upsert({
    where: { slug: 'womens-classic-perfume' },
    update: {},
    create: {
      name: 'Women\'s Classic Perfume',
      slug: 'womens-classic-perfume',
      description: 'A timeless floral bouquet with notes of jasmine, rose, and a hint of vanilla. Elegant and sophisticated for any occasion.',
      basePrice: 145000,
      categoryId: catMap['eau-de-parfum'],
      collectionId: womenCol.id,
      isFeatured: true,
      images: { create: [{ url: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?w=800', isMain: true }] },
      variants: {
        create: [
          { sku: 'W-PERF-GLD-50', color: 'Gold', colorHex: '#FFD700', size: '50ml', inventory: 50 },
          { sku: 'W-PERF-GLD-100', color: 'Gold', colorHex: '#FFD700', size: '100ml', inventory: 50 },
        ]
      }
    }
  });

  await prisma.product.upsert({
    where: { slug: 'womens-summer-breeze' },
    update: {},
    create: {
      name: 'Women\'s Summer Breeze',
      slug: 'womens-summer-breeze',
      description: 'Light, refreshing, and airy. Perfect for warm days with bright citrus top notes and a clean musk base.',
      basePrice: 120000,
      categoryId: catMap['eau-de-toilette'],
      collectionId: womenCol.id,
      isFeatured: true,
      images: { create: [{ url: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=800', isMain: true }] },
      variants: {
        create: [
          { sku: 'W-SUMM-CLR-50', color: 'Clear', colorHex: '#FFFFFF', size: '50ml', inventory: 50 },
          { sku: 'W-SUMM-CLR-100', color: 'Clear', colorHex: '#FFFFFF', size: '100ml', inventory: 50 },
        ]
      }
    }
  });

  await prisma.product.upsert({
    where: { slug: 'mens-signature-cologne' },
    update: {},
    create: {
      name: 'Men\'s Signature Cologne',
      slug: 'mens-signature-cologne',
      description: 'A bold, masculine signature scent featuring deep woods, amber, and a touch of black pepper.',
      basePrice: 155000,
      categoryId: catMap['eau-de-parfum'],
      collectionId: menCol.id,
      isFeatured: true,
      images: { create: [{ url: 'https://images.unsplash.com/photo-1622618991746-fe6004db3a47?w=800', isMain: true }] },
      variants: {
        create: [
          { sku: 'M-SIG-BLK-50', color: 'Black', colorHex: '#000000', size: '50ml', inventory: 40 },
          { sku: 'M-SIG-BLK-100', color: 'Black', colorHex: '#000000', size: '100ml', inventory: 40 },
        ]
      }
    }
  });

  await prisma.product.upsert({
    where: { slug: 'mens-ocean-sport' },
    update: {},
    create: {
      name: 'Men\'s Ocean Sport',
      slug: 'mens-ocean-sport',
      description: 'Crisp aquatic notes blended with energizing citrus. The perfect daily scent for the active man.',
      basePrice: 115000,
      categoryId: catMap['eau-de-toilette'],
      collectionId: menCol.id,
      isFeatured: true,
      images: { create: [{ url: 'https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?w=800', isMain: true }] },
      variants: {
        create: [
          { sku: 'M-OCEAN-BLU-50', color: 'Blue', colorHex: '#0000FF', size: '50ml', inventory: 40 },
          { sku: 'M-OCEAN-BLU-100', color: 'Blue', colorHex: '#0000FF', size: '100ml', inventory: 40 },
        ]
      }
    }
  });

  await prisma.product.upsert({
    where: { slug: 'unisex-royal-oud' },
    update: {},
    create: {
      name: 'Unisex Royal Oud',
      slug: 'unisex-royal-oud',
      description: 'An exotic, luxurious blend of rare oud wood, spices, and a hint of sweet vanilla. Perfect for evening wear.',
      basePrice: 195000,
      categoryId: catMap['eau-de-parfum'],
      collectionId: womenCol.id, // Shared
      isFeatured: true,
      images: { create: [{ url: 'https://images.unsplash.com/photo-1616401784845-180882ba9ba8?w=800', isMain: true }] },
      variants: {
        create: [
          { sku: 'UNI-OUD-GLD-50', color: 'Gold', colorHex: '#FFD700', size: '50ml', inventory: 60 },
          { sku: 'UNI-OUD-GLD-100', color: 'Gold', colorHex: '#FFD700', size: '100ml', inventory: 60 },
        ]
      }
    }
  });

  console.log('Seeding complete!');
}

main().catch(e => console.error(e)).finally(() => prisma.$disconnect());

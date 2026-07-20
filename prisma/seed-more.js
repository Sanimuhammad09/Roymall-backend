const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const newProducts = [
  // Women's Eau de Parfum
  { name: 'Rose & Vanilla Sensuelle', slug: 'rose-vanilla-sensuelle', price: 165.0, col: 'women', cat: 'eau-de-parfum', color: 'Rose', hex: '#E8A598' },
  { name: 'Jasmine Bloom', slug: 'jasmine-bloom', price: 145.0, col: 'women', cat: 'eau-de-parfum', color: 'Clear', hex: '#FFFFFF' },
  { name: 'Peony & Blush', slug: 'peony-and-blush', price: 180.0, col: 'women', cat: 'eau-de-parfum', color: 'Pink', hex: '#FFC0CB' },
  // Women's Eau de Toilette
  { name: 'Citrus Sun', slug: 'citrus-sun', price: 95.0, col: 'women', cat: 'eau-de-toilette', color: 'Yellow', hex: '#FFFF00' },
  { name: 'Ocean Breeze', slug: 'ocean-breeze', price: 110.0, col: 'women', cat: 'eau-de-toilette', color: 'Aqua', hex: '#00FFFF' },
  
  // Men's Eau de Parfum
  { name: 'Midnight Oud', slug: 'midnight-oud', price: 210.0, col: 'men', cat: 'eau-de-parfum', color: 'Black', hex: '#000000' },
  { name: 'Leather & Spice', slug: 'leather-and-spice', price: 195.0, col: 'men', cat: 'eau-de-parfum', color: 'Brown', hex: '#8B4513' },
  { name: 'Cedarwood Intense', slug: 'cedarwood-intense', price: 175.0, col: 'men', cat: 'eau-de-parfum', color: 'Wood', hex: '#D2B48C' },
  // Men's Eau de Toilette
  { name: 'Cool Water Burst', slug: 'cool-water-burst', price: 105.0, col: 'men', cat: 'eau-de-toilette', color: 'Blue', hex: '#0000FF' },
  { name: 'Green Vetiver', slug: 'green-vetiver', price: 120.0, col: 'men', cat: 'eau-de-toilette', color: 'Green', hex: '#008000' },
  
  // Unisex
  { name: 'Santal Supreme', slug: 'santal-supreme', price: 230.0, col: 'unisex', cat: 'eau-de-parfum', color: 'Amber', hex: '#FFBF00' },
  { name: 'Bergamot & Musk', slug: 'bergamot-and-musk', price: 185.0, col: 'unisex', cat: 'eau-de-parfum', color: 'Silver', hex: '#C0C0C0' },
  
  // Gift Sets
  { name: 'Ultimate Discovery Set', slug: 'ultimate-discovery-set', price: 65.0, col: 'unisex', cat: 'gifts', color: 'Multi', hex: '#808080' },
  { name: 'His & Hers Duo', slug: 'his-and-hers-duo', price: 320.0, col: 'unisex', cat: 'gifts', color: 'Gold', hex: '#FFD700' },
  
  // Travel Sizes
  { name: 'Aura Travel Spray', slug: 'aura-travel-spray', price: 45.0, col: 'women', cat: 'travel-sizes', color: 'Rose', hex: '#E8A598' },
  { name: 'Oud Velvet Mini', slug: 'oud-velvet-mini', price: 55.0, col: 'men', cat: 'travel-sizes', color: 'Black', hex: '#000000' }
];

async function main() {
  console.log('Seeding more products...');

  const womenCol = await prisma.collection.findUnique({ where: { slug: 'women' } });
  const menCol = await prisma.collection.findUnique({ where: { slug: 'men' } });
  const unisexCol = await prisma.collection.findUnique({ where: { slug: 'unisex' } });
  const colMap = { women: womenCol, men: menCol, unisex: unisexCol };

  const cats = await prisma.category.findMany();
  const catMap = {};
  cats.forEach(c => catMap[c.slug] = c);

  for (const p of newProducts) {
    const col = colMap[p.col];
    const cat = catMap[p.cat] || cats[0]; // fallback to first cat if not found

    const product = await prisma.product.upsert({
      where: { slug: p.slug },
      update: {},
      create: {
        name: p.name,
        slug: p.slug,
        description: `Experience the captivating essence of ${p.name}. A truly remarkable fragrance crafted for those who appreciate fine perfumery.`,
        basePrice: p.price,
        categoryId: cat.id,
        collectionId: col.id,
        isFeatured: true,
        fabricDetails: 'Top Notes: Citrus, Floral. Heart Notes: Jasmine, Spice. Base Notes: Wood, Vanilla, Amber.',
        careInstructions: 'Alcohol Denat., Water (Aqua), Fragrance (Parfum). Store in a cool, dry place.',
      }
    });

    console.log(`Created product: ${product.name}`);

    // Create single variant for the product
    await prisma.productVariant.create({
      data: {
        productId: product.id,
        sku: `${p.slug.toUpperCase().substring(0,6)}-50ML`,
        color: p.color,
        colorHex: p.hex,
        size: p.cat === 'travel-sizes' ? '10ml' : '50ml',
        priceOverride: p.price,
        inventory: 50,
      }
    });

    // Add some images
    const images = [
      { url: '/images/perfume_floral.png', altText: `${p.name} Front View`, isPrimary: true, order: 0 },
      { url: '/images/perfume_luxury.png', altText: `${p.name} Side View`, isPrimary: false, order: 1 },
      { url: '/images/perfume_designer.png', altText: `${p.name} Detail View`, isPrimary: false, order: 2 }
    ];

    for (const img of images) {
      await prisma.productImage.create({
        data: {
          productId: product.id,
          url: img.url,
          altText: img.altText,
          isPrimary: img.isPrimary,
          order: img.order,
        }
      });
    }
  }

  console.log('Seeding complete.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // --- Users ---
  const adminPassword = await bcrypt.hash('admin123', 10);
  const userPassword = await bcrypt.hash('user123', 10);

  const admin = await prisma.user.upsert({
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

  const user = await prisma.user.upsert({
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

  // --- Categories ---
  const womenCategory = await prisma.category.upsert({
    where: { slug: 'womens-fragrances' },
    update: {},
    create: { name: 'Women\'s Fragrances', slug: 'womens-fragrances', description: 'Exquisite perfumes for her' },
  });

  const menCategory = await prisma.category.upsert({
    where: { slug: 'mens-fragrances' },
    update: {},
    create: { name: 'Men\'s Fragrances', slug: 'mens-fragrances', description: 'Signature colognes for him' },
  });

  // --- Products ---
  const floralPerfume = await prisma.product.upsert({
    where: { slug: 'velvet-rose-eau-de-parfum' },
    update: {},
    create: {
      name: 'Velvet Rose Eau de Parfum',
      slug: 'velvet-rose-eau-de-parfum',
      description: 'A luxurious blend of damask rose, smoked oud, and delicate praline for a deeply romantic scent.',
      basePrice: 125.00,
      categoryId: womenCategory.id,
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

  const woodCologne = await prisma.product.upsert({
    where: { slug: 'midnight-wood-cologne' },
    update: {},
    create: {
      name: 'Midnight Wood Cologne',
      slug: 'midnight-wood-cologne',
      description: 'An intense, masculine fragrance featuring rich cedarwood, dark amber, and a hint of black pepper.',
      basePrice: 140.00,
      categoryId: menCategory.id,
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

  console.log('Seeding completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

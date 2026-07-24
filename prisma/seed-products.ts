import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const generateProducts = (family: string, count: number, startIdx: number) => {
  const images = [
    'https://lh3.googleusercontent.com/aida/AP1WRLs7lhs59CWcBZRC3eBkA6gDOWd0Sd-R5pXnfXphe-jcRu95HoEwfwZycrZzvhAobVINgEgMS6A_X7LzmV7E3qIlQ-NSIpySuyPfnG_pNuH9RORySsIm8CDjT2VNxkdx-Qk_UR94Baa7RDWgISm30-0uO_XzVNojTrV5ZtQsODbZVtA3B1eiFv7NN09wpUUcSLxvHZlef1Od559dMaiEu1Aqzf6kyvgDrXdLejq5mUoaF2lzksLkjeniKec',
    'https://lh3.googleusercontent.com/aida/AP1WRLvMpEBrp3hNfTZiz8E9kRjEcWhqR56gMcL7g2H6XdXnVj8xvYTkzOsimlEaE3ZxvBNoWBWSIklAC89B8SNW6rI86O_n6WI0u6nmVPIhIbzMGRCBhoAK6i7_U2O6F4s3qmYCNPKJcKfuhu5HTscjzBFSQTGcRpq36cCeoHLdjhsVUTS-1-ijigcnnsBzmv0H-9aYOBPcr5HrjAxWmUtOJA5bRKuRNC6_mgpjrC8yuIWAG317k5vh_I9jIwU',
    'https://lh3.googleusercontent.com/aida/AP1WRLtzInhxhAxvqi2L1o9iPujmqTHSyVdTSaFl8bJuIzpnMhZPp1TzekBX1eQ9YcoA2Se94VtxoKikY0qH5NNe-FR_Lz6GTalDSCvlEninjfcc4ZZhY4RefewE87sSbwQdxbLtaiAa_rUFvAMvddcvYukbyhs1HqUDzYdsXas9kYX24T63j6HCkaVhuRHEIKwZhxVSt0pGescBIjvGBc3WhUbDKEj2OVjhd7zq52nowOeps7o3Ush8aS4YO7Q',
    'https://lh3.googleusercontent.com/aida/AP1WRLvGWbfIGT7K3MB0ramNcnSKc-PEyoEMK_p0owDEj5DZBiOo8P8nPTbmRCZtZGayFah2krEvBsqO9QBFMH7lvGevUTXNo1jGCNlLoh9gLe-5aXPoZsZw4ghJV25jByy7SxN4Au3cJ23fAp9dUbB6LYssFMhV2f1kLZ67dw4-oJ-_9VW4GWp0uZbjKpMVQmjp05EnHLJPC6DxfgAfnsyjTSgZBXsR2yFjWm58DayxvtmQ7pddVC_ii_H2TP8',
    'https://lh3.googleusercontent.com/aida/AP1WRLsctGzKgIBkKa5Y0a7IaoZhHtRD1NBkcKvtbmm2n-ar3ZT1lM7JmGCSf38hoOGUi76vTY3i5tQY_-Zaq2__0xGVcxoaELvwzwCtqB-c4J6u4QWODMmOTT0T5QrkKsikPpIKLToZzu1dKkPnm-N-7hERhTKvIR4OXZTvLCZqFZv8xwDAyoyQ4InMLo_bUsTRIORmAdQeG-mOBr1Eb5X_AmS1QGPLHtDEp2RpUnKW6oYuq1qPJpYT2jDCtQ',
    'https://lh3.googleusercontent.com/aida/AP1WRLsp39ljzdd-ZvLvNUhmnWs3V1QaLLHSwvIhLQITr7uYUFbja-MO5AZRLAHqBeJK1P9CN5UaZ6iEmHo4LlnHM0bbRSiRM8ogekLlD5wA4CmiQFkQS6roUTnO5iTIbwdnDE2OeI_f4Po2B2w8ZXXviBq7zDi2by22zKckuUlrFGU1rcwS42tV_5YZleeEZeTWdeTedqD6ArdO5Pk6wLYxCbenuhRi3ks5XeQPMWnILoeQ17jeKb6msSs-IRQ'
  ];

  const products = [];
  for (let i = 0; i < count; i++) {
    const idNum = startIdx + i;
    products.push({
      name: `${family} Masterpiece ${idNum}`,
      tagline: `A signature ${family.toLowerCase()} scent`,
      description: `Experience the finest ${family.toLowerCase()} notes meticulously blended for long-lasting sillage.`,
      price: Math.floor(Math.random() * (250000 - 50000 + 1) + 50000), // Random price 50k to 250k
      sku: `ROY-${family.toUpperCase().substring(0, 3)}-${idNum}`,
      stockQuantity: Math.floor(Math.random() * 100) + 10,
      size: i % 2 === 0 ? "100ml" : "50ml",
      olfactoryFamily: family,
      isBestSeller: i < 3,
      isNewArrival: i > 7,
      topNotes: [`${family} Top 1`, `${family} Top 2`],
      heartNotes: [`${family} Heart 1`],
      baseNotes: [`${family} Base 1`],
      imageUrl: images[i % images.length],
    });
  }
  return products;
};

async function main() {
  // Find or create category
  let category = await prisma.category.findFirst();
  if (!category) {
    category = await prisma.category.create({
      data: { name: 'Unisex Collection', slug: 'unisex-collection', description: 'Universal scents for all.' }
    });
  }

  const allProductsData = [
    ...generateProducts('Floral', 10, 100),
    ...generateProducts('Citrus', 10, 200),
    ...generateProducts('Woody', 10, 300),
  ];

  let createdCount = 0;
  for (const p of allProductsData) {
    const existing = await prisma.product.findUnique({ where: { sku: p.sku } });
    if (!existing) {
      await prisma.product.create({
        data: {
          name: p.name,
          tagline: p.tagline,
          description: p.description,
          price: p.price,
          sku: p.sku,
          stockQuantity: p.stockQuantity,
          size: p.size,
          olfactoryFamily: p.olfactoryFamily,
          isBestSeller: p.isBestSeller,
          isNewArrival: p.isNewArrival,
          topNotes: p.topNotes,
          heartNotes: p.heartNotes,
          baseNotes: p.baseNotes,
          categoryId: category.id,
          images: {
            create: [
              {
                url: p.imageUrl,
                isPrimary: true,
                order: 1
              }
            ]
          }
        }
      });
      createdCount++;
    }
  }

  console.log(`Successfully seeded ${createdCount} products!`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

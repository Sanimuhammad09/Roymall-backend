import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const product = await prisma.product.findFirst();
  if (!product) {
    console.log("No product found");
    return;
  }
  
  // Try to update using the exact data format the frontend sends
  const productData = {
    name: product.name,
    sku: product.sku,
    price: product.price,
    stockQuantity: product.stockQuantity,
    categoryId: product.categoryId,
    tagline: product.tagline || "",
    description: product.description,
    isNewArrival: product.isNewArrival,
    isBestSeller: product.isBestSeller,
    topNotes: [],
    heartNotes: [],
    baseNotes: []
  };

  try {
    const updated = await prisma.product.update({
      where: { id: product.id },
      data: productData
    });
    console.log("SUCCESS:", updated.id);
  } catch (error) {
    console.error("PRISMA ERROR:", error);
  }
}

main().finally(() => prisma.$disconnect());

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const images = [
    {
      name: "Midnight Saffron",
      image: "https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=2000&auto=format&fit=crop"
    },
    {
      name: "Oud Royale",
      image: "https://images.unsplash.com/photo-1595425970377-c9703d740870?q=80&w=2000&auto=format&fit=crop"
    },
    {
      name: "Vanilla Silk",
      image: "https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?q=80&w=2000&auto=format&fit=crop"
    },
    {
      name: "Bergamot Coast",
      image: "https://images.unsplash.com/photo-1615529182904-14819c35db37?q=80&w=2000&auto=format&fit=crop"
    },
    {
      name: "L'Artisan Vetiver",
      image: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?q=80&w=2000&auto=format&fit=crop"
    },
    {
      name: "Rose Éclipse",
      image: "https://images.unsplash.com/photo-1595425964071-2b0704d9aab7?q=80&w=2000&auto=format&fit=crop"
    },
    {
      name: "Sandalwood Whisper",
      image: "https://images.unsplash.com/photo-1583445013765-46c20c4a6772?q=80&w=2000&auto=format&fit=crop"
    },
    {
      name: "Golden Nectar",
      image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?q=80&w=2000&auto=format&fit=crop"
    },
    {
      name: "Tobacco Lounge",
      image: "https://images.unsplash.com/photo-1629198688000-71f23e745b6e?q=80&w=2000&auto=format&fit=crop"
    },
    {
      name: "Figue Sauvage",
      image: "https://images.unsplash.com/photo-1616606016140-5e6080516b38?q=80&w=2000&auto=format&fit=crop"
    }
]

async function main() {
  console.log('Fetching products...')
  const products = await prisma.product.findMany()

  for (const product of products) {
    const data = images.find(img => img.name === product.name)
    if (data) {
      console.log(`Adding image for ${product.name}...`)
      // Check if image already exists
      const existing = await prisma.productImage.findFirst({
        where: { productId: product.id }
      })
      if (!existing) {
        await prisma.productImage.create({
          data: {
            productId: product.id,
            url: data.image,
            isPrimary: true,
          }
        })
        console.log(`✅ Image added for ${product.name}`)
      } else {
        console.log(`ℹ️ Image already exists for ${product.name}`)
      }
    }
  }
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

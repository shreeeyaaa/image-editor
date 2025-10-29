import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting seed...');

  // deleting existing 
  await prisma.layer.deleteMany();
  await prisma.design.deleteMany();
  await prisma.asset.deleteMany();
  
  console.log('🗑️  Cleared existing data');

  // sameple assets
  const asset1 = await prisma.asset.create({
    data: {
      originalName: 'background.jpg',
      mimeType: 'image/jpeg',
      width: 1920,
      height: 1080,
      sizeBytes: 150000,
      url: '/uploads/placeholder-bg.jpg',
    },
  });

  const asset2 = await prisma.asset.create({
    data: {
      originalName: 'logo.png',
      mimeType: 'image/png',
      width: 500,
      height: 500,
      sizeBytes: 50000,
      url: '/uploads/placeholder-logo.png',
    },
  });

  const asset3 = await prisma.asset.create({
    data: {
      originalName: 'sticker.png',
      mimeType: 'image/png',
      width: 300,
      height: 300,
      sizeBytes: 30000,
      url: '/uploads/placeholder-sticker.png',
    },
  });

  console.log('Created sample assets');

  // desgin with layers
  const design = await prisma.design.create({
    data: {
      title: 'My First Design',
      width: 1920,
      height: 1080,
      layers: {
        create: [
          {
            type: 'IMAGE',
            assetId: asset1.id,
            x: 0,
            y: 0,
            width: 1920,
            height: 1080,
            zIndex: 0,
          },
          {
            type: 'IMAGE',
            assetId: asset2.id,
            x: 710,
            y: 290,
            width: 500,
            height: 500,
            zIndex: 1,
            rotation: 0,
          },
          {
            type: 'IMAGE',
            assetId: asset3.id,
            x: 1400,
            y: 100,
            width: 300,
            height: 300,
            rotation: 15,
            zIndex: 2,
          },
        ],
      },
    },
    include: {
      layers: true,
    },
  });

  console.log('Created sample design with 3 layers');
  console.log(`   Design ID: ${design.id}`);
  console.log(`   Title: ${design.title}`);
  console.log('Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
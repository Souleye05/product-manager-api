import { PrismaClient } from '@prisma/client';
import { hashPassword } from '../src/utils/passwordUtils';

const prisma = new PrismaClient();

async function main() {
  // Création d'un utilisateur admin
  const adminPassword = await hashPassword('admin123');
  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      username: 'admin',
      email: 'admin@example.com',
      password: adminPassword,
      role: 'admin',
    },
  });

  // Création d'un utilisateur normal
  const userPassword = await hashPassword('user123');
  const user = await prisma.user.upsert({
    where: { email: 'user@example.com' },
    update: {},
    create: {
      username: 'user',
      email: 'user@example.com',
      password: userPassword,
      role: 'user',
    },
  });

  // Création de produits de démo
  const products = [
    {
      name: 'Laptop Pro',
      description: 'Un ordinateur portable puissant pour les professionnels',
      price: 1299.99,
      quantity: 50,
      category: 'Électronique',
      imageUrl: 'https://example.com/laptop.jpg',
      userId: admin.id,
    },
    {
      name: 'Smartphone X',
      description: 'Le dernier smartphone avec une excellente caméra',
      price: 899.99,
      quantity: 100,
      category: 'Électronique',
      imageUrl: 'https://example.com/smartphone.jpg',
      userId: admin.id,
    },
    {
      name: 'Casque audio sans fil',
      description: 'Casque Bluetooth avec réduction de bruit',
      price: 249.99,
      quantity: 75,
      category: 'Audio',
      imageUrl: 'https://example.com/headphones.jpg',
      userId: user.id,
    },
    {
      name: 'Montre connectée',
      description: 'Suivez votre activité physique et restez connecté',
      price: 199.99,
      quantity: 60,
      category: 'Wearable',
      imageUrl: 'https://example.com/smartwatch.jpg',
      userId: user.id,
    },
  ];

  for (const product of products) {
    await prisma.product.upsert({
      where: { 
        id: (await prisma.product.findFirst({ 
          where: { name: product.name } 
        }))?.id || 0 
      },
      update: product,
      create: product,
    });
  }

  console.log('Données d\'initialisation créées avec succès!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
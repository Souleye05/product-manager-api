import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

if (process.env.NODE_ENV === 'development') {
  prisma.$use(async (params, next) => {
    const before = Date.now();
    const result = await next(params);
    const after = Date.now();
    console.log(`Requête ${params.model}.${params.action} en ${after - before}ms`);
    return result;
  });
}

export default prisma;

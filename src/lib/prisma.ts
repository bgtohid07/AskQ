import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const defaultDbUrl = 'postgresql://neondb_owner:npg_nwkGQlzp87Tg@ep-wispy-wind-axy0tsnq-pooler.c-4.us-east-2.aws.neon.tech/neondb?sslmode=require';

const prismaClientSingleton = () => {
  const connectionString = process.env.DATABASE_URL || defaultDbUrl;
  
  // Neon PostgreSQL requires SSL in node pg.Pool
  const pool = new Pool({
    connectionString,
    ssl: { rejectUnauthorized: false },
    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 10000,
  });

  const adapter = new PrismaPg(pool);
  return new PrismaClient({ adapter });
};

declare global {
  var prismaGlobal: undefined | ReturnType<typeof prismaClientSingleton>;
}

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();

export default prisma;

if (process.env.NODE_ENV !== 'production') globalThis.prismaGlobal = prisma;

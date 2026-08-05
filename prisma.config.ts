import path from 'path';
import { defineConfig } from 'prisma/config';

export default defineConfig({
  schema: path.join(__dirname, 'prisma', 'schema.prisma'),
  datasource: {
    url: process.env.DATABASE_URL || 'postgresql://neondb_owner:npg_nwkGQlzp87Tg@ep-wispy-wind-axy0tsnq-pooler.c-4.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require'
  }
});

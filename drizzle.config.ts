import type { Config } from 'drizzle-kit';

export default {
  schema: './src/lib/schema.ts',
  out: './drizzle',
  driver: 'pg',
  dbCredentials: {
    url: process.env.DATABASE_URL || 'postgresql://localhost:5432/such_gallery',
  },
} satisfies Config;

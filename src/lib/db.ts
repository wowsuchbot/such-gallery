import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

let db: ReturnType<typeof drizzle> | null = null;

/**
 * Get a database connection (singleton pattern)
 */
export function getDatabase() {
  if (!db) {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
      throw new Error('DATABASE_URL environment variable is not set');
    }

    const client = postgres(connectionString);
    db = drizzle(client, { schema });
  }

  return db;
}

// Export all schema tables for convenience
export {
  suchGalleryUsers,
  curatedGalleries,
  curatedGalleryNfts,
  nftMetadataCache,
  quoteCasts,
  adminUsers,
} from './schema';

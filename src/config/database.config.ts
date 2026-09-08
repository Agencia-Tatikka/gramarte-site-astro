import { createClient, type Client } from '@libsql/client';
import { siteConfig } from './site.config';

let dbClient: Client | null = null;

export function getDb(): Client {
  if (dbClient) return dbClient;

  const url = import.meta.env.TURSO_DATABASE_URL || siteConfig.database.tursoUrl;
  const authToken = import.meta.env.TURSO_AUTH_TOKEN || siteConfig.database.tursoToken;

  if (!url || url.includes('exemplo')) {
    // Fallback gracioso para modo mock em desenvolvimento/build caso o token ainda não esteja provisionado
    return createClient({
      url: 'file:local-fallback.db'
    });
  }

  dbClient = createClient({
    url,
    authToken
  });

  return dbClient;
}

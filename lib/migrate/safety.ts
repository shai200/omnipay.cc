import path from 'node:path';

export function databaseHost(databaseUrl: string): string {
  const url = new URL(databaseUrl);
  if (!url.hostname) {
    throw new Error('DATABASE_URL is missing a host');
  }
  return url.host;
}

export function assertExportAllowed(allowFlag: string | undefined): void {
  if (allowFlag !== 'yes') {
    throw new Error('Refusing to run. Set ALLOW_DATA_MIGRATION=yes to confirm this one-off export.');
  }
}

export function assertImportAllowed(options: {
  allowFlag: string | undefined;
  databaseUrl: string | undefined;
  confirmHost: string | undefined;
}): { host: string } {
  if (options.allowFlag !== 'yes') {
    throw new Error('Refusing to run. Set ALLOW_DATA_MIGRATION=yes to confirm this one-off import.');
  }
  if (!options.databaseUrl) {
    throw new Error('DATABASE_URL is not configured.');
  }
  const host = databaseHost(options.databaseUrl);
  if (!options.confirmHost || options.confirmHost !== host) {
    throw new Error('Refusing to write. Pass --confirm-host with the exact database host from DATABASE_URL.');
  }
  return { host };
}

export function assertMigrationFilePath(filePath: string, repoRoot: string): string {
  const resolved = path.resolve(filePath);
  const root = path.resolve(repoRoot);
  const allowed = path.resolve(root, 'migration-data');
  const insideRepo = resolved === root || resolved.startsWith(root + path.sep);
  const insideAllowed = resolved === allowed || resolved.startsWith(allowed + path.sep);
  if (insideRepo && !insideAllowed) {
    throw new Error('Migration files inside the repository must live in migration-data/.');
  }
  return resolved;
}

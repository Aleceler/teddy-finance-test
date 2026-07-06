function getRequiredEnv(key: keyof ImportMetaEnv): string {
  const value = import.meta.env[key];

  if (!value) {
    throw new Error(`Missing environment variable: ${key}`);
  }

  return value;
}

export const env = {
  apiUrl: getRequiredEnv('VITE_API_URL'),
} as const;

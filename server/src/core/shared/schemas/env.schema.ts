import z from 'zod';

export const EnvSchema = z.object({
  DATABASE_URL: z.url(),
  REDIS_URL: z.url(),
  ADMIN_EMAIL: z.string().nonempty(),
  ADMIN_PASS: z.string().nonempty(),
  PORT: z.string().nonempty(),
  JWT_SECRET: z.string().nonempty(),
  GEMINI_KEY: z.string().nonempty(),
  OPEN_API_KEY: z.string().nonempty(),
  SMTP_USER: z.string().nonempty(),
  SMTP_PASS: z.string().nonempty(),
  UPLOADTHING_KEY: z.string().nonempty(),
  IMAGE_DB_kEY: z.string().nonempty(),
  IMAGE_DB_API: z.url(),
  PHONE_API_URL: z.url(),
  GEO_LOCATION_API: z.url(),
  PIXABAY_API: z.url(),
});

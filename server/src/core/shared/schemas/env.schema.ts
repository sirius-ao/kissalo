import z from 'zod';

export const EnvSchema = z.object({
  DATABASE_URL: z.url(),
  REDIS_URL: z.url(),
  ADMIN_EMAIL: z.string().nonempty(),
  ADMIN_PASS: z.string().nonempty(),
  PORT: z.string().nonempty(),
  JWT_SECRET: z.string().nonempty(),
  SMTP_USER: z.string().nonempty(),
  SMTP_PASS: z.string().nonempty(),
});

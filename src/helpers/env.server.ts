import 'server-only';

import z from 'zod';

export const envSchema = z.object({
	DB_FILE_NAME: z.string().min(1),
	GIGA_CLIENT_ID: z.string().min(1),
	GIGA_SCOPE: z.string().min(1).default('GIGACHAT_API_PERS'),
	GIGA_OAUTH_URL: z.string().min(1),
	GIGI_SECRET_KEY: z.string().min(1),
	GOOGLE_PROJECT_ID: z.string().min(1),
	GOOGLE_SECRET_KEY: z.string().min(1),
	HCAPTCHA_PUBLIC_KEY: z.string().min(1),
	HCAPTCHA_VERIFY_URL: z.string().min(1),
	DEV: z.string().default('true').optional(),
});

export type Env = z.infer<typeof envSchema>;

export const env: Env = envSchema.parse(process.env);

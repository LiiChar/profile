import 'client-only';
import { z } from 'zod';

export const clientEnvSchema = z.object({
	NEXT_PUBLIC_HCAPTCHA_PUBLIC_KEY: z.string().min(1),
	NEXT_PUBLIC_HCAPTCHA_VERIFY_URL: z.string().min(1),
});

export type ClientEnv = z.infer<typeof clientEnvSchema>;

export const env = clientEnvSchema.parse({
	NEXT_PUBLIC_HCAPTCHA_PUBLIC_KEY: process.env.NEXT_PUBLIC_HCAPTCHA_PUBLIC_KEY,
	NEXT_PUBLIC_HCAPTCHA_VERIFY_URL: process.env.NEXT_PUBLIC_HCAPTCHA_VERIFY_URL,
});

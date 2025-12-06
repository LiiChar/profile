'use server';
import { env } from "@/helpers/env.client";

export const verifyCaptcha = async (token: string) => {
	const response = await fetch(env.NEXT_PUBLIC_HCAPTCHA_VERIFY_URL, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
		},
		body: new URLSearchParams({
			secret: env.NEXT_PUBLIC_HCAPTCHA_PUBLIC_KEY,
			response: token,
		}),
	});

	const data = await response.json();

	if (data.success) {
		return true;
	} else {
		return false;
	}
};

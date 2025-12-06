'use server';
import { env } from "@/helpers/env.server";

export const verifyCaptcha = async (token: string) => {
	const response = await fetch(env.HCAPTCHA_VERIFY_URL, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
		},
		body: new URLSearchParams({
			secret: env.HCAPTCHA_PUBLIC_KEY,
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

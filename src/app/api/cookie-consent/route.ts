import { NextRequest, NextResponse } from 'next/server';

const getReturnUrl = (request: NextRequest, returnTo: FormDataEntryValue | null) => {
	const safePath =
		typeof returnTo === 'string' && returnTo.startsWith('/') ? returnTo : null;
	const base = new URL(request.url);
	return new URL(safePath ?? '/', base);
};

export async function POST(request: NextRequest) {
	const formData = await request.formData();
	const value = formData.get('value') === 'true' ? 'true' : 'false';
	const returnTo = formData.get('returnTo');

	const response = NextResponse.redirect(getReturnUrl(request, returnTo), 303);
	response.cookies.set('allow-cookies', value, {
		path: '/',
		maxAge: value === 'true' ? 60 * 60 * 24 * 365 : 60 * 60 * 24 * 30,
	});

	return response;
}

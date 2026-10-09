import { NextRequest, NextResponse } from 'next/server';
import { match } from '@formatjs/intl-localematcher';
import Negotiator from 'negotiator';
import { locales } from './const/i18n';
import { defaultLocale } from './dictionaries/dictionaries';
import type { Lang } from './types/i18n';

const detectFromAcceptLanguage = (request: NextRequest): Lang => {
	const accept = request.headers.get('accept-language');
	if (!accept) return defaultLocale;

	const languages = new Negotiator({
		headers: { 'accept-language': accept },
	}).languages();

	return match(languages, locales, defaultLocale) as Lang;
};

export function proxy(request: NextRequest) {

	const { pathname } = request.nextUrl;

	const segment = pathname.split('/')[1] as Lang;
	const urlHasLocale = locales.includes(segment);

	if (urlHasLocale) {
		const requestHeaders = new Headers(request.headers);
		requestHeaders.set('x-current-language', segment);
		requestHeaders.set('x-current-path', pathname);
		const response = NextResponse.next({ request: { headers: requestHeaders } });
		if (request.cookies.get('lang')?.value !== segment) {
			response.cookies.set('lang', segment, {
				path: '/',
				maxAge: 60 * 60 * 24 * 365,
			});
		}
		return response;
	}

	const cookieLang = request.cookies.get('lang')?.value as Lang | undefined;
	const hostLocale = request.nextUrl.hostname.split('.')[0] as Lang;

	const lang: Lang =
		locales.includes(hostLocale)
			? hostLocale
			: cookieLang && locales.includes(cookieLang)
			? cookieLang
			: detectFromAcceptLanguage(request);

	const url = request.nextUrl.clone();
	url.pathname = `/${lang}${pathname}`;

	const response = NextResponse.redirect(url);
	response.headers.set('x-current-language', lang);
	response.headers.set('x-current-path', `/${lang}${pathname}`);
	if (!cookieLang || cookieLang !== lang) {
		response.cookies.set('lang', lang, {
			path: '/',
			maxAge: 60 * 60 * 24 * 365,
		});
	}

	return response;
}

export const config = {
	matcher: [
		'/((?!_next|api|static|favicon.ico|images|fonts|uploads|.*\\..*).*)',
	],
};

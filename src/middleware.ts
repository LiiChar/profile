import { NextRequest, NextResponse } from 'next/server';
import { match } from '@formatjs/intl-localematcher';
import Negotiator from 'negotiator';
import { locales } from './const/i18n';
import { cookies } from 'next/headers';
import { Lang } from './types/i18n';
import { defaultLocale } from './dictionaries/dictionaries';

function getLocale(request: NextRequest) {
	const headers = {
		'accept-language': request.headers.get('accept-language') ?? '',
	};
	const languages = new Negotiator({ headers }).languages();
	return match(languages, locales, defaultLocale);
}

export function getLangFromUrl(pathname: string): Lang | null {
	const segments = pathname.split('/').filter(Boolean);
	const firstSegment = segments[0];
	return locales.includes(firstSegment as Lang) ? (firstSegment as Lang) : null;
}

export async function middleware(request: NextRequest) {
	const { pathname } = request.nextUrl;
	const headers = new Headers(request.headers);

	const pathnameHasLocale = locales.some(
		locale => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
	);

	const urlLocal = getLangFromUrl(pathname);
	const locale = getLocale(request);

	if (urlLocal) {
		(await cookies()).set('lang', urlLocal);
		headers.set('x-current-language', urlLocal);
	} else {
		(await cookies()).set('lang', locale);
		headers.set('x-current-language', locale);
	}

	if (pathnameHasLocale) {
		headers.set('x-current-path', pathname);
		return NextResponse.next({ headers });
	}

	request.nextUrl.pathname = `/${locale}${pathname}`;
	headers.set('x-current-path', `/${locale}${pathname}`);
	return NextResponse.redirect(request.nextUrl, { headers });
}

export const config = {
	matcher: ['/((?!_next|favicon.ico|images|fonts|uploads|static|media).*)'],
};

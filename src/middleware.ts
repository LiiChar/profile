// middleware.ts
import { NextRequest, NextResponse } from 'next/server';
import { match } from '@formatjs/intl-localematcher';
import Negotiator from 'negotiator';
import { Lang } from './types/i18n';
import { defaultLocale } from './dictionaries/dictionaries';
import { locales } from './const/i18n';

const getLocale = (request: NextRequest): Lang => {
	const acceptLanguage = request.headers.get('accept-language');
	if (!acceptLanguage) return defaultLocale;

	const headers = { 'accept-language': acceptLanguage };
	const languages = new Negotiator({ headers }).languages();
	return match(languages, locales as string[], defaultLocale) as Lang;
};

const getLangFromUrl = (pathname: string): Lang | null => {
	const firstSegment = pathname.split('/')[1];
	if (!firstSegment) return null;
	return locales.includes(firstSegment as Lang) ? (firstSegment as Lang) : null;
};

export async function middleware(request: NextRequest) {
	const { pathname } = request.nextUrl;

	// Игнорируем статические файлы и API
	if (
		pathname.startsWith('/_next') ||
		pathname.startsWith('/favicon.ico') ||
		pathname.startsWith('/static') ||
		pathname.includes('.')
	) {
		return NextResponse.next();
	}

	const pathnameHasLocale = getLangFromUrl(pathname);
	const preferredLocale = getLocale(request);

	// Сохраняем язык в куки (асинхронно!)
	const response = NextResponse.next();
	const cookieStore = request.cookies;

	const finalLocale = pathnameHasLocale || preferredLocale;

	// Устанавливаем куки и заголовки
	response.cookies.set('lang', finalLocale, {
		path: '/',
		maxAge: 60 * 60 * 24 * 365, // 1 год
		sameSite: 'lax',
	});

	response.headers.set('x-current-language', finalLocale);
	response.headers.set('x-current-path', request.nextUrl.pathname);

	// Если локаль уже в URL — просто продолжаем
	if (pathnameHasLocale) {
		return response;
	}

	// Редирект на URL с локалью
	const urlWithLocale = new URL(
		`/${finalLocale}${pathname === '/' ? '' : pathname}${
			request.nextUrl.search
		}`,
		request.url
	);

	return NextResponse.redirect(urlWithLocale);
}

export const config = {
	matcher: [
		// Применяем ко всем путям, кроме статических и API
		'/((?!_next|api|static|favicon.ico|images|fonts|uploads|.*\\..*).*)',
	],
};

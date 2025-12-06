'use client';

import dynamic from 'next/dynamic';

const ArticleNav = dynamic(() => import('./ArticleNav.js').then((mod) => mod.default), {
	ssr: false,
	loading: () => null // no loading component for sidebar
});

export default function ArticleNavWrapper(props: any) {
	return <ArticleNav {...props} />;
}

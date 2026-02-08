'use client';

import { BlogAction } from './BlogAction';
import { isAdmin } from '@/helpers/user';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { Lang } from '@/types/i18n';

export const BlogAdminActions = ({
	blogId,
	lang,
}: {
	blogId: number;
	lang: Lang;
}) => {
	const { user } = useCurrentUser();

	if (!isAdmin(user)) return null;
	return <BlogAction blogId={blogId} basePath={`/${lang}`} />;
};

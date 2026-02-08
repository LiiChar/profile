'use client';

import { ProjectAction } from './ProjectAction';
import { isAdmin } from '@/helpers/user';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { Lang } from '@/types/i18n';

export const ProjectAdminActions = ({
	projectId,
	lang,
}: {
	projectId: number;
	lang: Lang;
}) => {
	const { user } = useCurrentUser();

	if (!isAdmin(user)) return null;
	return <ProjectAction projectId={projectId} basePath={`/${lang}`} />;
};

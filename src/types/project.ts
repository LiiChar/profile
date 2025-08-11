import { ProjectType } from '@/db/tables/project';
import { UserType } from '@/db/tables/user';

export type ProjectWithUser = ProjectType & { user: UserType };

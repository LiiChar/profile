import { CommentType } from '@/db/tables/comment';
import { UserType } from '@/db/tables/user';

export type CommentWithUser = CommentType & {
	user: UserType;
};

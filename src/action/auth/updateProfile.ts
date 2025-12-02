'use server';

import { db } from '@/db/db';
import { users, UserType } from '@/db/tables/user';
import { eq } from 'drizzle-orm';
import { getCurrentUser } from './login';

export interface UpdateProfileData {
	name: string;
	username: string;
	photo?: string;
}

export const updateProfile = async (data: Partial<Omit<UserType, 'id'>>) => {
	try {
		const user = await getCurrentUser();
		if (!user) {
			throw new Error('Not authenticated');
		}

		await db
			.update(users)
			.set({
				name: data.name,
				photo: data.photo ?? null,
			})
			.where(eq(users.id, user.id));

		return { success: true, message: 'Профиль обновлен' };
	} catch (error) {
		console.error('[UPDATE PROFILE ERROR]', error);
		throw new Error(error instanceof Error ? error.message : 'Ошибка обновления профиля');
	}
};

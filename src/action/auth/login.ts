'use server';

import { db } from '@/db/db';
import { users } from '@/db/tables/user';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';

export interface LoginData {
	name: string;
	password: string;
}

export const login = async (data: LoginData) => {
	try {
		const user = await db
			.select()
			.from(users)
			.where(eq(users.name, data.name))
			.limit(1);

	// Check if user exists and password matches
	const existing = user.length > 0;
	let validPassword = false;
	if (existing) {
		validPassword = await bcrypt.compare(data.password, user[0].password || '');
	}

	if (!existing || !validPassword) {
		throw new Error('Invalid username or password');
	}

		// Set session cookie
		(await cookies()).set('user_id', user[0].id.toString(), {
			httpOnly: true,
			secure: process.env.NODE_ENV === 'production',
			sameSite: 'strict',
			maxAge: 60 * 60 * 24 * 7, // 7 days
		});

		// Optionally store in localStorage on client, but since server action, return user data for client to set localStorage
		return { success: true, user: { id: user[0].id, name: user[0].name, photo: user[0].photo } };
	} catch (error) {
		console.error('[LOGIN ERROR]', error);
		throw new Error(error instanceof Error ? error.message : 'Login failed');
	}
};

export const logout = async () => {
	try {
		(await cookies()).delete('user_id');
		return { success: true };
	} catch (error) {
		console.error('[LOGOUT ERROR]', error);
		throw new Error('Logout failed');
	}
};

export const getCurrentUser = async () => {
	try {
		const cookieStore = await cookies();
		const userId = cookieStore.get('user_id')?.value;
		if (!userId) return null;

		const user = await db
			.select()
			.from(users)
			.where(eq(users.id, parseInt(userId)))
			.limit(1);

		if (user.length === 0) return null;

		return { id: user[0].id, name: user[0].name, photo: user[0].photo };
	} catch (error) {
		console.error('[GET CURRENT USER ERROR]', error);
		return null;
	}
};

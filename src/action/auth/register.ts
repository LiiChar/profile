'use server';

import { db } from '@/db/db';
import { users } from '@/db/tables/user';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';
import { generateUUID } from 'three/src/math/MathUtils.js';

export interface RegisterData {
	name: string;
	password: string;
	photo?: string;
}

export const 	register = async (data: RegisterData) => {
	try {
		// Check if username already exists
		const existing = await db
			.select()
			.from(users)
			.where(eq(users.name, data.name))
			.limit(1);

		if (existing.length > 0) {
			throw new Error('Username already exists');
		}

		// Hash password and create user
		const hashedPassword = await bcrypt.hash(data.password, 10);
		const newUser = {
			uuid: generateUUID(),
			name: data.name,
			password: hashedPassword,
			photo: data.photo ?? null,
		};

		const result = await db.insert(users).values(newUser).returning({ id: users.id, name: users.name, photo: users.photo });

		const cookieStore = await cookies();

		// Set session cookie
		cookieStore.set({
			name: 'user_id',
			value: result[0].id.toString(),
			httpOnly: true,
			secure: true,
			sameSite: 'lax',
			path: '/',
			maxAge: 60 * 60 * 24 * 7, // 7 days
		});

		// Return user data for localStorage
		return { success: true, user: result[0] };
	} catch (error) {
		console.error('[REGISTER ERROR]', error);
		throw new Error(error instanceof Error ? error.message : 'Registration failed');
	}
};

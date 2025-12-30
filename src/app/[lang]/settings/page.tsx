'use server'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { getCurrentUser, logout } from '@/action/auth/login';
import { redirect } from 'next/navigation';
import { UserProfileForm } from '@/components/auth/UserProfileForm';
import { UserType } from '@/db/tables/user';
import { Logout } from '@/components/auth/Logout';

export default async function Settings() {
	const user = await getCurrentUser();

	if (!user) {
		redirect('/login');
	}

	return (
		<main className='max-w-2xl mx-auto my-8 px-4 space-y-6'>
			<Card>
				<CardHeader>
					<CardTitle>Профиль пользователя</CardTitle>
				</CardHeader>
				<CardContent>
					<UserProfileForm user={user as UserType} />
				</CardContent>
			</Card>
			<Card className='gap-0'>
				<CardHeader>
					<CardTitle>Удаление пользователя</CardTitle>
				</CardHeader>
				<CardContent className='pt-6'>
					<Logout />
				</CardContent>
			</Card>
		</main>
	);
}

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { getCurrentUser, logout } from '@/action/auth/login';
import { redirect } from 'next/navigation';
import { UserProfileForm } from '@/components/auth/UserProfileForm';
import { UserType } from '@/db/tables/user';

export default async function Settings() {
	const user = await getCurrentUser();

	if (!user) {
		redirect('/login');
	}

	const handleLogout = async () => {
		'use server';
		await logout();
		redirect('/');
	};

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

			<Card>
				<CardContent className='pt-6'>
					<form action={handleLogout}>
						<Button type='submit' variant='destructive'>
							Выйти
						</Button>
					</form>
				</CardContent>
			</Card>
		</main>
	);
}

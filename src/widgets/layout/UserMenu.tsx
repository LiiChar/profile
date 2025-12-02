import { getCurrentUser } from '@/action/auth/login';
import Link from 'next/link';

export const UserMenu = async () => {
	const user = await getCurrentUser();

	if (!user) {
		return (
			<Link href="/login" className="text-sm font-medium hover:text-primary">
				Войти
			</Link>
		);
	}

	return (
		<div className="flex items-center gap-4">
			<span className="text-sm">{user.name}</span>
			<Link href="/settings" className="text-sm hover:text-primary">
				Настройки
			</Link>
		</div>
	);
};

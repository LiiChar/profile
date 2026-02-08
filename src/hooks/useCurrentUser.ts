'use client';

import { useEffect, useState } from 'react';
import { getCurrentUser } from '@/action/auth/login';

export type CurrentUser = {
	id: number;
	name: string;
	photo: string | null;
	isAdmin: boolean;
} | null;

export const useCurrentUser = () => {
	const [user, setUser] = useState<CurrentUser>(null);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		let isActive = true;

		const loadUser = async () => {
			try {
				const data = await getCurrentUser();
				if (isActive) {
					setUser(data);
				}
			} finally {
				if (isActive) {
					setIsLoading(false);
				}
			}
		};

		loadUser();
		return () => {
			isActive = false;
		};
	}, []);

	return { user, isLoading };
};

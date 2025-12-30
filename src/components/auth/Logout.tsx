'use client'

import { logout } from "@/action/auth/login";
import { Button } from "../ui/button";
import { redirect } from 'next/navigation';

export const Logout = () => {
    const handleLogout = async () => {
      await logout();
      redirect('/');
    };
	return (
		<Button onClick={handleLogout} variant='destructive'>
			Выйти
		</Button>
	);
};

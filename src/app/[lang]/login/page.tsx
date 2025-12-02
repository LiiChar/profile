'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LoginForm } from '@/components/auth/LoginForm';
import { RegisterForm } from '@/components/auth/RegisterForm';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

export default function LoginPage() {
	const [isRegister, setIsRegister] = useState(false);

	return (
		<main className="max-w-md mx-auto my-8 px-4">
			<Card>
				<CardHeader>
					<CardTitle className="text-center">
						{isRegister ? 'Регистрация' : 'Вход в систему'}
					</CardTitle>
					<div className="flex justify-center gap-2">
						<Button
							variant={!isRegister ? 'default' : 'outline'}
							size="sm"
							onClick={() => setIsRegister(false)}
						>
							Вход
						</Button>
						<Button
							variant={isRegister ? 'default' : 'outline'}
							size="sm"
							onClick={() => setIsRegister(true)}
						>
							Регистрация
						</Button>
					</div>
				</CardHeader>
				<CardContent>
					{isRegister ? <RegisterForm /> : <LoginForm />}
				</CardContent>
			</Card>
		</main>
	);
}

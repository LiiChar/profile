'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { login } from '@/action/auth/login';

export const LoginForm = () => {
	const [loading, setLoading] = useState(false);
	const [formData, setFormData] = useState({
		name: '',
		password: ''
	});
	const router = useRouter();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);

		try {
			const result = await login(formData);
			if (result.success) {
				localStorage.setItem('user', JSON.stringify(result.user));
				toast('Успешный вход!');
				router.refresh();
			}
		} catch (error: any) {
			toast(error.message || 'Ошибка входа');
		} finally {
			setLoading(false);
		}
	};

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setFormData(prev => ({
			...prev,
			[e.target.name]: e.target.value
		}));
	};

	return (
		<form onSubmit={handleSubmit} className='space-y-4 max-w-md mx-auto'>
			<div>
				<Label htmlFor='username'>Логин</Label>
				<Input
					id='name'
					name='name'
					type='text'
					required
					value={formData.name}
					onChange={handleChange}
					placeholder='Ваш логин'
				/>
			</div>
			<div>
				<Label htmlFor='password'>Пароль</Label>
				<Input
					id='password'
					name='password'
					type='password'
					required
					value={formData.password}
					onChange={handleChange}
					placeholder='Ваш пароль'
				/>
			</div>
			<Button loading={loading} type='submit' disabled={loading} className='w-full'>
				{loading ? 'Вход...' : 'Войти'}
			</Button>
		</form>
	);
};

'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { register } from '@/action/auth/register';

export const RegisterForm = () => {
	const [loading, setLoading] = useState(false);
	const [formData, setFormData] = useState({
		name: '',
		username: '',
		password: '',
		photo: ''
	});
	const router = useRouter();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);

		try {
			const result = await register(formData);
			if (result.success) {
				localStorage.setItem('user', JSON.stringify(result.user));
				toast('Аккаунт создан!');
				router.refresh();
			}
		} catch (error: any) {
			toast(error.message || 'Ошибка регистрации');
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
		<form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto">
			<div>
				<Label htmlFor="name">Имя</Label>
				<Input
					id="name"
					name="name"
					type="text"
					required
					value={formData.name}
					onChange={handleChange}
					placeholder="Ваше имя"
				/>
			</div>
			<div>
				<Label htmlFor="username">Логин</Label>
				<Input
					id="username"
					name="username"
					type="text"
					required
					value={formData.username}
					onChange={handleChange}
					placeholder="Ваш логин"
				/>
			</div>
			<div>
				<Label htmlFor="password">Пароль</Label>
				<Input
					id="password"
					name="password"
					type="password"
					required
					value={formData.password}
					onChange={handleChange}
					placeholder="Ваш пароль"
				/>
			</div>
			<div>
				<Label htmlFor="photo">Фото (URL)</Label>
				<Input
					id="photo"
					name="photo"
					type="url"
					value={formData.photo}
					onChange={handleChange}
					placeholder="Ссылка на фото (необязательно)"
				/>
			</div>
			<Button type="submit" disabled={loading} className="w-full">
				{loading ? 'Регистрация...' : 'Зарегистрироваться'}
			</Button>
		</form>
	);
};

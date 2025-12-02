'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { updateProfile } from '@/action/auth/updateProfile';
import { UserType } from '@/db/tables/user';
import Image from 'next/image';

export const UserProfileForm = ({ user }: { user: UserType }) => {
	const [loading, setLoading] = useState(false);
	const [formData, setFormData] = useState({
		name: user.name,
		photo: user.photo || '',
	});
	const router = useRouter();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);

		try {
			const result = await updateProfile(formData);
			if (result.success) {
				toast('Профиль обновлен!');
				router.refresh();
			}
		} catch (error: any) {
			toast(error.message || 'Ошибка обновления');
		} finally {
			setLoading(false);
		}
	};

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setFormData(prev => ({
			...prev,
			[e.target.name]: e.target.value,
		}));
	};

	return (
		<div className='space-y-4'>
			{user.photo && (
				<div className='flex justify-center mb-4'>
					<Image
						src={user.photo}
						alt={user.name}
						className='w-24 h-24 rounded-full object-cover'
					/>
				</div>
			)}
			<form onSubmit={handleSubmit} className='space-y-4'>
				<div>
					<Label htmlFor='name'>Имя</Label>
					<Input
						id='name'
						name='name'
						type='text'
						required
						value={formData.name}
						onChange={handleChange}
						placeholder='Ваше имя'
					/>
				</div>
				<div>
					<Label htmlFor='photo'>Фото (URL)</Label>
					<Input
						id='photo'
						name='photo'
						type='url'
						value={formData.photo}
						onChange={handleChange}
						placeholder='Ссылка на фото'
					/>
				</div>
				<Button type='submit' disabled={loading}>
					{loading ? 'Обновление...' : 'Обновить профиль'}
				</Button>
			</form>
		</div>
	);
};

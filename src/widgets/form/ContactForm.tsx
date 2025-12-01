'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormMessage,
} from '@/components/ui/form';
import { InputLabel } from '@/components/ui/input-label';
import { TextareaLabel } from '@/components/ui/TextareaLabel';
import { sendMail } from '@/action/email/send';
import { Captcha } from '@/components/form/captcha';
import { verifyCaptcha } from '@/action/captcha/hCaptcha';

const formSchema = z.object({
	name: z.string().min(2, {
		message: 'Имя должно быть менее 10 симовлов.',
	}),
	message: z.string().min(10, {
		message: 'Сообщение не должно быть менее 10 символов.',
	}),
	hcaptcha: z.string().min(1, 'Подтвердите, что вы не робот'),
});

export function ContactForm() {
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			name: '',
			message: '',
		},
	});

	async function onSubmit(values: z.infer<typeof formSchema>) {
		const verify = await verifyCaptcha(values.hcaptcha);
		if (!verify) {
			form.setError('hcaptcha', {message: 'Произошла ошибка в подтверждении капчи, подтвердите заново'});
			return;
		}
		const res = await sendMail(values);
		console.log(res);
	}

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className='mt-4'>
				<FormField
					control={form.control}
					name='name'
					render={({ field }) => (
						<FormItem className='w-full mb-4'>
							<FormControl className='w-full'>
								<InputLabel
									placeholder='Введите имя'
									required
									type='text'
									label='Имя'
									className='w-full'
									{...field}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name='message'
					render={({ field }) => (
						<FormItem className='w-full'>
							<FormControl className='w-full'>
								<TextareaLabel
									placeholder='Введите сообщение'
									required
									label='Сообщение'
									className='w-full min-h-[100px]'
									{...field}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name='hcaptcha'
					render={() => (
						<FormItem className='mt-4'>
							<FormControl>
								<Captcha
									onVerify={token => {
										form.setValue('hcaptcha', token);
									}}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<Button type='submit' className='mt-4'>
					Отправить
				</Button>
			</form>
		</Form>
	);
}

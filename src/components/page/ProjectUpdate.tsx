'use client';

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
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
import { toast } from 'sonner';
import { updateProject } from '@/action/project/update';
import { useRouter } from 'next/navigation';
import { ProjectWithUser } from '@/types/project';
import { MarkdownEditor } from '@/components/ui/markdown-editor';
import { getDate } from '@/helpers/date';
import { validateUrl } from '@/helpers/url';
import { cn } from '@/lib/utils';
import Image from 'next/image';

const formUpdateProjectSchema = z.object({
	title: z
		.string()
		.min(2, { message: 'Название должно быть не менее 2 символов' }),
	image: z.string().optional(),
	author: z.string().min(1, { message: 'Автор обязателен' }),
	repoName: z.string().optional(),
	url: z.string().optional(),
	description: z.string().optional(),
	content: z
		.string()
		.min(10, { message: 'Содержание должно быть не менее 10 символов' }),
	lang: z.any().optional(), // JSON поле
	gallery: z.any().optional(), // JSON поле
	tags: z.string().optional(),
});

export const ProjectUpdatePage = ({
	project,
}: {
	project: ProjectWithUser;
}) => {
	const router = useRouter();
	const form = useForm<z.infer<typeof formUpdateProjectSchema>>({
		resolver: zodResolver(formUpdateProjectSchema),
		defaultValues: {
			title: project.title,
			image: project.image || '',
			author: project.author || 'LiiChar',
			repoName: project.repoName || '',
			url: project.url || '',
			description: project.description || '',
			content: project.content,
			lang: project.lang || {},
			gallery: project.gallery || [],
			tags: project.tags || '',
		},
	});

	async function onSubmit(values: z.infer<typeof formUpdateProjectSchema>) {
		try {
			await updateProject({
				...values,
				id: project.id,
				userId: project.userId,
			});
			toast.success(`Проект "${values.title}" успешно обновлён`);
			router.push(`/projects/${project.id}`);
		} catch (error) {
			if (error instanceof Error) toast.error(error.message);
		}
	}

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className='mt-4'>
				<Card className='max-w-5xl mx-auto my-8 border-none shadow-lg bg-transparent'>
					<CardHeader className='px-4 sm:px-6 lg:px-8'>
						<FormField
							control={form.control}
							name='url'
							render={({ field }) => (
								<FormItem>
									<FormControl>
										<div className='relative'>
											{validateUrl(field.value) && (
												<iframe
													src={field.value}
													className='w-full h-full aspect-video rounded-md border'
												/>
											)}
											<input
												placeholder='URL проекта'
												className={cn(
													'w-full p-2 border rounded',
													validateUrl(field.value) &&
														'absolute ml-4 w-[calc(100%-32px)] bg-background bottom-4 z-30'
												)}
												{...field}
											/>
										</div>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						{/* Заголовок */}
						<FormField
							control={form.control}
							name='title'
							render={({ field }) => (
								<FormItem className='my-14'>
									<FormControl>
										<input
											className='text-4xl font-bold w-full text-center bg-transparent outline-none'
											placeholder='Название проекта'
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<div className='flex justify-between items-center text-sm text-foreground/60 gap-3 mt-2'>
							<span className='text-nowrap'>
								{project.user.name} • {getDate(project.createdAt)}
							</span>
							<Separator />
						</div>
					</CardHeader>

					<CardContent className='px-4 sm:px-6 lg:px-8 space-y-6'>
						{/* Обложка */}
						<FormField
							control={form.control}
							name='image'
							render={({ field }) => (
								<FormItem>
									<FormControl>
										<div className='relative'>
											<input
												className={cn(
													'w-full p-2 border rounded',
													field.value &&
														'absolute ml-4 w-[calc(100%-32px)] bg-background bottom-4 z-30'
												)}
												{...field}
												placeholder='Ссылка на изображение'
												{...field}
											/>
											{field.value && (
												<div className='mt-2'>
													<Image
														src={field.value}
														alt='Обложка проекта'
														width={800}
														height={600}
														className='rounded-lg object-cover w-full h-full'
													/>
												</div>
											)}
										</div>
									</FormControl>

									<FormMessage />
								</FormItem>
							)}
						/>

						{/* Автор */}
						<FormField
							control={form.control}
							name='author'
							render={({ field }) => (
								<FormItem>
									<FormControl>
										<input
											placeholder='Автор'
											className='w-full p-2 border rounded'
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						{/* Репозиторий */}
						<FormField
							control={form.control}
							name='repoName'
							render={({ field }) => (
								<FormItem>
									<FormControl>
										<input
											placeholder='Имя репозитория (GitHub)'
											className='w-full p-2 border rounded'
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						{/* URL проекта */}

						{/* Краткое описание */}
						<FormField
							control={form.control}
							name='description'
							render={({ field }) => (
								<FormItem>
									<FormControl>
										<textarea
											placeholder='Краткое описание'
											className='w-full p-2 border rounded'
											rows={3}
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						{/* Контент */}
						<FormField
							control={form.control}
							name='content'
							render={({ field }) => (
								<FormItem>
									<FormControl>
										<MarkdownEditor placeholder='Полное описание' {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						{/* Lang (JSON) */}
						<FormField
							control={form.control}
							name='lang'
							render={({ field }) => (
								<FormItem>
									<FormControl>
										<textarea
											placeholder='JSON языков'
											className='w-full p-2 border rounded font-mono text-sm'
											rows={4}
											value={JSON.stringify(field.value, null, 2)}
											onChange={(e) => {
												try {
													form.clearErrors('lang');
													field.onChange(JSON.parse(e.target.value));
												} catch {
													form.setError('lang', { message: 'Неверный JSON' });
												}
											}}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						{/* Gallery (JSON) */}
						{/* <FormField
							control={form.control}
							name='gallery'
							render={({ field }) => (
								<FormItem>
									<FormControl>
										<textarea
											placeholder='JSON галереи'
											className='w-full p-2 border rounded font-mono text-sm'
											rows={4}
											value={JSON.stringify(field.value, null, 2)}
											onChange={e => {
												try {
													form.clearErrors('gallery');
													field.onChange(JSON.parse(e.target.value));
												} catch {
													form.setError('gallery', {
														message: 'Неверный JSON',
													});
												}
											}}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/> */}

						{/* Теги */}
						<FormField
							control={form.control}
							name='tags'
							render={({ field }) => (
								<FormItem>
									<FormControl>
										<input
											placeholder='Теги (через запятую)'
											className='w-full p-2 border rounded'
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</CardContent>

					<div className='flex justify-end px-8 pb-6'>
						<Button type='submit'>Сохранить</Button>
					</div>
				</Card>
			</form>
		</Form>
	);
};

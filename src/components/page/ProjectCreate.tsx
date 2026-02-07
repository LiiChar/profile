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
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { createProject } from '@/action/project/create';
import { useRouter } from 'next/navigation';
import { MarkdownEditor } from '@/components/ui/markdown-editor';
import { getDate } from '@/helpers/date';
import { validateUrl } from '@/helpers/url';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { 
	FolderKanban, 
	Link2, 
	Image as ImageIcon, 
	User, 
	Github, 
	FileText, 
	Hash,
	Loader2,
	Rocket,
	ExternalLink
} from 'lucide-react';
import { useState } from 'react';

const formCreateProjectSchema = z.object({
	title: z
		.string()
		.min(2, { message: 'Название должно быть не менее 2 символов' }),
	image: z.string().optional(),
	author: z.string().optional(),
	repoName: z.string().optional(),
	url: z.string().optional(),
	description: z.string().optional(),
	content: z
		.string()
		.min(10, { message: 'Описание должно быть не менее 10 символов' }),
	tags: z.string().optional(),
});

export const ProjectCreatePage = () => {
	const router = useRouter();
	const [isSubmitting, setIsSubmitting] = useState(false);
	
	const form = useForm<z.infer<typeof formCreateProjectSchema>>({
		resolver: zodResolver(formCreateProjectSchema),
		defaultValues: {
			title: '',
			image: '',
			author: 'LiiChar',
			repoName: '',
			url: '',
			description: '',
			content: '',
			tags: '',
		},
	});

	async function onSubmit(values: z.infer<typeof formCreateProjectSchema>) {
		setIsSubmitting(true);
		try {
			const newProject = await createProject({
				...values,
				userId: 1,
			});
			toast.success(`Проект "${values.title}" успешно создан`);
			router.push(`/projects/${newProject.id}`);
		} catch (error) {
			if (error instanceof Error) toast.error(error.message);
		} finally {
			setIsSubmitting(false);
		}
	}

	const watchUrl = form.watch('url');
	const watchImage = form.watch('image');
	const watchTitle = form.watch('title');
	const watchContent = form.watch('content');

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className='mt-4'>
				<Card className='max-w-4xl mx-auto my-8 border border-border/50 shadow-xl bg-card/50 backdrop-blur-sm'>
					{/* Заголовок страницы */}
					<div className='px-6 pt-6 pb-4 border-b border-border/50'>
						<div className='flex items-center gap-3'>
							<div className='p-2 rounded-lg bg-primary/10'>
								<FolderKanban className='w-5 h-5 text-primary' />
							</div>
							<div>
								<h1 className='text-xl font-semibold'>Новый проект</h1>
								<p className='text-sm text-muted-foreground'>
									Добавьте новый проект в портфолио
								</p>
							</div>
						</div>
					</div>

					<CardHeader className='px-6 pt-6'>
						{/* Превью URL проекта */}
						<FormField
							control={form.control}
							name='url'
							render={({ field }) => (
								<FormItem className='mb-6'>
									<FormLabel className='flex items-center gap-2 text-sm font-medium'>
										<Link2 className='w-4 h-4' />
										Ссылка на проект
									</FormLabel>
									<FormControl>
										<div className='space-y-3'>
											<Input
												placeholder='https://example.com'
												className='bg-background/50'
												{...field}
											/>
											{validateUrl(field.value) && (
												<div className='relative rounded-lg overflow-hidden border border-border/50'>
													<iframe
														src={field.value}
														className='w-full aspect-video'
														title='Превью проекта'
													/>
													<a 
														href={field.value} 
														target='_blank'
														rel='noopener noreferrer'
														className='absolute top-2 right-2 p-2 bg-background/80 backdrop-blur-sm rounded-md hover:bg-background transition-colors'
													>
														<ExternalLink className='w-4 h-4' />
													</a>
												</div>
											)}
										</div>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						{/* Заголовок проекта */}
						<FormField
							control={form.control}
							name='title'
							render={({ field }) => (
								<FormItem className='mb-6'>
									<FormControl>
										<Input
											className='h-14 text-center text-2xl sm:text-3xl lg:text-4xl font-bold bg-transparent border-none focus-visible:ring-0 placeholder:text-muted-foreground/50'
											placeholder='Название проекта...'
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						{/* Метаданные */}
						<div className='flex justify-between items-center text-sm text-foreground/60 gap-3'>
							<span className='text-nowrap font-medium'>
								LiiChar • {getDate(new Date().toISOString())}
							</span>
							<Separator className='flex-1' />
						</div>
					</CardHeader>

					<CardContent className='px-6 space-y-6'>
						{/* Обложка */}
						<FormField
							control={form.control}
							name='image'
							render={({ field }) => (
								<FormItem>
									<FormLabel className='flex items-center gap-2 text-sm font-medium'>
										<ImageIcon className='w-4 h-4' />
										Обложка проекта
									</FormLabel>
									<FormControl>
										<div className='space-y-3'>
											<Input
												placeholder='https://example.com/image.jpg'
												className='bg-background/50'
												{...field}
											/>
											{watchImage && (
												<div className='relative rounded-lg overflow-hidden border border-border/50'>
													<Image
														src={watchImage}
														alt='Обложка проекта'
														width={800}
														height={400}
														className='w-full h-auto object-cover'
													/>
												</div>
											)}
										</div>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						{/* Автор и репозиторий */}
						<div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
							<FormField
								control={form.control}
								name='author'
								render={({ field }) => (
									<FormItem>
										<FormLabel className='flex items-center gap-2 text-sm font-medium'>
											<User className='w-4 h-4' />
											Автор
										</FormLabel>
										<FormControl>
											<Input
												placeholder='Ваше имя'
												className='bg-background/50'
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name='repoName'
								render={({ field }) => (
									<FormItem>
										<FormLabel className='flex items-center gap-2 text-sm font-medium'>
											<Github className='w-4 h-4' />
											Репозиторий GitHub
										</FormLabel>
										<FormControl>
											<Input
												placeholder='username/repo-name'
												className='bg-background/50'
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>

						{/* Краткое описание */}
						<FormField
							control={form.control}
							name='description'
							render={({ field }) => (
								<FormItem>
									<FormLabel className='flex items-center gap-2 text-sm font-medium'>
										<FileText className='w-4 h-4' />
										Краткое описание
									</FormLabel>
									<FormControl>
										<textarea
											placeholder='Опишите проект в нескольких предложениях...'
											className={cn(
												'w-full min-h-[80px] resize-none rounded-lg p-3 text-sm',
												'bg-background/50 border border-border/50',
												'placeholder:text-muted-foreground/60',
												'focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50',
												'transition-all duration-200'
											)}
											rows={3}
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						{/* Полное описание */}
						<FormField
							control={form.control}
							name='content'
							render={({ field }) => (
								<FormItem>
									<FormLabel className='text-sm font-medium'>
										Полное описание проекта
									</FormLabel>
									<FormControl>
										<MarkdownEditor 
											placeholder='Расскажите подробнее о проекте, используемых технологиях, особенностях реализации...'
											className='min-h-[200px]'
											{...field} 
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						{/* Теги */}
						<FormField
							control={form.control}
							name='tags'
							render={({ field }) => (
								<FormItem>
									<FormLabel className='flex items-center gap-2 text-sm font-medium'>
										<Hash className='w-4 h-4' />
										Технологии и теги
									</FormLabel>
									<FormControl>
										<Input
											placeholder='react, nextjs, typescript, tailwind...'
											className='bg-background/50'
											{...field}
										/>
									</FormControl>
									<p className='text-xs text-muted-foreground'>
										Разделяйте теги запятыми
									</p>
									<FormMessage />
								</FormItem>
							)}
						/>
					</CardContent>

					{/* Футер с кнопкой */}
					<div className='px-6 py-4 border-t border-border/50 bg-muted/30 rounded-b-xl'>
						<div className='flex items-center justify-between'>
							<p className='text-sm text-muted-foreground'>
								{watchTitle && watchContent ? (
									<span className='text-green-500'>✓ Готово к публикации</span>
								) : (
									<span>Заполните обязательные поля</span>
								)}
							</p>
							<Button 
								type='submit' 
								disabled={isSubmitting}
								className='gap-2'
							>
								{isSubmitting ? (
									<>
										<Loader2 className='w-4 h-4 animate-spin' />
										Создание...
									</>
								) : (
									<>
										<Rocket className='w-4 h-4' />
										Опубликовать
									</>
								)}
							</Button>
						</div>
					</div>
				</Card>
			</form>
		</Form>
	);
};

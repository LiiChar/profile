'use client';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { getDate } from '@/helpers/date';
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
import { MarkdownEditor } from '../ui/markdown-editor';
import { toast } from 'sonner';
import { createBlog } from '@/action/blog/create';
import { useRouter } from 'next/navigation';
import { GenerateIcon } from '../generate/GenerateIcon';
import { Input } from '../ui/input';
import { ImageUpload } from '../ui/image-upload';
import { FileText, Hash, Image as ImageIcon, Loader2, Send } from 'lucide-react';
import { useState } from 'react';

const formCreateBlogSchema = z.object({
	title: z.string().min(2, {
		message: 'Название должно быть не менее 2 символов.',
	}),
	content: z.string().min(10, {
		message: 'Содержание должно быть не менее 10 символов.',
	}),
	tags: z.string().optional(),
	image: z.string().optional(),
});

export const BlogCreatePage = () => {
	const router = useRouter();
	const [isSubmitting, setIsSubmitting] = useState(false);

	const form = useForm<z.infer<typeof formCreateBlogSchema>>({
		resolver: zodResolver(formCreateBlogSchema),
		defaultValues: {
			title: '',
			content: '',
			tags: '',
			image: '',
		},
	});

	async function onSubmit(values: z.infer<typeof formCreateBlogSchema>) {
		setIsSubmitting(true);
		try {
			const newBlog = await createBlog({
				...values,
				userId: 1,
			});

			toast.success(`Статья "${values.title}" успешно создана`);
			router.push(`/blog/${newBlog.id}`);
		} catch (error) {
			if (error instanceof Error) {
				toast.error(error.message);
			}
		} finally {
			setIsSubmitting(false);
		}
	}

	const watchTitle = form.watch('title');
	const watchContent = form.watch('content');

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className='mt-4'>
				<Card className='max-w-3xl mx-auto my-8 border border-border/50 shadow-xl bg-card/50 backdrop-blur-sm'>
					{/* Заголовок страницы */}
					<div className='px-6 pt-6 pb-4 border-b border-border/50'>
						<div className='flex items-center gap-3'>
							<div className='p-2 rounded-lg bg-primary/10'>
								<FileText className='w-5 h-5 text-primary' />
							</div>
							<div>
								<h1 className='text-xl font-semibold'>Новая статья</h1>
								<p className='text-sm text-muted-foreground'>
									Создайте новую статью для блога
								</p>
							</div>
						</div>
					</div>

					<CardHeader className='px-6 pt-6'>
						{/* Обложка */}
						<FormField
							control={form.control}
							name='image'
							render={({ field }) => (
								<FormItem className='mb-6'>
									<FormLabel className='flex items-center gap-2 text-sm font-medium'>
										<ImageIcon className='w-4 h-4' />
										Обложка статьи
									</FormLabel>
									<FormControl>
										<ImageUpload 
											defaultImage={field.value} 
											onSelect={field.onChange}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						{/* Заголовок статьи */}
						<FormField
							control={form.control}
							name='title'
							render={({ field }) => (
								<FormItem className='w-full'>
									<FormControl className='w-full'>
										<GenerateIcon
											context='header'
											handleGenerate={res => form.setValue('title', res)}
										>
											<Input
												className='h-14 text-center text-2xl sm:text-3xl lg:text-4xl font-bold bg-transparent border-none focus-visible:ring-0 placeholder:text-muted-foreground/50'
												placeholder='Заголовок статьи...'
												{...field}
											/>
										</GenerateIcon>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						{/* Метаданные */}
						<div className='flex w-full justify-between items-center mt-4 gap-4'>
							<div className='flex text-nowrap items-center space-x-2 text-foreground/60 text-sm'>
								<span className='font-medium'>LiiChar</span>
								<span>·</span>
								<time dateTime={new Date().toISOString()}>
									{getDate(new Date().toISOString())}
								</time>
							</div>
							<Separator className='flex-1' />
						</div>
					</CardHeader>

					<CardContent className='px-6 space-y-6'>
						{/* Контент */}
						<FormField
							control={form.control}
							name='content'
							render={({ field }) => (
								<FormItem>
									<FormLabel className='text-sm font-medium'>
										Содержание статьи
									</FormLabel>
									<FormControl>
										<MarkdownEditor
											placeholder='Начните писать вашу статью...'
											className='min-h-[300px]'
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
										Теги
									</FormLabel>
									<FormControl>
										<Input
											placeholder='react, nextjs, typescript...'
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
										<Send className='w-4 h-4' />
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

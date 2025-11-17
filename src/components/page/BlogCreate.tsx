'use client';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { getDate } from '@/helpers/date';
import Image from 'next/image';
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
import { MarkdownEditor } from '../ui/markdown-editor';
import { toast } from 'sonner';
import { createBlog } from '@/action/blog/create';
import { useRouter } from 'next/navigation';

const formCreateBlogSchema = z.object({
	title: z.string().min(2, {
		message: 'Название должно быть менее 10 симовлов.',
	}),
	content: z.string().min(10, {
		message: 'Содержание не должно быть менее 10 символов.',
	}),
	tags: z.string().optional(),
	image: z.string().optional(),
});

export const BlogCreatePage = () => {
	const router = useRouter();

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
		try {
			const newBlog = await createBlog({
				...values,
				userId: 1, // Assuming single user
			});

			toast.info(`Статья '${values.title}' была успешно создана`);
			router.push(`/blog/${newBlog.id}`);
		} catch (error) {
			if (error instanceof Error) {
				toast.error(error.message);
			}
		}
	}

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className='mt-4'>
				<Card className='max-w-3xl mx-auto my-8 border-none shadow-lg bg-transparent'>
					<CardHeader className='px-4 sm:px-6 lg:px-8'>
						<FormField
							control={form.control}
							name='title'
							render={({ field }) => (
								<FormItem className='w-full mb-4'>
									<FormControl className='w-full'>
										<div
											contentEditable
											className='!text-5xl text-center font-bold  my-10 w-full !bg-transparent border-0'
											onInput={e =>
												form.setValue('title', e.currentTarget.innerText)
											}
											suppressContentEditableWarning={true}
										>
											{field.value}
										</div>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						{/* Метаданные */}
						<div className='flex w-full justify-between items-center mt-4 gap-4'>
							<div className='flex text-nowrap items-center space-x-2  text-foreground/60 text-sm'>
								<span>LiiChar</span>
								<span>·</span>
								<time dateTime={new Date().toISOString()}>{getDate(new Date().toISOString())}</time>
							</div>
							<Separator className='px-3' />
						</div>
					</CardHeader>

					{form.watch('image') && (
						<div className='px-4 sm:px-6 lg:px-8 mb-6'>
							<Image
								fill={true}
								src={form.watch('image') || ''}
								alt={`Обложка для ${form.watch('title')}`}
								className='w-full h-auto rounded-lg shadow-md object-cover'
							/>
						</div>
					)}

					<CardContent className='px-4 sm:px-6 lg:px-8'>
						<div className='prose prose-lg max-w-none '>
							<FormField
								control={form.control}
								name='content'
								render={({ field }) => (
									<FormItem className='w-full mb-4'>
										<FormControl className='w-full'>
											<MarkdownEditor
												placeholder='Введите содержание'
												className='w-full'
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>
					</CardContent>

					{/* Tags and Save */}
					<div className='flex gap-3 px-8 items-center text-sm mt-auto'>
						<div className='flex gap-1 text-foreground/60 flex-1'>
							<FormField
								control={form.control}
								name='tags'
								render={({ field }) => (
									<FormItem className='flex-1'>
										<FormControl>
											<input
												placeholder='Теги через запятую'
												className='w-full p-2 border rounded'
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>
						<FormField
							control={form.control}
							name='image'
							render={({ field }) => (
								<FormItem>
									<FormControl>
										<input
											placeholder='Ссылка на изображение'
											className='p-2 border rounded'
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<Separator />
						<Button type='submit'>Создать</Button>
					</div>
				</Card>
			</form>
		</Form>
	);
};

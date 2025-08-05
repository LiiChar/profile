'use client';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { getDate } from '@/helpers/date';
import Image from 'next/image';
import Link from 'next/link';
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
import { BlogWithUser } from '@/types/blog';
import { MarkdownEditor } from '../ui/markdown-editor';
import { toast } from 'sonner';
import { updateBlog } from '@/action/blog/update';
import { useRouter } from 'next/navigation';

const formUpdateBlogSchema = z.object({
	title: z.string().min(2, {
		message: 'Название должно быть менее 10 симовлов.',
	}),
	content: z.string().min(10, {
		message: 'Содержание не должно быть менее 10 символов.',
	}),
});

export const BlogUpdatePage = ({ blog }: { blog: BlogWithUser }) => {
	const { content, image, user, title, createdAt, tags } = blog;
	const router = useRouter();

	const form = useForm<z.infer<typeof formUpdateBlogSchema>>({
		resolver: zodResolver(formUpdateBlogSchema),
		defaultValues: {
			title,
			content,
		},
	});

	async function onSubmit(values: z.infer<typeof formUpdateBlogSchema>) {
		try {
			await updateBlog({
				...values,
				userId: blog.userId,
				id: blog.id,
			});

			toast.info(`Статья '${values.title}' была успешно изменена`);
			router.push(`/blog/${blog.id}`);
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
											{...field}
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
								<span>{user.name}</span>
								<span>·</span>
								<time dateTime={createdAt}>{getDate(createdAt)}</time>
							</div>
							<Separator className='px-3' />
						</div>
					</CardHeader>

					{image && (
						<div className='px-4 sm:px-6 lg:px-8 mb-6'>
							<Image
								fill={true}
								src={image}
								alt={`Обложка для ${title}`}
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

					{tags && (
						<div className='flex gap-3 px-8 items-center text-sm mt-auto'>
							<div className='flex gap-1 text-foreground/60'>
								{tags
									.split(',')
									.map(t => t.trim())
									.filter(Boolean)
									.map((t, i, arr) => (
										<div key={t} className='flex gap-1'>
											<Link href={`/blog/tag/` + t} className='text-nowrap'>
												{t}
											</Link>
											{i !== arr.length - 1 && (
												<Separator orientation='vertical' />
											)}
										</div>
									))}
							</div>
							<Separator />
							<Button type='submit'>Сохранить</Button>
						</div>
					)}
				</Card>
			</form>
		</Form>
	);
};

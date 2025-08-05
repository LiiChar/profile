'use client';

import { useState } from 'react';
import { MarkdownEditor } from '../ui/markdown-editor';
import { createComment } from '@/action/comment/create';
import { useRouter } from 'next/navigation';

type CommentTextareaProps = { userId: number; blogyId: number };

export const CommentTextarea = ({ blogyId, userId }: CommentTextareaProps) => {
	const [value, setValue] = useState('');
	const [loading, setLoading] = useState(false);
	const router = useRouter();

	const handleSubmit = async (text: string) => {
		if (!text.trim()) return;

		setLoading(true);
		try {
			await createComment({
				message: text,
				blogId: blogyId,
				userId: userId,
			});
			setValue('');
			router.refresh();
		} catch (e) {
			console.error(e);
		} finally {
			setLoading(false);
		}
	};

	return (
		<MarkdownEditor
			value={value}
			onChange={e => setValue(e.toString())}
			onSubmit={e => handleSubmit(e.toString())}
			disabled={loading}
		/>
	);
};

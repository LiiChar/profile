'use client'
import { Text } from 'lucide-react';
import { useState } from 'react';
import { Textarea } from '../ui/textarea';
import { gigaChat } from '@/action/generate/giga';

export const GenerateIcon = ({
	children,
	context,
	handleGenerate,
}: {
	children: React.ReactNode;
	context?: string;
	handleGenerate: (res: string) => void;
}) => {
	const [visible, setVisible] = useState(false);
	const [text, setText] = useState('');
	const [loading, setLoading] = useState(false);

	const toggleVisible = () => setVisible(v => !v);

	const onGenerate = async () => {
		try {
			setLoading(true);

			const res = await gigaChat([
				{
					role: 'system',
					content: `Ты — помощник. Генерируй ответ строго в контексте: "${context}".`,
				},
				{
					role: 'user',
					content: text,
				},
			]);

			const message = res.choices?.[0]?.message?.content ?? '';
			handleGenerate(message);
		} catch (err) {
			console.error('Ошибка GigaChat:', err);
			handleGenerate('Ошибка при генерации.');
		} finally {
			setVisible(false);
			setLoading(false);
			setText('');
		}
	};

	return (
		<div className='relative' >
			{children}

			<div className='absolute top-0 -right-4'>
				<Text onClick={toggleVisible} className='cursor-pointer' />

				{visible && (
					<div className='p-2  border rounded-xl shadow-md w-56'>
						<Textarea
							value={text}
							onChange={e => setText(e.target.value)}
							placeholder='Введите текст...'
						/>

						<button
							disabled={loading}
							onClick={onGenerate}
							className='mt-2 w-full py-1 text-sm  rounded-md'
						>
							{loading ? 'Генерирую...' : 'Сгенерировать'}
						</button>
					</div>
				)}
			</div>
		</div>
	);
};

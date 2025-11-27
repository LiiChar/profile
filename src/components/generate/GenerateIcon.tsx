'use client'
import { Text } from 'lucide-react';
import { useState } from 'react';
import { Textarea } from '../ui/textarea';
import { cn } from '@/lib/utils';
import { Dropdown } from '../ui/dropdown';
import { Button } from '../ui/button';
import { chat } from '@/action/generate';

type GenerateIconProps = {
	children: React.ReactNode;
	context?: string;
	handleGenerate: (res: string) => void;
} & React.HTMLAttributes<HTMLDivElement>;

export const GenerateIcon = ({
	children,
	handleGenerate,
	className,
	...attr
}: GenerateIconProps) => {
	const [text, setText] = useState('');
	const [loading, setLoading] = useState(false);


	const onGenerate = async () => {
		try {
			setLoading(true);

			const res = await chat(text);

			handleGenerate(res);
		} catch (err) {
			console.error('Ошибка GigaChat:', err);
			handleGenerate('Ошибка при генерации.');
		} finally {
			setLoading(false);
			setText('');
		}
	};

	return (
		<div  {...attr} className={cn('relative', className)}>
			{children}

				<Dropdown align='center' className='mx-2' trigger={<Text size={'17'} className='cursor-pointer  absolute left-2 bottom-2' />}>
					<div className='p-1'>
						<Textarea
							value={text}
							onChange={e => setText(e.target.value)}
							placeholder='Введите текст...'
						/>

						<Button
							disabled={loading}
							onClick={onGenerate}
							className='mt-2 w-full py-1 text-sm  rounded-md'
						>
							{loading ? 'Генерирую...' : 'Сгенерировать'}
						</Button>
					</div>
				</Dropdown>

		</div>
	);
};

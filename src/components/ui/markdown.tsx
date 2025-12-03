'use client';

import Mark from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import remarkGfm from 'remark-gfm';
import { createLowlight, common } from 'lowlight'; // Твой lowlight-instance
import { Copy, Check } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

const lowlightInstance = createLowlight(common); // Фабрика, как мы обсуждали

export function Markdown({ children }: { children: string }) {
	const [copied, setCopied] = useState<string | null>(null);

	const handleCopy = async (code: string) => {
		if (!code) return; // Защита от пустоты — что, если текст nested?
		try {
			await navigator.clipboard.writeText(code);
			setCopied(code);
			setTimeout(() => setCopied(null), 2000);
		} catch (err) {
			console.error('Копирование не сработало:', err); // А fallback? Alert?
		}
	};

	return (
		<Mark
			remarkPlugins={[remarkGfm]}
			rehypePlugins={[
				[
					rehypeHighlight,
					{
						lowlight: lowlightInstance,
						ignoreMissing: true, // Безопасность от неизвестных языков
					},
				],
			]}
			components={{
				pre({ children, ...props }) {
					let codeString = '';
					let language = '';

					const extractFromChild = (
						node: any
					): { code: string; lang: string } => {
						if (typeof node === 'string') return { code: node, lang: '' };
						if (Array.isArray(node)) {
							return node.reduce(
								(acc, child) => {
									const { code, lang } = extractFromChild(child);
									acc.code += code;
									if (lang) acc.lang = lang; // Берём первый lang
									return acc;
								},
								{ code: '', lang: '' }
							);
						}
						if (node?.props) {
							// Для code: ищем className, но НЕ мутируем!
							if (node.type === 'code' && node.props.className) {
								const match = node.props.className.match(/language-(\w+)/);
								language = match ? match[1] : '';
							}
							const { code, lang } = extractFromChild(node.props.children);
							return { code, lang: lang || language };
						}
						return { code: '', lang: '' };
					};

					const { code } = extractFromChild(children);
					codeString = code.trim();

					const isCopied = copied === codeString;

					return (
						<pre
							{...props} // Без className — пусть rehype сам добавит hljs
							className={cn(
								props.className, // Если rehype добавил — ок, но не трогаем
								'relative my-6 overflow-x-auto rounded-lg group bg-background/30 p-2 backdrop-blur-xl'
							)}
						>
							<button
								onClick={() => handleCopy(codeString)}
								className={cn(
									'absolute right-3 top-3 z-10 p-2 rounded-md transition-all opacity-0 group-hover:opacity-100',
									'bg-secondary/40 hover:bg-red-700/5 border border-gray-600',
									isCopied ? 'text-green-400 border-green-500' : 'text-gray-400'
								)}
								aria-label={isCopied ? 'Скопировано!' : 'Копировать код'}
							>
								{isCopied ? (
									<Check size={16} />
								) : (
									<Copy color='#99a1af' size={16} />
								)}
							</button>
							{language && (
								<span className='absolute left-3 top-3 text-xs text-gray-500 bg-gray-800/90 px-2 py-1 rounded'>
									{language.toUpperCase()}
								</span>
							)}
							{children}
						</pre>
					);
				},
				code({ children, className, ...props }) {
					return (
						<code
							className={cn(
								className, 
								'bg-transparent prose prose-sm max-w-none dark:prose-invert' 
							)}
							{...props}
						>
							{children}
						</code>
					);
				},
			}}
		>
			{children}
		</Mark>
	);
}

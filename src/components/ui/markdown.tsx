'use client';
import Mark from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import remarkGfm from 'remark-gfm';

import { cn } from '@/lib/utils';
import { Check, Copy } from 'lucide-react';
import { ReactNode } from 'react';
import { isValidElement } from 'react';

function extractText(node: ReactNode): string {
	if (typeof node === 'string') return node;
	if (Array.isArray(node)) return node.map(extractText).join('');
	if (isValidElement(node)) {
		const children = (node.props as { children?: ReactNode })?.children;
		return extractText(children);
	}
	return '';
}

export const Markdown: typeof Mark = ({ ...arg }) => {
	return (
		<Mark
			{...arg}
			remarkPlugins={[...(arg.remarkPlugins ?? []), remarkGfm]}
			rehypePlugins={[...(arg.rehypePlugins ?? []), rehypeHighlight]}
			components={{
				pre({ children, ...props }) {
					const codeText = extractText(children);

					const handleCopy = async () => {
						try {
							await navigator.clipboard.writeText(codeText);
							// const btn = e.target as any;
							// btn.setAttribute('data-copied', 'true');
							// setTimeout(() => {
							// 	btn.setAttribute('data-copied', 'false');
							// }, 2000);
						} catch (err) {
							console.error('Copy failed', err);
						}
					};

					return (
						<pre {...props} className={cn(props.className, 'relative group')}>
							{children}
							<button
								onClick={handleCopy}
								data-copied='false'
								className='absolute right-0 top-1 text-xs px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity'
							>
								<Copy className='block data-[copied=true]:hidden' size={16} />
								<Check
									className='hidden data-[copied=true]:block text-green-500'
									size={16}
								/>
							</button>
						</pre>
					);
				},
			}}
		>
			{arg.children}
		</Mark>
	);
};

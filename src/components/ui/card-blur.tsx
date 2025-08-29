import React from 'react';
import { Card, CardContent } from './card';
import { cn } from '@/lib/utils';
import Image from 'next/image';

type CardBlurProps = {
	children?: React.ReactNode;
	wallpaper?: string;
} & React.HTMLAttributes<HTMLDivElement>;

const defaultImageUrl = '/media/background/1.webp';

export const CardBlur = ({
	children,
	wallpaper = defaultImageUrl,
	...attr
}: CardBlurProps) => {
	return (
		<Card
			{...attr}
			className={cn(
				'backdrop-blur-sm p-0 overflow-hidden group',
				attr.className
			)}
		>
			{wallpaper && (
				<Image
					fill={true}
					className='object-cover w-full h-full group-hover:opacity-20 transition-all opacity-10 absolute top-0 left-0'
					src={wallpaper}
					alt='wallpaper'
				/>
			)}
			<CardContent
				className={cn(
					'backdrop-blur-sm py-4 group-hover:scale-[1.01] transition-all h-full'
				)}
			>
				{children}
			</CardContent>
		</Card>
	);
};

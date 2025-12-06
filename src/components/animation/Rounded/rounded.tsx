import { cn } from '@/lib/utils';
import React, { HTMLAttributes } from 'react';
import style from './rounded.module.css'

type LogoProps = {
	children?: React.ReactNode;
} & HTMLAttributes<HTMLDivElement>;

export const Rounded = ({ ...attr }: LogoProps) => {
	return (
		<div
			{...attr}
			className={cn(
				'h-full w-full relative flex justify-center items-center',
				attr.className
			)}
		>
			<RoundedCircle />
			<div className='text-background z-20'>{attr.children}</div>
		</div>
	);
};

const RoundedCircle = () => {
	const sharedClassName = cn(
		'cursor-pointer absolute aspect h-full w-full aspect-square border-[1.5px] border-foreground bg-foreground opacity-60 rounded-[40%_42%_45%_55%] -z-10'
	);

	return (
		<>
			<div className={cn(sharedClassName, style.shape)} />
			<div className={cn(sharedClassName, style['shape-1'])} />
			<div className={cn(sharedClassName, style['shape-2'])} />
		</>
	);
};

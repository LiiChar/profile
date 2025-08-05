import { cn } from '@/lib/utils';
import React, { HTMLAttributes } from 'react';
// import MetaBalls from '../ui/metaballs';

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
			{/* <MetaBalls
				color='#ffffff'
				enableMouseInteraction={true}
				enableTransparency={true}
				hoverSmoothness={0.05}
				cursorBallColor='#ffffff'
				className='absolute z-10 scale-[1.80]'
				ballCount={30}
				speed={0.5}
				animationSize={25}
				clumpFactor={0.4}
			/> */}
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
			<div className={cn(sharedClassName, 'shape ')} />
			<div className={cn(sharedClassName, 'shape-1 ')} />
			<div className={cn(sharedClassName, 'shape-2 ')} />
			{/* <div className={cn(sharedClassName, 'goTo')} />
			<div className={cn(sharedClassName, 'goBack')} /> */}
		</>
	);
};

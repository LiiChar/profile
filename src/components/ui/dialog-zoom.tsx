import {
	Dialog,
	DialogContent,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

type DialogZoomProps = {
	children: React.ReactNode;
	trigger: React.ReactNode;
	title?: string;
} & React.HTMLAttributes<HTMLDivElement>;

export const DialogZoom = ({
	children,
	trigger,
	title,
	...attr
}: DialogZoomProps) => {
	return (
		<Dialog>
			<DialogTrigger className='cursor-pointer' asChild>
				{trigger}
			</DialogTrigger>
			<DialogContent
				{...attr}
				className={cn(
					'data-[state=open]:!zoom-in-0 data-[state=open]:duration-600 sm:max-w-[425px] bg-transparent border-0',
					attr.className
				)}
			>
				<DialogTitle className='absolute bottom-0 z-10 pb-4 no-underline w-full text-center'>
					{title}
				</DialogTitle>
				{children}
			</DialogContent>
		</Dialog>
	);
};

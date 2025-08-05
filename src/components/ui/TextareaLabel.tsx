import { useId } from 'react';

import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

type TextareaLabelProps = {
	label?: string;
} & React.ComponentProps<'textarea'>;

export const TextareaLabel = ({
	label,
	required,
	...attr
}: TextareaLabelProps) => {
	const id = useId();

	return (
		<div className='relative w-full'>
			<Label
				htmlFor={id}
				className='bg-background text-foreground absolute start-2 top-0 z-10 block -translate-y-1/2 px-1 text-xs font-medium group-has-disabled:opacity-50'
			>
				{label}
				{required && <span className='text-destructive'> *</span>}
			</Label>
			<Textarea
				id={id}
				{...attr}
				className={cn('!bg-background', attr.className)}
			/>
		</div>
	);
};

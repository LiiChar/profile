import { useId } from 'react';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type InputLabelProps = {
	label?: string;
} & React.ComponentProps<'input'>;

export const InputLabel = ({ label, required, ...attr }: InputLabelProps) => {
	const id = useId();

	return (
		<div className='group relative w-full'>
			<Label
				htmlFor={id}
				className='bg-background text-foreground absolute start-2 top-0 z-1 block -translate-y-1/2 px-1 text-xs'
			>
				{label}
				{required && <span className='text-destructive'> *</span>}
			</Label>
			<Input id={id} {...attr} />
		</div>
	);
};

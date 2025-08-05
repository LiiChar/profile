'use client';

import { ReactNode, useState } from 'react';

import { Switch } from '@/components/ui/switch';

type SwitchDetail = {
	value?: boolean;
	first: ReactNode;
	second: ReactNode;
	variant?: 'square' | 'pill';
} & React.HTMLAttributes<HTMLDivElement>;

const SwitchDetail = ({
	value,
	first,
	second,
	variant = 'pill',
	...attr
}: SwitchDetail) => {
	const [checked, setChecked] = useState<boolean>(value ?? true);

	const rounded = variant === 'pill' ? 'rounded-full' : 'rounded-sm';

	return (
		<div {...attr}>
			<div className='relative inline-grid h-full grid-cols-[1fr_1fr] w-full items-center font-medium'>
				<Switch
					checked={checked}
					onCheckedChange={setChecked}
					className={`peer data-[state=unchecked]:bg-input/50  absolute inset-0 h-[inherit] w-auto ${rounded} [&_span]:z-10 [&_span]:h-full [&_span]:w-[52%] [&_span]:${rounded} [&_span]:transition-transform [&_span]:duration-300 [&_span]:ease-[cubic-bezier(0.16,1,0.3,1)]  [&_span]:data-[state=checked]:mr-1`}
					aria-label='Square switch with permanent text indicators'
				/>
				<span className='pointer-events-none relative ms-0.5 flex items-center justify-center -ml-[0.5px]  w-full text-center transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] peer-data-[state=checked]:invisible peer-data-[state=unchecked]:translate-x-full peer-data-[state=unchecked]:rtl:-translate-x-full text-'>
					{first}
				</span>
				<span className='peer-data-[state=checked]:text-foreground pointer-events-none relative me-0.5 flex items-center justify-center text-center transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] peer-data-[state=checked]:-translate-x-full peer-data-[state=unchecked]:invisible peer-data-[state=checked]:rtl:translate-x-full'>
					{second}
				</span>
			</div>
		</div>
	);
};
export default SwitchDetail;

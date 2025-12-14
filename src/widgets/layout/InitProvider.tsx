import React, { PropsWithChildren } from 'react';
import { Toaster, } from '@/components/ui/sonner';

export const InitProvider = ({ children }: PropsWithChildren) => {
	return (
		<>
			{children}
			<Toaster />
		</>
	);
};

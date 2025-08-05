'use client';
import React, { PropsWithChildren } from 'react';
import { Toaster } from '@/components/ui/sonner';
import { useFullPageScroll } from '@/hooks/useFullPageScroll';

export const InitProvider = ({ children }: PropsWithChildren) => {
	useFullPageScroll();
	return (
		<>
			{children}
			<Toaster />
		</>
	);
};

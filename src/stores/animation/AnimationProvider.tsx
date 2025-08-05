'use client';

import { ReactNode } from 'react';

type AnimationProviderProps = {
	children?: ReactNode;
};

export const AnimationProvider = ({ children }: AnimationProviderProps) => {
	return <>{children}</>;
};

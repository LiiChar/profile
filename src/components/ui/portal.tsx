'use client';

import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

type PortalProps = {
	children: React.ReactNode;
	container?: HTMLElement | null;
};

export default function Portal({ children, container }: PortalProps) {
	const [target, setTarget] = useState<HTMLElement | null>(null);

	useEffect(() => {
		setTarget(container ?? document.body);
	}, [container]);

	if (!target) return null;
	return createPortal(children, target);
}

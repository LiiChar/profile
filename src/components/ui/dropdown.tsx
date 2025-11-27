'use client';

import * as React from 'react';
import {
	DropdownMenu,
	DropdownMenuTrigger,
	DropdownMenuContent,
	DropdownMenuPortal,
} from '@/components/ui/dropdown-menu';
import { DropdownMenuContentProps } from '@radix-ui/react-dropdown-menu';

interface DropdownProps extends Omit<DropdownMenuContentProps, 'children'> {
	children: React.ReactNode;
	trigger: React.ReactNode;
	modal?: boolean; // по умолчанию true, но можно отключить для диалогов
	portal?: boolean; // включать Portal или нет
}

export function Dropdown({
	children,
	trigger,
	modal = true,
	portal = true,
  ...props
}: DropdownProps) {
	const content = (
		<DropdownMenuContent align='end' sideOffset={4} className='w-56' {...props}>
			{children}
		</DropdownMenuContent>
	);

	return (
		<DropdownMenu modal={modal}>
			<DropdownMenuTrigger asChild>{trigger}</DropdownMenuTrigger>
			{portal ? <DropdownMenuPortal>{content}</DropdownMenuPortal> : content}
		</DropdownMenu>
	);
}

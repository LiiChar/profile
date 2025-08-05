import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import { ReactNode } from 'react';
import { ContactForm } from '../form/ContactForm';
import { cn } from '@/lib/utils';

type ContactModalProps = {
	children?: ReactNode;
} & React.ComponentProps<'div'>;

export function ContactModal({ children, ...attr }: ContactModalProps) {
	return (
		<Dialog>
			<DialogTrigger asChild>{children}</DialogTrigger>
			<DialogContent {...attr} className={cn('', attr.className)}>
				<DialogHeader>
					<DialogTitle>Отправить сообщение</DialogTitle>
					<DialogDescription className='leading-5'>
						Отправьте сообщение на почту, ответ придёт через некоторое время
					</DialogDescription>
				</DialogHeader>
				<ContactForm />
			</DialogContent>
		</Dialog>
	);
}

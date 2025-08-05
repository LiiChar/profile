import { Text } from '@/components/ui/text-server';
import { Social } from './Social';

export const Footer = async () => {
	return (
		<>
			<Social />
			<footer className=''>
				<div className='text-center text-foreground/60  border-t border-foreground/50 py-4 text-sm'>
					<p>
						© {new Date().getFullYear()} <Text text='layout.footer.text' />
					</p>
				</div>
			</footer>
		</>
	);
};

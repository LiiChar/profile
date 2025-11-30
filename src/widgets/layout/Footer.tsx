import { Social } from './Social';
import { NavigationFooterLinks } from './NavigationFooterLinks';

export const Footer = async () => {
	return (
		<>
			<Social />
			<footer className='py-4'>
				<NavigationFooterLinks />
			</footer>
		</>
	);
};

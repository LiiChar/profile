import Link from 'next/link';
import './global.css';
import Life from '@/components/Life/page';
import Hello from '@/components/Hello/page';
import Header from '@/components/Header/page';
import About from '@/components/About/page';
import Portfolio from '@/components/Portfolio/page';
import Contacts from '@/components/Contacts/page';
import AboutME from '@/components/About/AboutMe/component';

export default function Home() {
	return (
		<main>
			<Life />
			<Hello />
			<Header />
			<AboutME />
			<Portfolio />
			<Contacts />
		</main>
	);
}

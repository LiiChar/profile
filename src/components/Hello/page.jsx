import Link from 'next/link';
import './page.css';

export default function Hello() {
	return (
		<div className='wrapperHello' id='home'>
			<div className='hello'>
				<div>
					Привет, я <span className='name'>Иванов Максим</span>.
				</div>
				<div>Я фронтенд-разработчик</div>
				<Link href='#portfolio'>
					Посмотри мои работы <span className='array'>&rarr;</span>
				</Link>
			</div>
		</div>
	);
}

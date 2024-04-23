'use client';
import Image from 'next/image';
import React, { memo } from 'react';
import Project from '@/components/Portfolio/Project/component';
import { AnimatePresence, motion } from 'framer-motion';
import {
	CarouselProvider,
	Slider,
	Slide,
	ButtonBack,
	ButtonNext,
} from 'pure-react-carousel';
import './portfolio.css';

const Portfolio = () => {
	const [visible, setVisible] = React.useState(0);
	const [filter, setFilter] = React.useState('');
	const [visionDescription, setVisionDescription] = React.useState(0);

	let data = datas.filter(el =>
		filter == '' ? true : el.tags.includes(filter.toLowerCase())
	);

	const handleVisionDescription = React.useCallback(num => {
		setVisionDescription(num);
	}, []);

	return (
		<div id='portfolio'>
			<div className='wrapName'>
				<div className='PROJECTS'>PROJECTS</div>
			</div>
			<div className='wrapProjects'>
				<div className='filterTags'>
					<div className='tags'>
						<div
							className={filter == '' ? 'pick' : ''}
							onClick={() => setFilter('')}
						>
							ALL
						</div>
						<div
							className={filter == 'node' ? 'pick' : ''}
							onClick={() => setFilter('node')}
						>
							NODE
						</div>
						<div
							className={filter == 'react' ? 'pick' : ''}
							onClick={() => setFilter('react')}
						>
							REACT
						</div>
						<div
							className={filter == 'php' ? 'pick' : ''}
							onClick={() => setFilter('php')}
						>
							PHP
						</div>
						<div
							className={filter == 'javascript' ? 'pick' : ''}
							onClick={() => setFilter('javascript')}
						>
							JAVASCRIPT
						</div>
					</div>
				</div>
				<div className='projectsWrap'>
					<AnimatePresence>
						{data.map(proj => (
							<motion.div
								key={proj.id}
								initial={{ x: -100, opacity: 0 }}
								animate={{ x: 0, opacity: 1 }}
								transition={{ ease: 'easeOut', duration: 0.6 }}
								exit={{ x: 100, opacity: 0 }}
								onMouseOver={() => setVisible(proj.id + 1)}
								onMouseOut={() => setVisible(0)}
								className='project'
							>
								<div
									style={{
										zIndex: '-1',
										width: '100%',
										height: '100%',
										position: 'relative',
									}}
								>
									<CarouselProvider
										currentSlide={0}
										isPlaying={true}
										infinite={true}
										interval={1500}
										step={1}
										totalSlides={proj.images.length + 1}
										naturalSlideHeight={400}
										naturalSlideWidth={650}
										orientation='horizontal'
									>
										<Slider>
											{proj.images.map((image, i) => (
												<Slide
													style={{
														zIndex: '-1',
														width: 'calc(50vw - 8px)',
														height: 'calc(30vw - 8px)',
														position: 'relative',
													}}
													index={i}
													key={'image'}
												>
													<Image
														alt='img'
														style={{
															width: '100%',
															height: '100%',
															position: 'absolute',
														}}
														src={'http://localhost:3000' + image}
														loader={() => 'http://localhost:3000' + image}
														className='imagerat'
														priority={true}
														unoptimized={true}
														sizes='calc(50vw - 8px) calc(50vw - 8px)'
														fill={true}
													/>
												</Slide>
											))}
										</Slider>
									</CarouselProvider>
								</div>
								{visible == proj.id + 1 && (
									<motion.div
										className='infoProject'
										initial='hidden'
										animate='visibles'
										exit={{ scale: 0.8, opacity: 0 }}
										variants={{
											hidden: {
												scale: 0.8,
												opacity: 0,
											},

											visibles: {
												scale: 1,
												opacity: 1,
												transition: {
													delay: 0.1,
												},
											},
										}}
									>
										<div className='wrapInfoProj'>
											<div className='infoProj'>
												<div className='nameProject'>{proj.name}</div>
											</div>
											<div className='infoDescription'>{proj.description}</div>
											<div>
												<button
													onClick={() => handleVisionDescription(proj.id + 1)}
													className='buttonProject'
												>
													LEARN MORE
												</button>
											</div>
										</div>
									</motion.div>
								)}

								{visionDescription == proj.id + 1 && (
									<Project
										data={proj}
										close={() => handleVisionDescription(0)}
									/>
								)}
							</motion.div>
						))}
					</AnimatePresence>
				</div>
			</div>
		</div>
	);
};

let datas = [
	{
		id: 0,
		name: 'IGuru',
		description: `Добро пожаловать на сайт, где встречаются страсть к технологиям и безграничные возможности! Мы - сообщество энтузиастов, айтишников и просто любителей качественных гаджетов. Если вы разделяете наше восхищение перед инновациями и прогрессом, то вы нашли свое место.

iPhone - это не просто смартфон. Это символ превосходства в мире мобильных технологий. На нашем сайте вы найдете все, что нужно знать о легендарном устройстве от Apple. Мы следим за последними новостями, обсуждаем актуальные тренды и делимся полезными советами по использованию iPhone.

От обзоров новейших моделей до секретов оптимизации работы вашего гаджета - здесь вы найдете всю необходимую информацию. Наша миссия - помочь вам раскрыть потенциал вашего iPhone и сделать вашу жизнь еще более комфортной и удивительной.

Присоединяйтесь к нам и окунитесь в мир инноваций и технологического совершенства с iPhone!`,
		images: ['/image/projects/guru/image1.png'],
		linkProd: '',
		linkCode:
			'https://github.com/LiiChar/code/tree/825933bf22937e1be6cc1ec57b73e9bc3f279ff5/language/php/common/ForumForPractice',
		tags: ['php'],
	},
	{
		id: 1,
		name: 'Be Lab',
		description: `Добро пожаловать в мир творчества и красоты! Фотостудия Be Lab приглашает вас на увлекательное путешествие в мир изысканной фотографии и неповторимых образов. Мы создаем атмосферу, где каждый момент запечатлевается с любовью и вниманием к деталям.

Наша команда состоит из талантливых фотографов и стилистов, которые готовы помочь вам раскрыть вашу индивидуальность и красоту через объектив камеры. Независимо от того, нужна вам профессиональная фотосессия, свадебный альбом, семейный портрет или корпоративная фотография, мы предлагаем вам высококачественные услуги и индивидуальный подход к каждому клиенту.

Наши студии оборудованы самой современной техникой, а интерьеры созданы для того, чтобы подчеркнуть вашу неповторимость и создать идеальную обстановку для съемок. Мы заботимся о каждой детали, чтобы ваш опыт работы с нами был незабываемым и приятным.

Присоединяйтесь к нам и откройте для себя мир красоты и эмоций вместе с фотостудией Be Lab. Мы готовы помочь вам сохранить важные моменты вашей жизни в уникальных кадрах, которые будут радовать вас годы спустя.`,
		images: [
			'/image/projects/photo/image1.png',
			'/image/projects/photo/image2.png',
			'/image/projects/photo/image3.png',
		],
		linkProd: '',
		linkCode:
			'https://github.com/LiiChar/code/tree/825933bf22937e1be6cc1ec57b73e9bc3f279ff5/language/javascript/react/try-i18n',
		tags: ['react', 'javascript'],
	},
	{
		id: 2,
		name: 'Js-front',
		description: `Конечно, вот пример описания для сайта обучения фронтенд-разработке:

Добро пожаловать на платформу, где мечты о карьере в IT становятся реальностью! Наш сайт предлагает вам уникальную возможность освоить фронтенд-разработку - захватывающее и перспективное направление в мире информационных технологий.

Фронтенд - это лицо веб-разработки. Это то, что пользователи видят и взаимодействуют с ними на экране своего устройства. Мы убеждены, что хорошо выстроенный фронтенд - это не только красивый дизайн, но и удобство использования, быстрая загрузка и отзывчивость интерфейса.

Наши курсы по фронтенд-разработке предназначены как для начинающих, так и для тех, кто уже имеет определенный опыт в этой области. Мы предлагаем обширную программу обучения, которая включает в себя изучение основ HTML, CSS и JavaScript, а также современных фреймворков и библиотек, таких как React, Angular и Vue.js.

Наша методика обучения основана на практическом подходе и проектной работе. Мы уверены, что лучший способ научиться - это делать. Поэтому наши студенты имеют возможность применять полученные знания на практике, работая над реальными проектами и задачами.`,
		images: [
			'/image/projects/styde/image1.png',
			'/image/projects/styde/image2.png',
			'/image/projects/styde/image3.png',
			'/image/projects/styde/image4.png',
		],
		linkProd: 'https://book-styde.vercel.app/',
		linkCode: 'https://github.com/LiiChar/book-styde',
		tags: ['next', 'react', 'javascript', 'node'],
	},

	{
		id: 3,
		name: 'WeatherAxis',
		description: `Добро пожаловать на наш сайт, где каждый может получить самую актуальную и точную информацию о погоде в любом уголке мира! Мы - ваш надежный проводник в мире метеорологии, предоставляя вам всю необходимую информацию для планирования вашего дня, недели или отпуска.

Наш сайт предоставляет подробные прогнозы погоды на сегодня, завтра и на ближайшую неделю. Мы отслеживаем изменения температуры, атмосферного давления, скорости и направления ветра, а также вероятность выпадения осадков, чтобы вы всегда были в курсе текущей ситуации.

Вам интересно, какая погода будет на вашем любимом курорте на следующей неделе? Мечтаете узнать, нужно ли взять зонт с собой на прогулку? Наши точные прогнозы помогут вам принимать информированные решения, основанные на данных, предоставленных профессиональными метеорологами.`,
		images: [
			'/image/projects/weather/image1.png',
			'/image/projects/weather/image2.png',
			'/image/projects/weather/image3.png',
		],
		linkProd: '',
		linkCode:
			'https://github.com/LiiChar/code/tree/825933bf22937e1be6cc1ec57b73e9bc3f279ff5/pet-project/Weather',
		tags: ['next', 'react', 'javascript', 'node'],
	},
	{
		id: 4,
		name: 'Schedule',
		description:
			'Сайт для просмотра расписания, написанный на чистом javascript',
		images: [
			'/image/projects/schedule/image1.png',
			'/image/projects/schedule/image2.png',
			'/image/projects/schedule/image3.png',
			'/image/projects/schedule/image4.png',
		],
		linkProd: 'https://schedule-pi.vercel.app/',
		linkCode: 'https://github.com/LiiChar/Raspisanie',
		tags: ['javascript'],
	},
	// {
	// 	id: 5,
	// 	name: 'Блог',
	// 	description:
	// 		'Сайт для размещения блогов, фронтенд написан на reactjs, бекэед на nestjs',
	// 	images: '/image/proj/habric.png',
	// 	linkProd: '',
	// 	linkCode: '',
	// 	tags: ['react', 'nest'],
	// },
];

export default Portfolio;

import { Text } from '@/components/ui/text-server';
import { MapPin, Phone, Mail } from 'lucide-react';
import { ResumeDownloadButtons } from '@/components/resume/ResumeDownloadButtons';
import ArticleNav from '@/widgets/article/ArticleNav';

export default async function Resume() {
  return (
		<main className='min-h-screen px-4 py-6 md:px-6 md:py-12 relative rusume-content'>
			<div className='mx-auto max-w-4xl space-y-12'>
				{/* Header Section */}
				<div className='space-y-6'>
					<div className='text-center space-y-4'>
						<h1 className='text-5xl md:text-6xl font-extrabold text-foreground tracking-tight'>
							<Text text='page.resume.personal.name' />
						</h1>
						<h2 className='text-2xl md:text-3xl font-semibold text-muted-foreground uppercase tracking-wide'>
							<Text text='page.resume.personal.title' />
						</h2>
					</div>

					{/* Contact Information */}
					<div className='flex flex-wrap justify-center gap-6 text-muted-foreground'>
						<div className='flex items-center gap-2'>
							<MapPin className='h-5 w-5 text-primary' />
							<span>
								<Text text='page.resume.personal.location' />
							</span>
						</div>
						<div className='flex items-center gap-2'>
							<Phone className='h-5 w-5 text-primary' />
							<span>
								<Text text='page.resume.personal.phone' />
							</span>
						</div>
						<div className='flex items-center gap-2'>
							<Mail className='h-5 w-5 text-primary' />
							<span>
								<Text text='page.resume.personal.email' />
							</span>
						</div>
					</div>
				</div>

				{/* Introduction Section */}
				<div className='space-y-4'>
					<h2 className='text-3xl font-bold text-foreground border-b-2 border-border pb-2'>
						<Text text='page.resume.personal.about.title' />
					</h2>
					<p className='text-foreground/90 leading-relaxed text-lg whitespace-pre-line'>
						<Text text='page.resume.personal.about.content' />
					</p>
				</div>

				{/* Work Experience */}
				<div className='space-y-6'>
					<h2 className='text-3xl font-bold text-foreground border-b-2 border-border pb-2'>
						Опыт работы
					</h2>
					<div className='space-y-8'>
						<div className='bg-card p-6 rounded-lg border border-border'>
							<div className='flex flex-col md:flex-row md:items-center md:justify-between mb-4'>
								<h3 className='text-xl font-semibold text-foreground'>
									Разработчик
								</h3>
								<span className='bg-muted px-3 py-1 rounded-md text-sm font-medium text-muted-foreground mt-2 md:mt-0'>
									06-2024 — 06-2025
								</span>
							</div>
							<div className='space-y-4'>
								<div className='flex items-center gap-4'>
									<span className='text-lg font-medium text-foreground'>
										ООО «Артена»
									</span>
									<a
										href='https://artena.ru/'
										target='_blank'
										className='text-primary hover:underline'
									>
										artena.ru/
									</a>
								</div>
								<p className='text-muted-foreground'>Россия, Екатеринбург</p>
								<p className='text-foreground/90'>
									Занимался разработкой, доработкой сайтов для бизнеса.
								</p>

								<div>
									<h4 className='font-semibold text-foreground mb-3'>
										Обязанности:
									</h4>
									<ul className='space-y-2 text-foreground/80 ml-6'>
										<li className='list-disc'>
											Дорабатывал и модернизировал готовые сайты клиентов на
											1С-Bitrix24
										</li>
										<li className='list-disc'>
											Выполнял задачи по ТЗ: новые страницы, формы, интеграции,
											исправление багов
										</li>
										<li className='list-disc'>
											Оптимизировал скорость загрузки и мобильную адаптивность
											(PageSpeed 90+ баллов)
										</li>
										<li className='list-disc'>
											Занимался доступностью (WCAG) и базовым SEO: метатеги,
											ЧПУ, микроразметка schema.org
										</li>
										<li className='list-disc'>
											Писал кастомные скрипты и виджеты на JavaScript, иногда
											React/Vue для отдельных блоков
										</li>
										<li className='list-disc'>
											Работал с конструкторами (Bitrix, wordpress, иногда
											Tilda), вносил правки в PHP-шаблоны
										</li>
										<li className='list-disc'>
											Получал обратную связь от менеджеров и клиентов, закрывал
											задачи в срок
										</li>
									</ul>
								</div>

								<div>
									<h4 className='font-semibold text-foreground mb-3'>
										Достижения:
									</h4>
									<ul className='space-y-2 text-foreground/80 ml-6'>
										<li className='list-disc'>
											Сократил время отклика приложения на 30% за счет
											оптимизации запросов к базе данных и внедрения
											кэширования.
										</li>
										<li className='list-disc'>
											Увеличил масштабируемость приложения, разработав новую
											архитектуру API, что позволило обрабатывать на 50% больше
											запросов в час пик.
										</li>
									</ul>
								</div>
							</div>
						</div>
					</div>
				</div>

				{/* Education */}
				<div className='space-y-6'>
					<h2 className='text-3xl font-bold text-foreground border-b-2 border-border pb-2'>
						Образование
					</h2>
					<div className='bg-card p-6 rounded-lg border border-border'>
						<div className='flex flex-col md:flex-row md:items-center md:justify-between mb-4'>
							<h3 className='text-xl font-semibold text-foreground'>
								Среднее профессиональное
							</h3>
							<span className='bg-muted px-3 py-1 rounded-md text-sm font-medium text-muted-foreground mt-2 md:mt-0'>
								09-2020 — 05-2024
							</span>
						</div>
						<div className='space-y-2'>
							<p className='font-medium text-foreground'>
								Нижнетагильский торгово-экономический колледж
							</p>
							<p className='text-muted-foreground'>Россия</p>
						</div>
					</div>
				</div>

				{/* Projects */}
				<div className='space-y-6'>
					<h2 className='text-3xl font-bold text-foreground border-b-2 border-border pb-2'>
						Проекты
					</h2>
					<div className='bg-card p-6 rounded-lg bo rder border-border'>
						<div className='flex flex-col md:flex-row md:items-center md:justify-between mb-4'>
							<h3 className='text-xl font-semibold text-foreground'>
								Изменение структуры каталога сайта
							</h3>
							<span className='bg-muted px-3 py-1 rounded-md text-sm font-medium text-muted-foreground mt-2 md:mt-0'>
								02-2025
							</span>
						</div>
						<div className='space-y-4'>
							<p className='font-medium text-foreground'>{`ООО "ПААЗ"`}</p>
							<a
								href='https://www.paaz.ru/'
								target='_blank'
								className='text-primary hover:underline'
							>
								www.paaz.ru/
							</a>
							<p className='text-foreground/90'>
								Занимался переработкой структуры основного каталога сайта, чтобы
								повысить конверсию и исправить проблемы с ЧПУ. Добавил более
								логичную навигацию и оптимизировал распределение категорий. В
								итоге улучшилось поведение пользователей и повысилась видимость
								страниц в поиске.
							</p>
						</div>
					</div>
				</div>

				{/* Languages */}
				<div className='space-y-6'>
					<h2 className='text-3xl font-bold text-foreground border-b-2 border-border pb-2'>
						Языки
					</h2>
					<div className='bg-card p-6 rounded-lg border border-border'>
						<div className='flex items-center justify-between'>
							<span className='font-medium text-foreground'>Английский</span>
							<span className='bg-muted px-3 py-1 rounded-md text-sm font-medium text-muted-foreground'>
								B1
							</span>
						</div>
					</div>
				</div>

				{/* Links */}
				<div className='space-y-6'>
					<h2 className='text-3xl font-bold text-foreground border-b-2 border-border pb-2'>
						Ссылки
					</h2>
					<div className='bg-card p-6 rounded-lg border border-border space-y-3'>
						<div className='flex items-center gap-3'>
							<strong className='font-semibold text-foreground min-w-[100px]'>
								Telegram:
							</strong>
							<a
								href='https://t.me/lLItaV'
								className='text-primary hover:underline'
							>
								t.me/lLItaV
							</a>
						</div>
						<div className='flex items-center gap-3'>
							<strong className='font-semibold text-foreground min-w-[100px]'>
								Email:
							</strong>
							<a
								href='mailto:litavanchik@gmail.com'
								className='text-primary hover:underline'
							>
								litavanchik@gmail.com
							</a>
						</div>
						<div className='flex items-center gap-3'>
							<strong className='font-semibold text-foreground min-w-[100px]'>
								GitHub:
							</strong>
							<a
								href='https://github.com/LiiChar'
								className='text-primary hover:underline'
							>
								github.com/LiiChar
							</a>
						</div>
					</div>
				</div>

				{/* Skills */}
				<div className='space-y-6'>
					<h2 className='text-3xl font-bold text-foreground border-b-2 border-border pb-2'>
						Навыки
					</h2>

					<div className='grid md:grid-cols-2 gap-6'>
						{/* Technical Skills */}
						<div className='bg-card p-6 rounded-lg border border-border space-y-4'>
							<h3 className='text-lg font-semibold text-foreground'>
								Технические навыки
							</h3>
							<div className='flex flex-wrap gap-2'>
								{[
									'TypeScript',
									'React',
									'Git',
									'Vue',
									'Redux',
									'Next.js',
									'Tailwind',
									'Node.js',
									'CSS',
									'HTML',
									'Javascript',
								].map(skill => (
									<span
										key={skill}
										className='bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium'
									>
										{skill}
									</span>
								))}
							</div>
						</div>

						{/* Soft Skills */}
						<div className='bg-card p-6 rounded-lg border border-border space-y-4'>
							<h3 className='text-lg font-semibold text-foreground'>
								Софт навыки
							</h3>
							<div className='flex flex-wrap gap-2'>
								{[
									'Командная работа',
									'Решение проблем',
									'Коммуникация',
									'Самостоятельность',
								].map(skill => (
									<span
										key={skill}
										className='bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-sm font-medium'
									>
										{skill}
									</span>
								))}
							</div>
						</div>
					</div>
				</div>

				{/* Download Section */}
				<ResumeDownloadButtons />
			</div>
			<div className='max-w-4xl w-full z-[100000000000] pr-8 md:pr-12 top-[50%] flex justify-end translate-y-[-50%] fixed'>
				<ArticleNav
					className='relative min-[1250px]:translate-x-[100%]'
					targetSelect='.rusume-content'
				/>
			</div>
		</main>
	);
}

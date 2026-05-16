import { Text } from '@/components/ui/text-server';
import { MapPin, Phone, Mail } from 'lucide-react';
import { ResumeDownloadButtons } from '@/components/resume/ResumeDownloadButtons';
import ArticleNav from '@/widgets/article/ArticleNav';
import { getDictionary } from '@/dictionaries/dictionaries';
import { getFromDict } from '@/helpers/i18n-client';
import { LangParams } from '@/types/i18n';

export const dynamic = 'force-static';

export default async function Resume({ params }: LangParams) {
	const { lang } = await params;
	const dict = await getDictionary(lang as 'en' | 'ru');
	const t = (path: string) => getFromDict(dict, path);

	const responsibilities =
		(t('page.resume.experience.position1.responsibilities') as string[]) ??
		[];
	const achievements =
		(t('page.resume.experience.position1.achievements') as string[]) ?? [];
	const technicalSkills =
		(t('page.resume.skills.technicalList') as string[]) ?? [];
	const softSkills = (t('page.resume.skills.softList') as string[]) ?? [];

	const experienceWebsite = t(
		'page.resume.experience.position1.website'
	) as string;
	const experienceWebsiteUrl = experienceWebsite?.startsWith('http')
		? experienceWebsite
		: `https://${experienceWebsite}`;

	const projectWebsite = t(
		'page.resume.projects.project1.website'
	) as string;
	const projectWebsiteUrl = projectWebsite?.startsWith('http')
		? projectWebsite
		: `https://${projectWebsite}`;

	const telegram = t('page.resume.contact.telegram') as string;
	const email = t('page.resume.contact.email') as string;
	const github = t('page.resume.contact.github') as string;

	return (
		<main className='min-h-screen px-4 py-6 md:px-6 md:py-12 relative rusume-content'>
			<div className='mx-auto max-w-4xl space-y-12 resume-content'>
				<div className='space-y-6'>
					<div className='text-center space-y-4'>
						<h1 className='text-5xl md:text-6xl font-extrabold text-foreground tracking-tight'>
							<Text text='page.resume.personal.name' />
						</h1>
						<h2 className='text-2xl md:text-3xl font-semibold text-muted-foreground uppercase tracking-wide'>
							<Text text='page.resume.personal.title' />
						</h2>
					</div>
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

				<div className='space-y-4'>
					<h2 className='text-3xl font-bold text-foreground border-b-2 border-border pb-2'>
						{t('page.resume.personal.about.title')}
					</h2>
					<p className='text-foreground/90 leading-relaxed text-lg whitespace-pre-line'>
						{t('page.resume.personal.about.content')}
					</p>
				</div>

				<div className='space-y-6'>
					<h2 className='text-3xl font-bold text-foreground border-b-2 border-border pb-2'>
						<Text text='page.resume.sections.experience' />
					</h2>
					<div className='space-y-8'>
						<div className='bg-card p-6 rounded-lg border border-border'>
							<div className='flex flex-col md:flex-row md:items-center md:justify-between mb-4'>
								<h3 className='text-xl font-semibold text-foreground'>
									<Text text='page.resume.experience.position1.position' />
								</h3>
								<span className='bg-muted px-3 py-1 rounded-md text-sm font-medium text-muted-foreground mt-2 md:mt-0'>
									<Text text='page.resume.experience.position1.date.start' /> —{' '}
									<Text text='page.resume.experience.position1.date.end' />
								</span>
							</div>
							<div className='space-y-4'>
								<div className='flex items-center gap-4'>
									<span className='text-lg font-medium text-foreground'>
										<Text text='page.resume.experience.position1.company' />
									</span>
									<a
										href={experienceWebsiteUrl}
										target='_blank'
										className='text-primary hover:underline'
									>
										{experienceWebsite}
									</a>
								</div>
								<p className='text-muted-foreground'>
									<Text text='page.resume.experience.position1.location' />
								</p>
								<p className='text-foreground/90'>
									<Text text='page.resume.experience.position1.description' />
								</p>

								<div>
									<h4 className='font-semibold text-foreground mb-3'>
										<Text text='page.resume.sections.responsibilities' />:
									</h4>
									<ul className='space-y-2 text-foreground/80 ml-6'>
										{responsibilities.map((item) => (
											<li key={item} className='list-disc'>
												{item}
											</li>
										))}
									</ul>
								</div>

								<div>
									<h4 className='font-semibold text-foreground mb-3'>
										<Text text='page.resume.sections.achievements' />:
									</h4>
									<ul className='space-y-2 text-foreground/80 ml-6'>
										{achievements.map((item) => (
											<li key={item} className='list-disc'>
												{item}
											</li>
										))}
									</ul>
								</div>
							</div>
						</div>
					</div>
				</div>

				<div className='space-y-6'>
					<h2 className='text-3xl font-bold text-foreground border-b-2 border-border pb-2'>
						<Text text='page.resume.sections.education' />
					</h2>
					<div className='bg-card p-6 rounded-lg border border-border'>
						<div className='flex flex-col md:flex-row md:items-center md:justify-between mb-4'>
							<h3 className='text-xl font-semibold text-foreground'>
								<Text text='page.resume.education.education1.degree' />
							</h3>
							<span className='bg-muted px-3 py-1 rounded-md text-sm font-medium text-muted-foreground mt-2 md:mt-0'>
								<Text text='page.resume.education.education1.date.start' /> —{' '}
								<Text text='page.resume.education.education1.date.end' />
							</span>
						</div>
						<div className='space-y-2'>
							<p className='font-medium text-foreground'>
								<Text text='page.resume.education.education1.institution' />
							</p>
							<p className='text-muted-foreground'>
								<Text text='page.resume.education.education1.location' />
							</p>
						</div>
					</div>
				</div>

				<div className='space-y-6'>
					<h2 className='text-3xl font-bold text-foreground border-b-2 border-border pb-2'>
						<Text text='page.resume.sections.projects' />
					</h2>
					<div className='bg-card p-6 rounded-lg bo rder border-border'>
						<div className='flex flex-col md:flex-row md:items-center md:justify-between mb-4'>
							<h3 className='text-xl font-semibold text-foreground'>
								<Text text='page.resume.projects.project1.title' />
							</h3>
							<span className='bg-muted px-3 py-1 rounded-md text-sm font-medium text-muted-foreground mt-2 md:mt-0'>
								<Text text='page.resume.projects.project1.date' />
							</span>
						</div>
						<div className='space-y-4'>
							<p className='font-medium text-foreground'>
								<Text text='page.resume.projects.project1.company' />
							</p>
							<a
								href={projectWebsiteUrl}
								target='_blank'
								className='text-primary hover:underline'
							>
								{projectWebsite}
							</a>
							<p className='text-foreground/90'>
								<Text text='page.resume.projects.project1.description' />
							</p>
						</div>
					</div>
				</div>

				<div className='space-y-6'>
					<h2 className='text-3xl font-bold text-foreground border-b-2 border-border pb-2'>
						<Text text='page.resume.sections.languages' />
					</h2>
					<div className='bg-card p-6 rounded-lg border border-border'>
						<div className='flex items-center justify-between'>
							<span className='font-medium text-foreground'>
								<Text text='page.resume.languages.english.name' />
							</span>
							<span className='bg-muted px-3 py-1 rounded-md text-sm font-medium text-muted-foreground'>
								<Text text='page.resume.languages.english.level' />
							</span>
						</div>
					</div>
				</div>

				<div className='space-y-6'>
					<h2 className='text-3xl font-bold text-foreground border-b-2 border-border pb-2'>
						<Text text='page.resume.sections.links.title' />
					</h2>
					<div className='bg-card p-6 rounded-lg border border-border space-y-3'>
						<div className='flex items-center gap-3'>
							<strong className='font-semibold text-foreground min-w-[100px]'>
								<Text text='page.resume.sections.links.telegram' />:
							</strong>
							<a
								href={telegram?.startsWith('http') ? telegram : `https://${telegram}`}
								className='text-primary hover:underline'
							>
								{telegram}
							</a>
						</div>
						<div className='flex items-center gap-3'>
							<strong className='font-semibold text-foreground min-w-[100px]'>
								<Text text='page.resume.sections.links.email' />:
							</strong>
							<a
								href={`mailto:${email}`}
								className='text-primary hover:underline'
							>
								{email}
							</a>
						</div>
						<div className='flex items-center gap-3'>
							<strong className='font-semibold text-foreground min-w-[100px]'>
								<Text text='page.resume.sections.links.github' />:
							</strong>
							<a
								href={github?.startsWith('http') ? github : `https://${github}`}
								className='text-primary hover:underline'
							>
								{github}
							</a>
						</div>
					</div>
				</div>

				<div className='space-y-6'>
					<h2 className='text-3xl font-bold text-foreground border-b-2 border-border pb-2'>
						<Text text='page.resume.sections.skills.title' />
					</h2>

					<div className='grid md:grid-cols-2 gap-6'>
						<div className='bg-card p-6 rounded-lg border border-border space-y-4'>
							<h3 className='text-lg font-semibold text-foreground'>
								<Text text='page.resume.sections.skills.technical' />
							</h3>
							<div className='flex flex-wrap gap-2'>
								{technicalSkills.map((skill) => (
									<span
										key={skill}
										className='bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium'
									>
										{skill}
									</span>
								))}
							</div>
						</div>

						<div className='bg-card p-6 rounded-lg border border-border space-y-4'>
							<h3 className='text-lg font-semibold text-foreground'>
								<Text text='page.resume.sections.skills.soft' />
							</h3>
							<div className='flex flex-wrap gap-2'>
								{softSkills.map((skill) => (
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

				<ResumeDownloadButtons />
			</div>
			<div className=' max-w-4xl z-[100000000000] top-[50%] w-full pr-8 flex justify-end translate-y-[-50%] fixed pointer-events-none'>
				<ArticleNav
					className='max-w-64 overflow-auto shrink-0 relative min-[1250px]:translate-x-[100%] pointer-events-auto'
					targetSelect='.rusume-content'
				/>
			</div>
		</main>
	);
}

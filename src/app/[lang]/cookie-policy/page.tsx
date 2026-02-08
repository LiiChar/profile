import { Text } from '@/components/ui/text-server';
import ArticleNavDock from '@/widgets/article/ArticleNavDock';

export const dynamic = 'force-static';

export default async function CookiePolicyPage() {
	return (
		<main className='min-h-screen px-6 py-24 cookie-policy-content'>
			<div className='mx-auto max-w-4xl cookie-policy-inner'>
				<h1 className='mb-8 text-4xl font-bold'>
					<Text text='layout.cookiePolicy.title' />
				</h1>
				<div className='prose prose-lg dark:prose-invert max-w-none space-y-6'>
					<section className='space-y-4'>
						<h2 className='text-2xl font-semibold'>
							<Text text='layout.cookiePolicy.whatAreCookies.title' />
						</h2>
						<p>
							<Text text='layout.cookiePolicy.whatAreCookies.content' />
						</p>
					</section>
					<section className='space-y-4'>
						<h2 className='text-2xl font-semibold'>
							<Text text='layout.cookiePolicy.howWeUse.title' />
						</h2>
						<p>
							<Text text='layout.cookiePolicy.howWeUse.content' />
						</p>
						<ul className='list-disc pl-6 space-y-2'>
							<li>
								<Text text='layout.cookiePolicy.howWeUse.essential' />
							</li>
							<li>
								<Text text='layout.cookiePolicy.howWeUse.preferences' />
							</li>
							<li>
								<Text text='layout.cookiePolicy.howWeUse.analytics' />
							</li>
							<li>
								<Text text='layout.cookiePolicy.howWeUse.language' />
							</li>
						</ul>
					</section>
					<section className='space-y-4'>
						<h2 className='text-2xl font-semibold'>
							<Text text='layout.cookiePolicy.thirdParty.title' />
						</h2>
						<p>
							<Text text='layout.cookiePolicy.thirdParty.content' />
						</p>
						<ul className='list-disc pl-6 space-y-2'>
							<li>
								<Text text='layout.cookiePolicy.thirdParty.analytics' />
							</li>
							<li>
								<Text text='layout.cookiePolicy.thirdParty.social' />
							</li>
						</ul>
					</section>
					<section className='space-y-4'>
						<h2 className='text-2xl font-semibold'>
							<Text text='layout.cookiePolicy.yourRights.title' />
						</h2>
						<p>
							<Text text='layout.cookiePolicy.yourRights.content' />
						</p>
					</section>
					<section className='space-y-4'>
						<h2 className='text-2xl font-semibold'>
							<Text text='layout.cookiePolicy.manageCookies.title' />
						</h2>
						<p>
							<Text text='layout.cookiePolicy.manageCookies.content' />
						</p>
					</section>
					<section className='space-y-4'>
						<h2 className='text-2xl font-semibold'>
							<Text text='layout.cookiePolicy.changes.title' />
						</h2>
						<p>
							<Text text='layout.cookiePolicy.changes.content' />
						</p>
					</section>
				</div>
			</div>
			<ArticleNavDock
				className='relative'
				alignSelect='.cookie-policy-inner'
				targetSelect='.cookie-policy-content'
			/>
		</main>
	);
}

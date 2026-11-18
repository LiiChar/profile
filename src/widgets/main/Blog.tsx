import { BlogCard } from '@/components/blog/BlogCard';
import { Text } from '@/components/ui/text-client';
import { db } from '@/db/db';
import { Lang } from '@/types/i18n';

export const Blog = async ({ lang }: { lang: Lang }) => {
	const blogs = await db.query.blogs.findMany({});

	return (
		<section
			id="blog"
			className="site-section contain-layout"
		>
			<div className="site-container">
				{/* Header */}
				<header className="mb-12 md:mb-16">
					<p className="site-eyebrow mb-4">
            <Text text="page.main.blog.eyebrow" />
            <span className="
                h-px w-8 bg-[var(--site-border)]
            " />

            <span>05 / 05</span>
					</p>

					<div className="
						flex flex-col gap-5
						sm:flex-row sm:items-end
						sm:justify-between
					">
						<div>
							<h2 className="site-section-title">
								<Text text="page.main.blog.title" />
							</h2>

							<p className="site-section-description">
								<Text text="page.main.blog.subtitle" />
							</p>
						</div>

						<div className="
							flex shrink-0 items-center gap-3 pb-1
							font-mono text-xs
							tracking-wider
							text-[var(--site-subtle)]
						">
							<span className="
								h-1.5 w-1.5 rounded-full
								bg-[var(--site-accent)]
							" />

							<span>
								{String(blogs.length).padStart(2, '0')} ARTICLES
							</span>
						</div>
					</div>
				</header>

				{/* Blog posts */}
				{blogs.length > 0 ? (
					<div className="
						grid grid-cols-1 gap-5
						sm:grid-cols-2
						lg:grid-cols-3
						md:gap-6
					">
						{blogs.map((blog, index) => (
							<article
								key={blog.id}
								className="
									group relative min-w-0
									overflow-hidden rounded-xl
									border border-[var(--site-border)]
									bg-white/[0.015]
									transition-all duration-300
									hover:-translate-y-1
									hover:border-[var(--site-accent)]/35
									hover:bg-white/[0.025]
								"
							>
								{/* Accent */}
								<div
									aria-hidden="true"
									className="
										absolute left-0 top-0 z-10
										h-12 w-px
										bg-[var(--site-accent)]
										opacity-40
										transition-all duration-300
										group-hover:h-20
										group-hover:opacity-100
									"
								/>

								{/* Card header */}
								<div className="
									flex items-center justify-between
									gap-4 px-5 pt-5
									sm:px-6 sm:pt-6
								">
									<div className="flex items-center gap-3">
										<span className="
											font-mono text-xs
											tabular-nums tracking-widest
											text-[var(--site-accent)]
										">
											{String(index + 1).padStart(2, '0')}
										</span>

										<span className="
											h-px w-7
											bg-[var(--site-border)]
										" />

										<span className="
											font-mono text-[10px]
											uppercase tracking-[0.16em]
											text-[var(--site-subtle)]
										">
											Article
										</span>
									</div>
								</div>

								{/* Blog card */}
								<div className="min-w-0 p-3 sm:p-4">
									<BlogCard
										className="
											w-full min-w-0
											transition-transform duration-300
											group-hover:-translate-y-0.5
										"
										blog={blog}
										lang={lang}
									/>
								</div>

								{/* Bottom decoration */}
								<div className="
									mx-5 h-px
									bg-gradient-to-r
									from-[var(--site-accent)]/30
									via-[var(--site-border)]
									to-transparent
									opacity-50
									sm:mx-6
								" />
							</article>
						))}
					</div>
				) : (
					<div className="
						rounded-xl border
						border-[var(--site-border)]
						bg-white/[0.015]
						px-6 py-16 text-center
					">
						<p className="text-sm text-[var(--site-muted)]">
							<Text text="page.main.blog.empty" />
						</p>
					</div>
				)}
			</div>
		</section>
	);
};

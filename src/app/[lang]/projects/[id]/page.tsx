import { db } from '@/db/db';
import { eq } from 'drizzle-orm';
import { projects } from '@/db/schema';
import Image from "next/image";

export default async function ProjectPage({
                                              params,
                                          }: {
    params: Promise<{ id: number }>;
}) {
    const { id } = await params;

    const project = await db.query.projects.findFirst({
        where: () => eq(projects.id, id),
        with: {
            user: true,
        },
    });

    if (!project) {
        return <div className="text-center text-red-500 mt-10">Project not found</div>;
    }

    const {
        title,
        image,
        description,
        content,
        repoName,
        createdAt,
        tags,
        author,
    } = project;

    return (
        <main className="max-w-4xl mx-auto px-4 py-8">
            <div className="mb-6">
                <h1 className="text-4xl font-bold text-gray-800 mb-2">{title}</h1>
                <p className="text-sm text-gray-500">
                    Автор: {author} • {new Date(createdAt).toLocaleDateString()}
                </p>
            </div>

            {image && (
                <div className="mb-6">
                    <Image
                        fill={true}
                        src={image}
                        alt={title}
                        className="w-full max-h-[400px] object-cover rounded-lg shadow"
                    />
                </div>
            )}

            {description && (
                <p className="text-lg text-gray-700 leading-relaxed mb-8">
                    {description}
                </p>
            )}

            {repoName && (
                <div className="mb-8">
                    <a
                        href={`https://github.com/${repoName}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition"
                    >
                        Посмотреть на GitHub →
                    </a>
                </div>
            )}

            <section className="prose max-w-none dark:prose-invert">
                <article dangerouslySetInnerHTML={{ __html: content }} />
            </section>

            {/* Опционально: если есть репозиторий — показываем таймлайн */}
            {/*repoName && (
                <div className="mt-12">
                    <h2 className="text-2xl font-semibold mb-4">История коммитов</h2>
                    <CommitTimeline repo={repoName} />
                </div>
            )*/}

            {/* Теги */}
            {tags && (
                <div className="mt-10 flex flex-wrap gap-2">
                    {tags.split(',').map((tag) => (
                        <span
                            key={tag}
                            className="text-sm bg-blue-100 text-blue-700 px-3 py-1 rounded-full"
                        >
              #{tag.trim()}
            </span>
                    ))}
                </div>
            )}
        </main>
    );
}

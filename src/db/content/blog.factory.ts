import { db } from '.';
import { blogs, BlogType } from '../tables/blog';

type BlogFactoryInsert = Pick<
	BlogType,
	'content' | 'tags' | 'title' | 'userId'
>;

export const blogFactory = async (content: BlogFactoryInsert[]) => {
	await db.insert(blogs).values(content);
};

export const blogFactoryReset = async () => {
	await db.delete(blogs).execute();
};

export const runBlogFactory = async () => {
	console.log('Начало миграции BlogFactory');
	await blogFactory(blogContent);
	console.log(' - Конец миграции BlogFactory', '\n');
};

const blogContent: BlogFactoryInsert[] = [
	{
		title: 'Как я оптимизировал рендер в React',
		content:
			'В этой статье я расскажу, как мне удалось сократить время рендера компонента в 3 раза с помощью useMemo и React.memo...',
		tags: ['react', 'оптимизация', 'performance'].join(','),
		userId: 1,
	},
	{
		title: 'Next.js 15: что нового?',
		content:
			'Недавно вышел Next.js 15, и в нём появилось множество нововведений: Turbopack по умолчанию, улучшенный app router и многое другое...',
		tags: ['nextjs', 'новости', 'релиз'].join(','),
		userId: 1,
	},
	{
		title: 'Как настроить CI/CD для React-проекта',
		content:
			'Я поделюсь опытом настройки GitHub Actions для автоматической сборки и деплоя React-приложения на Vercel и Netlify...',
		tags: ['ci/cd', 'github actions', 'devops'].join(','),
		userId: 1,
	},
	{
		title: 'Почему Zustand — это лучше, чем Redux',
		content:
			'В статье сравниваю подходы Zustand и Redux, и объясняю, почему я полностью перешёл на Zustand в своих проектах...',
		tags: ['zustand', 'redux', 'состояние'].join(','),
		userId: 1,
	},
	{
		title: 'Что такое серверные компоненты в React и как они работают',
		content:
			'Server Components — это новый подход к архитектуре React-приложений. В статье рассматриваю плюсы, минусы и кейсы использования...',
		tags: ['react', 'server components', 'nextjs'].join(','),
		userId: 1,
	},
	{
		title: 'Реализация drag’n’drop на @dnd-kit: пошагово',
		content:
			'В статье подробно объясняю, как с нуля собрать drag’n’drop интерфейс с помощью библиотеки @dnd-kit...',
		tags: ['drag and drop', 'frontend', 'dnd-kit'].join(','),
		userId: 1,
	},
	{
		title: 'Пишем собственный markdown-редактор на React',
		content:
			'В этом посте покажу, как я реализовал markdown-редактор с live-preview, поддержкой смайликов и кастомных блоков...',
		tags: ['markdown', 'react', 'редактор'].join(','),
		userId: 1,
	},
	{
		title: 'Как сделать отзывчивый UI без Tailwind: мой подход',
		content:
			'Я решил отказаться от Tailwind в одном из проектов и собрать UI на чистом CSS + classnames. Делюсь своими выводами...',
		tags: ['css', 'ui', 'tailwind'].join(','),
		userId: 1,
	},
	{
		title: 'Пишем визуальный DSL редактор: шаг за шагом',
		content:
			'DSL — это мощный инструмент. В статье покажу, как построить визуальный блоковый редактор с поддержкой if/loop/exec...',
		tags: ['dsl', 'editor', 'typescript'].join(','),
		userId: 1,
	},
	{
		title: 'Интеграция WebSocket с React: как не сойти с ума',
		content:
			'В этом гайде расскажу, как организовать стабильную работу с WebSocket соединением в React, не создавая тысячу багов...',
		tags: ['websocket', 'react', 'реальное время'].join(','),
		userId: 1,
	},
];

import { dbFactory } from '.';
import { projects, ProjectType } from '@/db/tables/project';

type ProjectFactoryInsert = Pick<
	ProjectType,
	'content' | 'tags' | 'title' | 'userId'
> & Partial<Pick<ProjectType, 'description' | 'lang' | 'repoName' | 'url'>>;

export const projectFactory = async (content: ProjectFactoryInsert[]) => {
	await dbFactory.insert(projects).values(content);
};

export const projectFactoryReset = async () => {
	await dbFactory.delete(projects).execute();
};

export const runProjectFactory = async () => {
	console.log('Начало миграции ProjectFactory');
	await projectFactory(projectContent);
	console.log(' - Конец миграции ProjectFactory', '\n');
};

const projectContent: ProjectFactoryInsert[] = [
	{
		title: 'Itihas — интерактивные истории и временные шкалы',
		repoName: 'itihas',
		description: 'Проект для создания и изучения историй, связанных с последовательностью событий и временной шкалой.',
		content: `# Itihas — истории, связанные со временем

Itihas — проект на стыке исторического материала и интерактивного повествования. Его идея — представить события в хронологическом контексте и помочь читателю увидеть, как отдельные эпизоды складываются в более широкую историю.

## Задача проекта

Обычный текст не всегда помогает быстро сопоставить даты и события. Временная шкала делает хронологию нагляднее, а формат истории позволяет связать факты в последовательное повествование. Проект исследует, как объединить эти способы представления информации в одном интерфейсе.

## Технологии

- React, TypeScript и Vite
- Tailwind CSS и Zustand
- Visx для визуализации данных
- Tiptap для редактирования содержимого
- Drizzle ORM и SQLite

## Ссылки

- [Репозиторий на GitHub](https://github.com/LiiChar/itihas)
- [Демо](https://itihas.vercel.app/)

Проект объединяет повествовательный формат и наглядное представление хронологии.`,
		tags: 'react,typescript,tailwind,zustand,visx,drizzle,tiptap,history,education',
		userId: 1,
		url: 'https://itihas.vercel.app/',
		lang: {
			en: {
				title: 'Itihas — interactive stories and timelines',
				description: 'A project for creating and exploring historical stories through connected events and timelines.',
				tags: 'react,typescript,tailwind,zustand,visx,drizzle,tiptap,history,education',
				content: `# Itihas — stories connected to time

Itihas explores the intersection of historical material and interactive storytelling. Its goal is to place events in chronological context and help readers see how individual episodes form a broader story.

## The project idea

Plain text does not always make it easy to compare dates and events. A timeline can make chronology easier to scan, while a narrative can connect facts into a coherent sequence. The project explores how these approaches can work together in one interface.

## Technologies

- React, TypeScript, and Vite
- Tailwind CSS and Zustand
- Visx for data visualization
- Tiptap for content editing
- Drizzle ORM and SQLite

## Links

- [GitHub repository](https://github.com/LiiChar/itihas)
- [Demo](https://itihas.vercel.app/)

The project combines narrative content with a visual presentation of chronology.`,
			},
		},
	},
	{
		title: 'Profile — личный сайт-портфолио',
		repoName: 'profile',
		description: 'Личный сайт с резюме, портфолио проектов и техническим блогом.',
		content: `# Profile — личный сайт и портфолио

Profile объединяет резюме, список проектов и блог в одном сайте. Проект также служит площадкой для практики с Next.js и современным React-стеком.

## Что входит в проект

- Главная страница и отдельные страницы проектов и статей
- Русская и английская версии интерфейса
- Резюме с контактной информацией и опытом работы
- Авторизация и формы для управления публикациями
- Адаптивная вёрстка, темы оформления и декоративный WebGL-фон

## Технологии

Next.js App Router, React, TypeScript, Tailwind CSS, Drizzle ORM и SQLite. Для интерфейса используются Zustand, Framer Motion и компоненты на базе Radix UI; WebGL-фон построен с Three.js и React Three Fiber.

## Ссылки

- [Репозиторий на GitHub](https://github.com/LiiChar/profile)
- [Сайт](https://ivanov-maksim.vercel.app)

В проекте продолжают меняться интерфейс, контент и техническая реализация.`,
		tags: 'nextjs,react,typescript,tailwind,portfolio,blog,webgl',
		userId: 1,
		url: 'https://ivanov-maksim.vercel.app',
		lang: {
			en: {
				title: 'Profile — personal portfolio website',
				description: 'A personal website featuring a resume, project portfolio, and technical blog.',
				tags: 'nextjs,react,typescript,tailwind,portfolio,blog,webgl',
				content: `# Profile — personal website and portfolio

Profile brings a resume, project list, and blog together in one website. It is also a place to work with Next.js and the modern React ecosystem.

## What the project includes

- A home page and separate project and article pages
- Russian and English interface versions
- A resume with contact details and work experience
- Authentication and forms for managing publications
- Responsive layouts, themes, and a decorative WebGL background

## Technologies

Next.js App Router, React, TypeScript, Tailwind CSS, Drizzle ORM, and SQLite. The interface uses Zustand, Framer Motion, and Radix UI-based components; the WebGL background uses Three.js and React Three Fiber.

## Links

- [GitHub repository](https://github.com/LiiChar/profile)
- [Website](https://ivanov-maksim.vercel.app)

The interface, content, and technical implementation continue to evolve.`,
			},
		},
	},
	{
		title: 'Musa — музыкальный плеер для локальной библиотеки',
		repoName: 'musa',
		description: 'Концепция настольного приложения для воспроизведения и организации локальной музыкальной коллекции.',
		content: `# Musa — музыкальный плеер для локальной коллекции

Musa — проект настольного приложения для работы с музыкой, хранящейся на устройстве. Основной сценарий — собрать локальные аудиофайлы в библиотеку, просматривать и воспроизводить их, а также управлять плейлистами.

## Направление проекта

Вместо привязки к одному каталогу потокового сервиса приложение строится вокруг файлов пользователя. Важные части такого интерфейса — организация библиотеки, отображение информации о композициях и быстрый доступ к управлению воспроизведением.

## Технологии

Проект использует Tauri 2, Rust, Vue 3, TypeScript и Pinia. Для работы со звуком и метаданными применяются Web Audio API и библиотеки для чтения тегов.

## Ссылка

- [Репозиторий на GitHub](https://github.com/LiiChar/musa)

Описание не фиксирует показатели производительности или полный список реализованных функций; они требуют отдельной проверки по текущему состоянию приложения.`,
		tags: 'tauri,vue,typescript,music,offline,player',
		userId: 1,
		lang: {
			en: {
				title: 'Musa — a music player for a local library',
				description: 'A desktop app concept for playing and organizing a local music collection.',
				tags: 'tauri,vue,typescript,music,offline,player',
				content: `# Musa — a player for a local music collection

Musa is a desktop application project for working with music stored on a device. Its core use case is to organize local audio files into a library, browse and play them, and manage playlists.

## Project direction

Rather than depending on one streaming catalog, the application is built around the user's files. Key parts of this kind of interface include organizing the library, displaying track information, and providing convenient playback controls.

## Planned stack

The project uses Tauri 2, Rust, Vue 3, TypeScript, and Pinia. Audio and metadata handling use the Web Audio API and tag-reading libraries.

## Link

- [GitHub repository](https://github.com/LiiChar/musa)

The project focuses on making a local music library easier to manage.`,
			},
		},
	},
	{
		title: 'Filu — настольный загрузчик и плеер видео',
		repoName: 'filu',
		description: 'Проект настольного приложения для загрузки и просмотра видео с использованием yt-dlp.',
		content: `# Filu — загрузка и просмотр видео в настольном приложении

Filu — проект графического приложения, которое объединяет пользовательский интерфейс для работы с видео и инструменты загрузки на базе yt-dlp. Идея — упростить выбор источника, параметров загрузки и дальнейшую работу с сохранёнными файлами.

## Техническое направление

В описании проекта указаны Tauri и Rust для настольной оболочки, SvelteKit и TypeScript для интерфейса, а также yt-dlp как инструмент загрузки. Состав поддерживаемых сайтов определяется самим yt-dlp и может меняться.

## На что обращено внимание

- Понятный интерфейс для добавления задачи загрузки
- Отображение состояния выполняемых задач
- Работа с сохранёнными видеофайлами

## Ссылка

- [Репозиторий на GitHub](https://github.com/LiiChar/filu)

Проект связывает настольный интерфейс с инструментами yt-dlp для работы с видеоматериалами.`,
		tags: 'tauri,svelte,typescript,ytdlp,video,downloader',
		userId: 1,
		lang: {
			en: {
				title: 'Filu — desktop video downloader and player',
				description: 'A desktop application project for downloading and viewing video with yt-dlp.',
				tags: 'tauri,svelte,typescript,ytdlp,video,downloader',
				content: `# Filu — downloading and viewing video in a desktop app

Filu is a graphical application project that combines a video interface with download tools based on yt-dlp. The idea is to make it easier to choose a source and download options, then work with the saved files.

## Technical direction

The project description lists Tauri and Rust for the desktop shell, SvelteKit and TypeScript for the interface, and yt-dlp as the download tool. Supported sites depend on yt-dlp itself and may change over time.

## Areas of focus

- A clear interface for adding download tasks
- Showing the status of running tasks
- Working with saved video files

## Link

- [GitHub repository](https://github.com/LiiChar/filu)

The project connects a desktop interface with yt-dlp tools for working with video.`,
			},
		},
	},
	{
		title: 'Book-styde — интерактивное изучение JavaScript',
		repoName: 'book-styde',
		description: 'Образовательный проект с интерактивными заданиями и редактором кода.',
		content: `# Book-styde — интерактивное изучение JavaScript

Book-styde — проект образовательной платформы, в которой изучение JavaScript строится вокруг коротких объяснений и практических заданий. Встроенный редактор помогает писать код рядом с материалом, а проверка задания даёт обратную связь по решению.

## Учебный сценарий

Пользователь читает тему, пробует применить её в редакторе и получает результат проверки. Такой формат может поддержать последовательное изучение языка — от базовых конструкций к более сложным — без переключения между учебником и отдельной средой разработки.

## Технологии

Для интерфейса и редактора используются React, TypeScript, Vite, Monaco Editor и Redux Toolkit.

## Ссылки

- [Репозиторий на GitHub](https://github.com/LiiChar/book-styde)
- [Демо](https://book-styde.vercel.app/)

Проект задуман как открытая основа для интерактивных учебных материалов по JavaScript.`,
		tags: 'react,typescript,monaco,education,javascript,interactive,tailwind',
		userId: 1,
		url: 'https://book-styde.vercel.app/',
		lang: {
			en: {
				title: 'Book-styde — interactive JavaScript learning',
				description: 'An educational project with interactive exercises and a code editor.',
				tags: 'react,typescript,monaco,education,javascript,interactive,tailwind',
				content: `# Book-styde — interactive JavaScript learning

Book-styde is an educational platform project built around short explanations and hands-on JavaScript exercises. An integrated editor lets learners write code alongside the material, while exercise checks provide feedback on their solutions.

## Learning flow

The learner reads a topic, tries it in the editor, and receives a check result. This format can support a gradual path from basic language constructs to more advanced topics without switching between a textbook and a separate development environment.

## Technologies

The interface and editor use React, TypeScript, Vite, Monaco Editor, and Redux Toolkit.

## Links

- [GitHub repository](https://github.com/LiiChar/book-styde)
- [Demo](https://book-styde.vercel.app/)

The project is intended as an open foundation for interactive JavaScript learning materials.`,
			},
		},
	},
];

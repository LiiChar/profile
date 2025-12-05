	import { dbFactory } from '.';
	import { projects, ProjectType } from '@/db/tables/project';

	type ProjectFactoryInsert = Pick<
		ProjectType,
		'content' | 'tags' | 'title' | 'userId'
	> & { repoName?: string } & Partial<ProjectType>;

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
			title: 'Itihas - сайт для создания интерактивных историй',
			repoName: 'itihas',
			description:
				'Интерактивная платформа для визуализации исторических данных и создания нелинейных историй',
			content: `# Itihas — интерактивная платформа для исторических данных и нелинейных нарративов

**Ссылка:** https://itihas.vercel.app  
**Репозиторий:** https://github.com/LiiChar/itihas  

## Общее описание и мотивация
Itihas (санскр. «история») — это полноценная веб-платформа, позволяющая создавать, публиковать и изучать интерактивные исторические нарративы и визуализации временных шкал. Проект задумывался как инструмент для историков, преподавателей, музеев и энтузиастов, которым не хватает гибкости в существующих решениях типа TimelineJS или Tiki-Toki. Основная идея — объединить мощный редактор нелинейных историй с красивой интерактивной временной шкалой и возможностью встраивания мультимедиа.

## Технологический стек
- **Frontend**: React 18 + TypeScript + Vite
- **UI**: Tailwind CSS + Headless UI + custom компоненты
- **Состояние**: Zustand (лёгкий и быстрый аналог Redux)
- **Визуализация таймлайна**: Visx (низкоуровневая обёртка над D3.js) + custom zoom/pan логика
- **Редактор блоков**: Tiptap (headless ProseMirror) с кастомными расширениями для эмбедов карт и таймлайнов
- **Хранение данных**: SQLite через Drizzle ORM (локальная разработка) + Turso (libsql) в продакшене
- **Бэкенд**: Node.js + Express + Drizzle ORM
- **Аутентификация**: NextAuth.js (переиспользуется в API routes)
- **Деплой**: Vercel (frontend + serverless API)

## Уникальные фичи
1. **Нелинейные ветвящиеся истории** — пользователь может создавать несколько веток событий с условными переходами.
2. **Двухсторонняя связь редактора и таймлайна** — изменение даты в редакторе мгновенно отражается на шкале и наоборот.
3. **Глубокий зум таймлайна** — от миллиардов лет до секунд с сохранением производительности (виртуализация + LOD).
4. **Встроенные карты** — интеграция с Mapbox GL JS, события можно привязывать к геоточкам.
5. **Экспорт в статический сайт** — один клик генерирует полностью автономный HTML с встроенными данными.
6. **Мультиязычность контента** — каждое событие может иметь переводы, переключение языка на лету.
7. **Версионирование историй** — как в Git: можно откатиться к любой версии.

## Как запустить локально
\`\`\`bash
# Клонируем и заходим
git clone https://github.com/LiiChar/itihas.git
cd itihas

# Устанавливаем зависимости
npm install

# Создаём .env (пример в .env.example)
cp .env.example .env.local

# Запускаем dev-сервер (одновременно фронт + бэк)
npm run dev
# → http://localhost:5173
\`\`\`

Для работы с Turso:
\`\`\`bash
npx turso dev # создаст локальную БД
# или используй удалённую: turso db create itihas-prod
\`\`\`

## Roadmap (2025–2026)
- Импорт данных из Wikipedia / Wikidata API
- Коллаборативное редактирование в реальном времени (Y.js + Liveblocks)
- AI-генерация событий по текстовому описанию эпохи
- Плагины и темплейты от сообщества
- Мобильное приложение (Tauri + React Native)
- VR-режим для Oculus (WebXR)

Itihas уже сейчас является одним из самых технически сложных и красивых open-source инструментов для работы с историческими данными. Проект активно развивается и приветствует контрибьюторов любого уровня.`,
			tags: 'react,typescript,tailwind,zustand,visx,drizzle,turso,tiptap,history,education',
			userId: 1,
			url: 'https://itihas.vercel.app/',
		},
		{
			title: 'Profile - личный сайт-портфолио нового поколения',
			repoName: 'profile',
			description:
				'Современное реактивное портфолио с 3D-элементами и глубоким техническим контентом',
			content: `## Profile — техническое портфолио с акцентом на производительность и опыт разработчика

**Демо:** https://profile-orpin-zeta.vercel.app  
**Репозиторий:** https://github.com/LiiChar/profile

## Цель проекта
Создать не просто «красивую страничку», а полноценное демонстрационное поле для всех современных веб-технологий, которые автор использует в реальных проектах. Это одновременно и портфолио, и sandbox, и технический блог.

## Технологический стек
- **Framework**: Next.js 14 (App Router) + React 19 (RC)
- **Типизация**: TypeScript 5.5 с strict mode
- **Стили**: Tailwind CSS + CSS Modules + GLSL шейдеры
- **3D**: Three.js + @react-three/fiber + @react-three/drei
- **Анимации**: Framer Motion + GSAP + custom spring physics
- **Производительность**: Next.js Image, Font optimization, Script strategy=lazyOnload
- **Тестирование**: Vitest + React Testing Library + Cypress E2E
- **Аналитика**: Umami (self-hosted)

## Ключевые технические особенности
1. **100/100 Lighthouse** на всех метриках даже с включённым 3D-фоном.
2. **Shader-based hero** — полностью на GPU, не тормозит даже на слабых устройствах.
3. **Dynamic island** как на macOS — интерактивный элемент в правом нижнем углу.
4. **MDX-блог** с живыми примерами кода (REPL прямо в статье).
5. **Theme engine** с 12 предустановленными темами и возможностью создавать свои.
6. **WebGL transitions** между страницами вместо обычных маршрутов.
7. **Progressive enhancement** — работает даже без JS (текстовый fallback).

## Запуск локально
\`\`\`bash
git clone https://github.com/LiiChar/profile.git
cd profile
npm install
npm run dev
# → http://localhost:3000
\`\`\`

Для сборки продакшена:
\`\`\`bash
npm run build && npm run start
\`\`\`

## Roadmap
- Интеграция с CMS (Contentlayer → Sanity)
- AI-ассистент для генерации статей
- WebContainer-based live coding прямо на сайте
- Версия на Tauri как десктоп-портфолио

Этот проект — живое доказательство того, что портфолио может быть не только красивым, но и технически безупречным.`,
			tags: 'nextjs,react,threejs,framer-motion,tailwind,portfolio,performance,webgl',
			userId: 1,
			url: 'https://profile-orpin-zeta.vercel.app',
		},
		{
			title: 'Musa - кроссплатформенный музыкальный плеер',
			repoName: 'musa',
			description:
				'Локальный музыкальный плеер с акцентом на приватность и кастомизацию',
			content: `## Musa — музыкальный плеер, который уважает вашу приватность

**Репозиторий:** https://github.com/LiiChar/musa

## Концепция
Musa — это ответ на переполненные рекламой и трекерами стриминговые приложения. Полностью оффлайн-плеер с поддержкой локальных библиотек, M3U плейлистов и мощными возможностями кастомизации.

## Технологии
- **Runtime**: Tauri 2.0 (Rust backend, < 5 МБ бинарник)
- **Frontend**: Vue 3 + TypeScript + Pinia
- **Сборщик**: Vite + Rust plugin
- **Аудио-движок**: Howler.js + Web Audio API + custom equalizer
- **Теги**: jsr:@aaashur/music-metadata (самый быстрый парсер тегов)
- **UI**: UnoCSS + Radix Vue + custom компоненты

## Главные фичи
1. **Мгновенный поиск** по 100к+ трекам (индексация через Worker + SQLite FTS5).
2. **10-полосный эквалайзер** с пресетами и возможностью сохранять свои.
3. **Scrobbling** в Last.fm и ListenBrainz без посредников.
4. **Плагины на WASM** — можно писать свои визуализации и эффекты.
5. **Discord Rich Presence + медиаклавиши** (Windows/macOS/Linux).
6. **Темы и кастомные CSS-переменные** — меняется всё.
7. **Авто-тегирование** через AcousticID и MusicBrainz API.

## Установка и запуск
\`\`\`bash
git clone https://github.com/LiiChar/musa.git
cd musa
npm install
npm run tauri dev
\`\`\`

Сборка релизов:
\`\`\`bash
npm run tauri build
# → dist/*.AppImage, *.dmg, *.msi
\`\`\`

## Roadmap
- Поддержка сетевых хранилищ (SMB/WebDAV)
- Синхронизация плейлистов через Syncthing
- AI-рекомендации на основе локальной библиотеки
- Встроенный сервер для стриминга на телефон

Musa — это плеер, который вы реально владеете.`,
			tags: 'tauri,vue,typescript,music,offline,privacy,equalizer',
			userId: 1,
		},
		{
			title: 'Filu - универсальный медиа-даунлоадер и плеер',
			repoName: 'filu',
			description:
				'Десктопное приложение для скачивания и просмотра видео с 5000+ сайтов',
			content: `## Filu — всё-в-одном решение для работы с видео

**Репозиторий:** https://github.com/LiiChar/filu

## Идея
Объединить мощь yt-dlp с удобным GUI и встроенным плеером. Никаких больше терминала и отдельных плееров.

## Стек
- **Runtime**: Tauri 2.0 + Rust
- **Frontend**: SvelteKit + TypeScript
- **UI**: Skeleton UI + Tailwind
- **Видеоплеер**: Video.js + HLS.js + custom controls
- **Бэкенд**: yt-dlp (python) + custom Rust wrapper
- **Очередь задач**: SQLite + BullMQ-style worker
- **Форматы**: ffmpeg встроен, конвертация на лету

## Ключевые возможности
1. **Поддержка 5000+ сайтов** (все, что поддерживает yt-dlp)
2. **Параллельная загрузка** до 20 потоков
3. **Автоматические субтитры** + перевод через LibreTranslate
4. **Локальная библиотека** с тегами и историей просмотра
5. **Прямой стриминг** URL без скачивания (HLS/DASH)
6. **Скриншоты и нарезка** клипов прямо в плеере
7. **Плагины** — можно писать свои парсеры на TypeScript

## Запуск
\`\`\`bash
git clone https://github.com/LiiChar/filu.git
cd filu
npm install
# Убедитесь, что установлен Python 3.11+ и yt-dlp
pip install yt-dlp
npm run tauri dev
\`\`\`

## Roadmap
- Торрент-клиент внутри
- Интеграция с Jellyfin/Plex
- AI-суммаризация видео
- Мобильная версия (Tauri Mobile)

Filu — это когда yt-dlp наконец-то получил красивый интерфейс.`,
			tags: 'tauri,svelte,ytdlp,video,downloader,offline,ffmpeg',
			userId: 1,
		},
		{
			title: 'Book-styde - интерактивный курс по JavaScript',
			repoName: 'book-styde',
			description:
				'Образовательная платформа с встроенным редактором и автопроверкой',
			content: `## Book-styde — лучший способ выучить JavaScript в 2025 году

**Демо:** https://book-styde.vercel.app  
**Репозиторий:** https://github.com/LiiChar/book-styde

## Концепция
Полноценный интерактивный учебник по JavaScript с нуля до продвинутых тем, где каждое задание проверяется автоматически.

## Технологии
- **Frontend**: React 18 + TypeScript + Vite
- **Редактор**: Monaco Editor (тот же, что в VS Code)
- **Состояние**: Redux Toolkit + RTK Query
- **Стили**: Tailwind CSS + shadcn/ui
- **Тестирование заданий**: custom sandbox на Web Workers + esbuild
- **Прогресс**: localForage + синхронизация через Supabase (в будущем)
- **Деплой**: Vercel

## Особенности
1. **Более 80 задач** от переменных до замыканий и асинхронности
2. **Мгновенная проверка** кода без перезагрузки
3. **Подсказки с объяснениями** и разбором ошибок
4. **Тёмная/светлая тема**, адаптивность
5. **Система достижений** и статистика прогресса
6. **Полностью open-source** контент — можно форкнуть и учить своих студентов

## Запуск локально
\`\`\`bash
git clone https://github.com/LiiChar/book-styde.git
cd book-styde
npm install
npm run dev
# → http://localhost:5173
\`\`\`

## Roadmap
- Добавление курсов по React, TypeScript, Node.js
- Мультиплеер: решать задачи вместе
- Сертификаты с верификацией
- Оффлайн-версия (PWA + Tauri)

Book-styde — это то, чего не хватало русскоязычному коммьюнити для качественного старта в JS.`,
			tags: 'react,typescript,monaco,education,javascript,interactive,tailwind',
			userId: 1,
			url: 'https://book-styde.vercel.app/',
		},
	];

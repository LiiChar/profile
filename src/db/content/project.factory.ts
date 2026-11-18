import { dbFactory } from '.';
import { projects, ProjectType } from '@/db/tables/project';

type ProjectFactoryInsert = Pick<
	ProjectType,
	'content' | 'tags' | 'title' | 'userId'
> & Partial<Pick<ProjectType, 'description' | 'lang' | 'repoName' | 'url' | 'gallery' | 'image'>>;

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


const createProject = (
  project: Omit<ProjectFactoryInsert, 'lang'>,
  en: NonNullable<ProjectFactoryInsert['lang']>['en'],
): ProjectFactoryInsert => ({
  ...project,
  lang: { en },
});

const projectContent: ProjectFactoryInsert[] = [
  // 1. Langi
  createProject(
    {
      title: 'Langi — платформа для изучения языков через чтение',
      repoName: "langi",
      image: "/media/porftolio/langi/1.png",
      gallery: "/media/porftolio/langi/1.png|/media/porftolio/langi/2.png|/media/porftolio/langi/3.png|/media/porftolio/langi/4.png",
      description:
        'Настольное приложение для чтения книг на иностранных языках с переводом, словарём и встроенной системой изучения лексики.',
      content: `# Langi — изучение языков через чтение

Langi — настольное приложение, объединяющее чтение книг и изучение иностранных языков. Вместо отдельных упражнений пользователь изучает новую лексику непосредственно в процессе чтения.

## Возможности

- Чтение электронных книг в форматах EPUB, FB2, TXT, PDF и других
- Перевод отдельных слов и текстовых фрагментов
- Интеграция словаря и сохранение изучаемой лексики
- Закладки, заметки и выделение фрагментов текста
- Система отслеживания прогресса и знакомства со словами
- Интеграция обучения в процесс чтения
- Поддержка локальных инструментов перевода и синтеза речи находится в разработке

## Архитектура

Приложение построено на Tauri 2. Интерфейс реализован на React и TypeScript, а системная логика и работа с данными — на Rust.

Для хранения информации используется SQLite. Архитектура разделяет работу с книгами, переводом, словарями и системой обучения на отдельные сервисы.

## Технологии

- React, TypeScript
- Tauri 2, Rust
- SQLite
- TanStack Router
- Zustand
- Piper TTS и локальные ML-модели — направление разработки

Langi — самостоятельный проект, в котором сочетаются разработка интерфейсов, системная логика на Rust и работа с локальными данными.`,
      tags:
        'react,typescript,tauri,rust',
      userId: 1,
    },
    {
      title: 'Langi — language learning through reading',
      description:
        'A desktop application for reading foreign-language books with translation, a dictionary, and an integrated vocabulary learning system.',
      tags:
        'react,typescript,tauri,rust',
      content: `# Langi — language learning through reading

Langi is a desktop application that combines reading books with foreign language learning. Instead of relying exclusively on separate exercises, users learn vocabulary directly while reading.

## Features

- Reading ebooks in EPUB, FB2, TXT, PDF, and other formats
- Translating individual words and text fragments
- Dictionary integration and vocabulary collection
- Bookmarks, notes, and text highlighting
- Vocabulary progress and familiarity tracking
- Learning activities integrated into the reading experience
- Local translation and text-to-speech integrations are under development

## Architecture

The application is built with Tauri 2. Its interface uses React and TypeScript, while system-level functionality and data processing are implemented in Rust.

SQLite is used for persistent storage. The architecture separates book management, translation, dictionaries, and the learning engine into dedicated services.

## Technologies

- React, TypeScript
- Tauri 2, Rust
- SQLite
- TanStack Router
- Zustand
- Piper TTS and local ML models — development direction

Langi combines frontend engineering, Rust-based system development, and local-first data management.`,
    },
  ),

  // 2. Spec
  createProject(
    {
      title: 'Spec — трекер активности и продуктивности',
      repoName: "Spec",
      image: "/media/porftolio/spec/1.png",
      gallery: "/media/porftolio/spec/1.png|/media/porftolio/spec/2.png|/media/porftolio/spec/3.png|/media/porftolio/spec/4.png",
      description:
        'Настольное приложение для отслеживания активности пользователя, анализа рабочего времени и управления целями.',
      content: `# Spec — трекер активности и продуктивности

Spec — настольное приложение для автоматического отслеживания активности пользователя на Windows.

Приложение собирает информацию об активных окнах и приложениях, сохраняет историю активности и предоставляет инструменты для анализа рабочего времени.

## Возможности

- Отслеживание активного приложения и окна Windows
- Сбор событий активности через WinAPI
- Сохранение истории в SQLite
- Статистика использования приложений
- Система целей и задач
- Привязка приложений и окон к пользовательским категориям

## Архитектура

Система разделена на несколько независимых частей:

- Сборщик активности на Rust с использованием Windows API
- Каналы передачи событий между компонентами
- SQLite для хранения истории и пользовательских данных
- Интерфейс на Dioxus для отображения статистики и управления данными

## Технологии

- Rust
- Dioxus 0.7
- SQLite
- Windows API
- Channels и асинхронная обработка событий

Основной акцент проекта — системное программирование, взаимодействие с Windows API и организация сбора и обработки событий.`,
      tags: 'rust,dioxus,sqlite',
      userId: 1,
    },
    {
      title: 'Spec — activity and productivity tracker',
      description:
        'A desktop application for tracking user activity, analyzing computer usage, and managing productivity goals.',
      tags: 'rust,dioxus,sqlite',
      content: `# Spec — activity and productivity tracker

Spec is a desktop application for automatically tracking user activity on Windows.

It collects information about active windows and applications, stores activity history, and provides tools for analyzing computer usage.

## Features

- Active Windows application and window tracking
- Activity event collection through WinAPI
- SQLite-based activity history
- Application usage statistics
- Goals and tasks management
- Application and window categorization

## Architecture

The system is divided into several independent components:

- Rust-based activity collector using Windows API
- Channels for communication between components
- SQLite for activity history and user data
- Dioxus interface for statistics and data management

## Technologies

- Rust
- Dioxus 0.7
- SQLite
- Windows API
- Channels and asynchronous event processing

The project focuses on systems programming, Windows API integration, and event collection and processing.`,
    },
  ),

  // 3. Last Front
  createProject(
    {
      title: 'Last Front — тактическая стратегия о выживании',
      description:
        'RTS о восстановлении территорий в мире, захваченном зомби. Игровая симуляция разрабатывается на Rust с использованием Godot.',
      content: `# Last Front — тактическая стратегия о выживании

Last Front — стратегия в реальном времени в постапокалиптическом мире, где игроку предстоит возвращать территории, захваченные зомби.

Основная идея — управление небольшими отрядами разнообразных бойцов. Важную роль играет тактическое поведение солдат, а не простое перемещение подразделений строем.

## Игровая концепция

- Управление отрядами солдат
- Тактическое перемещение бойцов с индивидуальным поведением
- Противостояние большим группам зомби
- Захват и восстановление территорий
- Развитие игровых механик и систем управления подразделениями

## Архитектура

Проект использует разделение игровой симуляции и визуального представления.

Rust отвечает за игровую логику, сущности и поведение подразделений. Godot используется как игровой движок для визуализации и взаимодействия с игровым миром.

Для интеграции используется GDExtension и godot-rust.

В текущей версии реализуется базовая инфраструктура игрового мира, работа с отрядами, выбор подразделений и логика перемещения.

## Технологии

- Rust
- Godot 4
- GDExtension
- godot-rust
- ECS-подход

Проект находится в активной разработке и служит площадкой для изучения архитектуры игровых систем и взаимодействия Rust с игровым движком.`,
      tags: 'rust,godot',
      userId: 1,
    },
    {
      title: 'Last Front — tactical survival strategy',
      description:
        'A real-time strategy game about reclaiming territories in a zombie-infested world. The game simulation is developed in Rust with Godot.',
      tags: 'rust,godot',
      content: `# Last Front — tactical survival strategy

Last Front is a real-time strategy game set in a post-apocalyptic world where players must reclaim territories occupied by zombies.

The core concept revolves around managing small squads of diverse soldiers. Tactical individual movement and behavior are more important than traditional rigid squad formations.

## Game concept

- Squad-based soldier management
- Tactical movement with individual unit behavior
- Combat against large groups of zombies
- Territory capture and restoration
- Development of unit management and gameplay systems

## Architecture

The project separates game simulation from visual presentation.

Rust handles game logic, entities, and squad behavior. Godot is used as the game engine for rendering and interaction with the game world.

GDExtension and godot-rust provide the integration between the two technologies.

The current implementation focuses on the game world infrastructure, squad management, unit selection, and movement logic.

## Technologies

- Rust
- Godot 4
- GDExtension
- godot-rust
- ECS approach

The project is actively developed as an exploration of game systems architecture and Rust integration with a game engine.`,
    },
  ),

  // 4. Itihas
  createProject(
    {
      title: 'Itihas — интерактивные истории и временные шкалы',
      repoName: 'itihas',
      description:
        'Веб-приложение для создания историй, связанных с последовательностью событий и интерактивными временными шкалами.',
      content: `# Itihas — интерактивные истории и временные шкалы

Itihas — проект на стыке исторического материала и интерактивного повествования.

Его задача — представить события в хронологическом контексте и помочь читателю увидеть, как отдельные эпизоды складываются в более широкую историю.

## Возможности

- Создание и редактирование историй
- Представление событий на временной шкале
- Визуализация хронологии
- Редактирование содержимого с помощью блочного редактора

## Технологии

- React, TypeScript, Vite
- Tailwind CSS, Zustand
- Visx для визуализации данных
- Tiptap для редактирования содержимого
- Drizzle ORM, SQLite

## Ссылки

- [GitHub](https://github.com/LiiChar/itihas)
- [Демо](https://itihas.vercel.app/)`,
      tags: 'react,typescript,tailwind,zustand,drizzle',
      userId: 1,
      url: 'https://itihas.vercel.app/',
    },
    {
      title: 'Itihas — interactive stories and timelines',
      description:
        'A web application for creating historical stories through connected events and interactive timelines.',
      tags: 'react,typescript,tailwind,zustand,drizzle',
      content: `# Itihas — interactive stories and timelines

Itihas explores the intersection of historical material and interactive storytelling.

Its goal is to place events in chronological context and help readers understand how individual episodes form a broader story.

## Features

- Creating and editing stories
- Presenting events on interactive timelines
- Chronological data visualization
- Content editing with a block-based editor

## Technologies

- React, TypeScript, Vite
- Tailwind CSS, Zustand
- Visx for data visualization
- Tiptap for content editing
- Drizzle ORM, SQLite

## Links

- [GitHub](https://github.com/LiiChar/itihas)
- [Demo](https://itihas.vercel.app/)`,
    },
  ),

  // 5. Book-styde
  createProject(
    {
      title: 'Book-styde — интерактивное изучение JavaScript',
      repoName: 'book-styde',
      description:
        'Образовательная платформа с интерактивными заданиями, редактором кода и проверкой решений.',
      content: `# Book-styde — интерактивное изучение JavaScript

Book-styde — образовательная платформа, в которой изучение JavaScript строится вокруг коротких объяснений и практических заданий.

Встроенный редактор позволяет писать код рядом с учебным материалом, а проверка заданий обеспечивает обратную связь по решениям.

## Возможности

- Интерактивные учебные материалы
- Встроенный редактор JavaScript
- Практические задания
- Проверка пользовательского кода

## Технологии

- React, TypeScript, Vite
- Monaco Editor
- Redux Toolkit

## Ссылки

- [GitHub](https://github.com/LiiChar/book-styde)
- [Демо](https://book-styde.vercel.app/)`,
      tags: 'react,typescript,redux',
      userId: 1,
      url: 'https://book-styde.vercel.app/',
    },
    {
      title: 'Book-styde — interactive JavaScript learning',
      description:
        'An educational platform with interactive exercises, a code editor, and solution validation.',
      tags: 'react,typescript,redux',
      content: `# Book-styde — interactive JavaScript learning

Book-styde is an educational platform built around short explanations and hands-on JavaScript exercises.

The integrated editor lets learners write code alongside the learning material, while exercise validation provides feedback on their solutions.

## Features

- Interactive learning materials
- Integrated JavaScript editor
- Practical coding exercises
- User code validation

## Technologies

- React, TypeScript, Vite
- Monaco Editor
- Redux Toolkit

## Links

- [GitHub](https://github.com/LiiChar/book-styde)
- [Demo](https://book-styde.vercel.app/)`,
    },
  ),
];

import { db } from '.';
import {projects, ProjectType} from "@/db/tables/project";

type ProjectFactoryInsert = Pick<
    ProjectType,
    'content' | 'tags' | 'title' | 'userId'
> & {repoName?: string};

export const projectFactory = async (content: ProjectFactoryInsert[]) => {
    await db.insert(projects).values(content);
};

export const projectFactoryReset = async () => {
    await db.delete(projects).execute();
}

export const runProjectFactory = async () => {
    console.log('Начало миграции ProjectFactory');
    await projectFactory(projectContent);
    console.log(' - Конец миграции ProjectFactory', '\n');
};

const projectContent: ProjectFactoryInsert[] = [
    {
        title: 'AI Помощник для Писателей',
        content: 'Приложение, которое помогает авторам генерировать идеи, строить сюжетные арки и редактировать текст с помощью AI.',
        tags: ['AI', 'письмо', 'инструмент'].join(', '),
        userId: 1,
        repoName: 'book-styde'
    },
    {
        title: 'Платформа Онлайн-Курсов',
        content: 'React/Next.js приложение с поддержкой видеоуроков, квизов и сертификатов.',
        tags: ['образование', 'Next.js', 'видеокурсы'].join(', '),
        userId: 1,
        repoName: 'book-styde'
    },
    {
        title: 'Трекер Привычек',
        content: 'Минималистичное приложение для отслеживания привычек с графиками и аналитикой.',
        tags: ['здоровье', 'аналитика', 'habit-tracker'].join(', '),
        userId: 1,
        repoName: 'book-styde'
    },
    {
        title: 'Генератор Лэндингов',
        content: 'Инструмент на базе drag&drop для генерации адаптивных лендингов.',
        tags: ['landing page', 'builder', 'SaaS'].join(', '),
        userId: 1,
        repoName: 'book-styde'
    },
    {
        title: 'Мессенджер с E2E шифрованием',
        content: 'Безопасное приложение для обмена сообщениями, реализующее протокол Signal.',
        tags: ['безопасность', 'мессенджер', 'шифрование'].join(', '),
        userId: 1,
    },
    {
        title: 'Приложение для Медитации',
        content: 'Мобильное SPA с упражнениями для медитации, дыхания и релаксации.',
        tags: ['здоровье', 'медитация', 'приложение'].join(', '),
        userId: 1,
    },
    {
        title: 'Финансовый Планировщик',
        content: 'Инструмент для отслеживания бюджета, расходов и доходов с красивыми графиками.',
        tags: ['финансы', 'бюджет', 'графики'].join(', '),
        userId: 1,
    },
    {
        title: 'Генератор Идей для Стартапов',
        content: 'AI-бот, который предлагает идеи на основе рыночных трендов и интересов пользователя.',
        tags: ['стартап', 'AI', 'идеи'].join(', '),
        userId: 1,
    },
    {
        title: 'Сайт-Портфолио для Разработчиков',
        content: 'Шаблонный сайт на Next.js с анимацией, разделами и адаптивной вёрсткой.',
        tags: ['портфолио', 'разработчик', 'Next.js'].join(', '),
        userId: 1,
    },
    {
        title: 'Маркетплейс для NFT-артов',
        content: 'Платформа для загрузки, продажи и покупки NFT с использованием Ethereum.',
        tags: ['NFT', 'blockchain', 'маркетплейс'].join(', '),
        userId: 1,
    },
];


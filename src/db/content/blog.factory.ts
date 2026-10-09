import { dbFactory } from '.';
import { blogs, BlogType } from '../tables/blog';

type BlogFactoryInsert = Pick<
	BlogType,
	'content' | 'tags' | 'title' | 'userId'
> & Partial<Pick<BlogType, 'lang'>>;

export const blogFactory = async (content: BlogFactoryInsert[]) => {
	await dbFactory.insert(blogs).values(content);
};

export const blogFactoryReset = async () => {
	await dbFactory.delete(blogs).execute();
};

export const runBlogFactory = async () => {
	console.log('Начало миграции BlogFactory');
	await blogFactory(blogContent);
	console.log(' - Конец миграции BlogFactory', '\n');
};

const blogContent: BlogFactoryInsert[] = [
	{
		title: 'Как находить и устранять лишние рендеры в React',
		content: `## Оптимизация начинается с измерений

Повторный рендер сам по себе не означает проблему. React может быстро обновлять небольшие компоненты, а преждевременная мемоизация добавляет сложности и иногда почти ничего не меняет. Сначала нужно воспроизвести замедление и понять, какая часть интерфейса занимает время.

Откройте React DevTools Profiler, запишите действие пользователя и посмотрите, какие компоненты рендерились и сколько занял commit. Дополнительно проверьте вкладку Performance в браузере: там видны длительные задачи, дорогие вычисления и работа layout/paint. Записывайте условия измерения, например размер списка и тип устройства, чтобы корректно сравнить изменения.

## Уменьшайте работу, которая действительно повторяется

Если дочерний компонент тяжёлый и получает те же props, его можно обернуть в \`memo\`. Это помогает только когда props сохраняют ссылочную идентичность: новые объекты и функции при каждом рендере всё равно считаются изменением.

\`\`\`tsx
import { memo } from 'react';

type ResultRowProps = {
  item: { id: string; name: string };
  onSelect: (id: string) => void;
};

const ResultRow = memo(function ResultRow({ item, onSelect }: ResultRowProps) {
  return <button onClick={() => onSelect(item.id)}>{item.name}</button>;
});
\`\`\`

Для создания стабильного callback иногда подходит \`useCallback\`, но добавляйте его вместе с измерением, а не автоматически. Аналогично, \`useMemo\` полезен для дорогих вычислений или стабильного значения для мемоизированного потомка. В массив зависимостей нужно включать все значения, от которых зависит результат; зависимость только от \`row.id\` небезопасна, если вычисление читает другие поля строки.

## Проверьте границы состояния и размер списка

Обновление контекста уведомляет потребителей этого контекста. Если независимые части страницы часто меняются, разделение контекста по смыслу может сократить число лишних обновлений. Внешнее состояние подключайте через подходящий store или \`useSyncExternalStore\`, соблюдая требования к стабильному snapshot и подписке.

Когда список содержит сотни или тысячи элементов, виртуализация может уменьшить количество одновременно смонтированных строк. Она требует аккуратной работы с высотой элементов, фокусом и доступностью, поэтому для коротких списков часто не нужна.

## Повторное измерение

После каждого изменения повторите тот же сценарий в Profiler и сравните фактическое время и отзывчивость интерфейса. Не обещайте фиксированный прирост заранее: результат зависит от данных, устройства, браузера и конкретного узкого места. Практичный порядок такой: измерить → найти причину → внести одно изменение → измерить снова.`,
		tags: ['react', 'оптимизация', 'performance'].join(','),
		userId: 1,
		lang: {
			en: {
				title: 'How to find and reduce unnecessary React renders',
				tags: 'react,optimization,performance',
				content: `## Start by measuring

A repeated render is not automatically a performance problem. React can update small components quickly, while premature memoization adds complexity without a meaningful benefit. First reproduce the slowdown and identify the work that takes time.

Use the React DevTools Profiler to record an interaction and inspect which components rendered and how long the commit took. The browser Performance panel can reveal long tasks, expensive calculations, and layout or paint work. Record the scenario, such as list size and device type, so you can compare changes fairly.

## Reduce work that is actually repeated

If a child component is expensive and receives the same props, \`memo\` may let React skip rendering it. This is most useful when its props keep the same references: newly created objects and functions still count as changed props.

\`\`\`tsx
import { memo } from 'react';

type ResultRowProps = {
  item: { id: string; name: string };
  onSelect: (id: string) => void;
};

const ResultRow = memo(function ResultRow({ item, onSelect }: ResultRowProps) {
  return <button onClick={() => onSelect(item.id)}>{item.name}</button>;
});
\`\`\`

\`useCallback\` can preserve a function reference when that matters, but should be guided by profiling. Likewise, \`useMemo\` is useful for expensive calculations or stable values passed to memoized children. Include every value the calculation reads in its dependency list; depending only on \`row.id\` is unsafe if it also reads other row fields.

## Review state boundaries and list size

Updating context notifies its consumers. Splitting frequently changing, unrelated values into separate contexts can reduce unnecessary work. For external state, use a store or \`useSyncExternalStore\` with a stable snapshot and a correctly managed subscription.

For hundreds or thousands of list items, virtualization can reduce how many rows are mounted at once. It adds requirements around item heights, focus, and accessibility, so it is often unnecessary for short lists.

## Measure again

Repeat the same interaction after each change and compare the recorded time and responsiveness. Avoid promising a fixed improvement in advance: results depend on the data, device, browser, and actual bottleneck. A useful loop is measure → identify the cause → make one change → measure again.`,
			},
		},
	},
	{
		title: 'WebSocket в React: подключение, переподключение и очистка',
		content: `## Разделяйте соединение и состояние интерфейса

WebSocket — долгоживущее соединение. Если создавать его непосредственно при рендере компонента, повторные рендеры могут открыть несколько соединений. Обычно соединение создают в эффекте или отдельном сервисе, а при размонтировании компонента закрывают либо снимают подписку — в зависимости от того, кому принадлежит соединение.

Ниже минимальный пример для компонента, который владеет соединением:

\`\`\`tsx
import { useEffect, useState } from 'react';

function useMessages(url: string) {
  const [messages, setMessages] = useState<string[]>([]);

  useEffect(() => {
    const socket = new WebSocket(url);
    socket.addEventListener('message', event => {
      setMessages(current => [...current, String(event.data)]);
    });

    return () => socket.close();
  }, [url]);

  return messages;
}
\`\`\`

В production-коде дополнительно обработайте \`open\`, \`error\` и \`close\`, покажите состояние подключения и определите, как приложение должно реагировать на неотправленные сообщения. Если соединение общее для нескольких экранов, его жизненным циклом должен управлять общий сервис, а компоненты должны подписываться и отписываться от событий.

## Переподключение требует договорённости с сервером

При неожиданном закрытии можно повторять попытку с увеличивающейся задержкой и случайным разбросом (exponential backoff with jitter). Ограничьте частоту попыток и сбрасывайте счётчик после успешного подключения. Перед повторной отправкой команд решите, допускает ли сервер повтор: для важных операций используйте идентификаторы сообщений и идемпотентную обработку.

WebSocket API браузера не предоставляет управляющие ping/pong-кадры JavaScript-коду. Если приложению нужен heartbeat, определите отдельные сообщения протокола и согласуйте их с сервером.

## Учитывайте безопасность и фоновые вкладки

Не передавайте долгоживущие секреты в query-параметрах URL без оценки рисков: URL могут попадать в логи. Предпочтительнее использовать согласованный сервером механизм аутентификации и проверять origin. Браузер или мобильная сеть может приостановить неактивную вкладку и оборвать соединение, поэтому клиенту необходимо корректно восстанавливать состояние после возвращения.

Проверьте сценарии потери сети, повторного подключения, размонтирования компонента и дублирования сообщений. Надёжность складывается не только из клиентского хука: нужны согласованный протокол, очистка подписок и понятное поведение при временной недоступности сервера.`,
		tags: ['websocket', 'react', 'реальное время'].join(','),
		userId: 1,
		lang: {
			en: {
				title: 'WebSockets in React: connections, reconnection, and cleanup',
				tags: 'websocket,react,realtime',
				content: `## Separate the connection from UI state

A WebSocket is a long-lived connection. Creating it during render can open multiple connections as the component renders again. A component can create a connection in an effect and close it when unmounted, or a shared service can own the connection while components subscribe to its events.

Here is a minimal example for a component that owns its connection:

\`\`\`tsx
import { useEffect, useState } from 'react';

function useMessages(url: string) {
  const [messages, setMessages] = useState<string[]>([]);

  useEffect(() => {
    const socket = new WebSocket(url);
    socket.addEventListener('message', event => {
      setMessages(current => [...current, String(event.data)]);
    });

    return () => socket.close();
  }, [url]);

  return messages;
}
\`\`\`

Production code should also handle \`open\`, \`error\`, and \`close\`, expose connection status, and decide what happens to unsent messages. If several screens share a connection, let a service manage its lifetime and make components subscribe and unsubscribe to events.

## Reconnection needs a server-side agreement

After an unexpected close, a client can retry with exponential backoff and random jitter. Limit retry frequency and reset the counter after a successful connection. Before resending commands, decide whether the server can safely receive duplicates. Important operations should use message identifiers and idempotent handling.

The browser WebSocket API does not expose protocol-level ping/pong control frames to JavaScript. If the application needs a heartbeat, define application messages and implement them on the server too.

## Consider security and background tabs

Avoid putting long-lived secrets in URL query parameters without assessing the risk of URLs appearing in logs. Use an authentication mechanism agreed with the server and validate the origin. Browsers and mobile networks can pause inactive tabs or drop connections, so the client should restore state when the user returns.

Test network loss, reconnection, component unmounting, and duplicate messages. Reliability depends on the protocol, subscription cleanup, and clear behavior while the server is unavailable—not just on a client hook.`,
			},
		},
	},
	{
		title: 'Zustand или Redux Toolkit: как выбрать управление состоянием',
		content: `## Выбирайте по требованиям проекта

Zustand и Redux Toolkit решают похожую задачу — хранят состояние, доступное нескольким частям приложения, — но предлагают разные соглашения. Zustand даёт компактный API и позволяет собирать store постепенно. Redux Toolkit задаёт более единообразную структуру через slices, actions и reducers и хорошо поддерживает явные потоки обновления данных.

Простой store в Zustand может выглядеть так:

\`\`\`ts
import { create } from 'zustand';

type CounterState = {
  count: number;
  increment: () => void;
};

const useCounter = create<CounterState>(set => ({
  count: 0,
  increment: () => set(state => ({ count: state.count + 1 })),
}));
\`\`\`

В Redux Toolkit похожее состояние описывают через slice:

\`\`\`ts
import { createSlice } from '@reduxjs/toolkit';

const counterSlice = createSlice({
  name: 'counter',
  initialState: { count: 0 },
  reducers: {
    increment(state) {
      state.count += 1;
    },
  },
});
\`\`\`

Оба примера типизируются и позволяют подписывать компоненты на нужные данные. Нельзя утверждать, что Redux перерисовывает всё приложение при каждом dispatch: React Redux использует селекторы, а компоненты обновляются при изменении выбранного результата. В Zustand результат также зависит от селектора и сравнения значений.

## Когда подойдёт каждый вариант

Zustand удобно рассмотреть для небольшого или среднего приложения, когда важны небольшой объём шаблонного кода и простая модель подписок. Redux Toolkit может быть хорошим выбором, когда команде нужны единые соглашения, явные actions, развитая экосистема middleware и предсказуемая отладка переходов состояния.

Для серверных данных отдельно оцените специализированный кэш и загрузку данных. RTK Query — часть экосистемы Redux Toolkit, а не обязательное условие использования Redux для любого состояния; Zustand сам по себе тоже не заменяет кэширование запросов.

Сравнивайте реальные требования: размер команды, сложность обновлений, инструменты отладки, SSR, тестируемость и знакомство разработчиков. Начните с локального состояния там, где оно достаточно, и выносите данные в общий store только когда ими действительно нужно управлять совместно.`,
		tags: ['zustand', 'redux', 'состояние'].join(','),
		userId: 1,
		lang: {
			en: {
				title: 'Zustand or Redux Toolkit: choosing a state management approach',
				tags: 'zustand,redux,state management',
				content: `## Choose based on the project requirements

Zustand and Redux Toolkit both manage state shared across parts of an application, but they encourage different conventions. Zustand offers a compact API and lets you build a store incrementally. Redux Toolkit provides a more structured approach with slices, actions, and reducers, making state transitions explicit.

A small Zustand store can look like this:

\`\`\`ts
import { create } from 'zustand';

type CounterState = {
  count: number;
  increment: () => void;
};

const useCounter = create<CounterState>(set => ({
  count: 0,
  increment: () => set(state => ({ count: state.count + 1 })),
}));
\`\`\`

With Redux Toolkit, similar state can be described in a slice:

\`\`\`ts
import { createSlice } from '@reduxjs/toolkit';

const counterSlice = createSlice({
  name: 'counter',
  initialState: { count: 0 },
  reducers: {
    increment(state) {
      state.count += 1;
    },
  },
});
\`\`\`

Both approaches support typed state and selectors. It is inaccurate to say that Redux rerenders the whole application on every dispatch: React Redux uses selectors, and a component updates when its selected result changes. Zustand behavior also depends on the selector and equality comparison.

## When each option may fit

Zustand is worth considering for small or medium applications where a compact API and a straightforward subscription model are useful. Redux Toolkit can be a good fit when a team wants shared conventions, explicit actions, a broad middleware ecosystem, and predictable debugging of state transitions.

Evaluate server data caching separately. RTK Query is part of the Redux Toolkit ecosystem, but Redux does not require it for every kind of state; Zustand does not replace request caching either.

Compare the actual needs: team size, update complexity, debugging tools, SSR, testability, and team familiarity. Start with local state when it is enough, and move data into a shared store only when multiple parts of the application need to coordinate it.`,
			},
		},
	},
];

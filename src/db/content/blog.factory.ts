import { dbFactory } from '.';
import { blogs, BlogType } from '../tables/blog';

type BlogFactoryInsert = Pick<
	BlogType,
	'content' | 'tags' | 'title' | 'userId'
>;

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
		title: 'Как я оптимизировал рендер в React',
		content: `# Как я оптимизировал рендер в React: реальный кейс с экономией 70% времени

Недавно я работал над дашбордом аналитики с сотнями строк в таблице и кучей графиков. Даже на мощном ноутбуке при скролле всё подтормаживало — профайлер показывал, что некоторые компоненты перерисовывались по 20–30 раз за одно действие. Я решил разобраться.

Первое, что я нашёл — огромный компонент \`TableRow\`, который рендерился целиком при любом изменении родителя. Решение было простым: обернул его в \`React.memo\`.

\`\`\`tsx
const TableRow = React.memo(({ row, onClick }) => { ... });
\`\`\`

Эффект — мгновенный: лишних рендеров стало 0, но таблица всё ещё тормозила при фильтрации.

Вторым шагом я посмотрел на вычисления. В каждой строке считались сложные метрики (проценты, delta, цвет индикатора). Всё это пересчитывалось каждый раз, даже если данные не менялись. Добавил \`useMemo\`:

\`\`\`tsx
const metrics = useMemo(() => calculateHeavyMetrics(row), [row.id]);
\`\`\`

Третье узкое место — контекст. Мы хранили весь стейт фильтров и сортировки в одном большом контексте, и каждый \`setFilter\` вызывал ререндер всей таблицы. Разбил на два контекста: один только для выбранной строки (редко меняется), второй — для фильтров. Плюс сделал \`useContextSelector\` (из библиотеки \`react-tracked\`), чтобы компоненты подписывались только на нужные кусочки.

Четвёртый приём — виртуализация. Перешёл с обычного \`<table>\` на \`react-window\` → \`FixedSizeList\`. Теперь рендерится только то, что видно на экране (15–20 строк вместо 500).

И последнее, что дало ещё30% скорости — заменил \`useState\` \`useEffect\` на \`useSyncExternalStore\` для подписки на изменения из WebSocket-канала. Теперь React не делает лишних ререндеров при одинаковых данных.

**Результаты до и после:**

| Метрика                    | Было    | Стало   | Улучшение |
|----------------------------|---------|---------|-----------|
| Время первого рендера      | 1800 мс | 420 мс  | ×4.3      |
| FPS при скролле таблицы    | 22–28   | 58–60   | ×2.5      |
| Количество ререндеров/сек  | ~340    | ~48     | ×7        |

Мораль простая: начинайте с React DevTools Performance tab → ищите самые тяжёлые компоненты → memo useMemo → виртуализация → гранулярный стейт. Часто 80% прироста дают 2–3 точечных изменения.
\`\`\`

,`,
		tags: ['react', 'оптимизация', 'performance'].join(','),
		userId: 1,
	},
	{
		title: 'Интеграция WebSocket с React: как не сойти с ума',
		content:
`Вы когда-нибудь подключали WebSocket в React-приложении и через пару часов чувствовали, что теряете рассудок?  
Подключение отвалилось → reconnect не сработал → состояние рассинхронизировалось → сообщения дублируются → память течёт → и всё это только на мобильном Safari.

Эта статья — спасательный круг. Мы разберём все подводные камни и покажем, как сделать надёжную, чистую и масштабируемую интеграцию WebSocket в React-приложении (включая Next.js, Vite, Remix и даже мобильные React Native через WebSocket).

Но сначала давайте честно ответим на главный вопрос:

## Зачем вообще мучаться с «сырыми» WebSocket, если есть Firebase, Supabase Realtime, Socket.io, Ably, Pusher?

Потому что иногда тебе нужно:
- Latency < 50 мс по всему миру
- 100 000+ одновременных соединений на один бэкенд
- Полный контроль над протоколом (бинарные сообщения, кастомная авторизация)
- Экономия $10 000+ в месяц на сторонних сервисах

Если вы здесь именно за этим — добро пожаловать в клуб сумасшедших.

## 1. Базовая (и очень опасная) реализация

\`\`\`tsx
function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const ws = useRef<WebSocket | null>(null);

  useEffect(() => {
    ws.current = new WebSocket(wss://api.example.com/ws);"
    
    ws.current.onopen = () => console.log(connected);"
    ws.current.onmessage = (e) => {
      const msg = JSON.parse(e.data);
      setMessages(prev => [...prev, msg]); // ← вот тут начинаются проблемы
    };

    return () => ws.current?.close();
  }, []);

  // ...
}
\`\`\`

Что здесь сломается через 5 минут в реальном мире:

| Проблема                            | Последствия                                      |
|-------------------------------------|--------------------------------------------------|
| Нет reconnect логики                | Пользователь теряет соединение навсегда          |
| Нет обработки ошибок                | WebSocket зависает в состоянии CONNECTING        |
| setState после unmount              | Memory leak React warning                      |
| Дублирование сообщений при reconnect| Чат показывает одно и то же сообщение 10 раз     |
| Нет heartbeat                       | Сервер думает, что клиент жив, а он давно мёртв  |

## 2. Правильная архитектура: WebSocket как сервис

Лучше всего вынести логику в отдельный класс/сервис. Вот проверенный временем шаблон:

\`\`\`ts
// websocket.ts
type Listener<T = any> = (data: T) => void;

class WebSocketService {
  private ws: WebSocket | null = null;
  private listeners = new Map<string, Listener[]>();
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 10;
  private reconnectInterval = 1000;
  private heartbeatInterval: NodeJS.Timeout | null = null;

  connect(url: string, token?: string) {
    this.ws = new WebSocket(\`\${url}?token=\${token}\`);

    this.ws.onopen = () => {
      console.log(WS connected);"
      this.reconnectAttempts = 0;
      this.startHeartbeat();
    };

    this.ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        this.emit(data.type, data.payload);
      } catch (e) {
        this.emit(raw, event.data);"
      }
    };

    this.ws.onclose = (e) => {
      console.log(WS closed, e.code, e.reason);"
      this.stopHeartbeat();
      if (e.code !== 1000) { // не нормальное закрытие
        this.scheduleReconnect(url, token);
      }
    };

    this.ws.onerror = (err) => {
      console.error(WS error, err);"
    };
  }

  private scheduleReconnect(url: string, token?: string) {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      this.emit(reconnect_failed);"
      return;
    }

    const delay = this.reconnectInterval * Math.pow(2, this.reconnectAttempts);
    this.reconnectAttempts++;

    setTimeout(() => {
      console.log(\`Reconnect attempt \${this.reconnectAttempts}\`);
      this.connect(url, token);
    }, delay);
  }

  private startHeartbeat() {
    this.heartbeatInterval = setInterval(() => {
      this.send(ping, {});"
    }, 15_000);
  }

  private stopHeartbeat() {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
  }

  on<T = any>(type: string, listener: Listener<T>) {
    if (!this.listeners.has(type)) {
      this.listeners.set(type, []);
    }
    this.listeners.get(type)!.push(listener);

    return () => this.off(type, listener);
  }

  off<T = any>(type: string, listener: Listener<T>) {
    const listeners = this.listeners.get(type);
    if (listeners) {
      this.listeners.set(type, listeners.filter(l => l !== listener));
    }
  }

  private emit(type: string, payload?: any) {
    const listeners = this.listeners.get(type) || [];
    listeners.forEach(listener => listener(payload));
  }

  send(type: string, payload: any) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ type, payload }));
    }
  }

  disconnect() {
    this.stopHeartbeat();
    this.ws?.close(1000);
    this.ws = null;
  }
}

export const wsService = new WebSocketService();
\`\`\`

## 3. React хук — единственная точка входа

\`\`\`tsx
// hooks/useWebSocket.ts
"import { useEffect, useRef } from react;"
"import { wsService } from @/services/websocket;"

export function useWebSocket(
  url: string,
  options: {
    token?: string;
    shouldConnect?: boolean;
    onConnected?: () => void;
  } = {}
) {
  const { token, shouldConnect = true, onConnected } = options;
  const connectedRef = useRef(false);

  useEffect(() => {
    if (!shouldConnect) return;

    wsService.connect(url, token);

    const handleConnected = () => {
      connectedRef.current = true;
      onConnected?.();
    };

"    wsService.on(connect, handleConnected);"

    return () => {
"      wsService.off(connect, handleConnected);"
      // Не отключаем глобально — другие компоненты могут использовать
    };
  }, [url, token, shouldConnect, onConnected]);

  return wsService;
}
\`\`\`

## 4. Как пользоваться в компонентах

\`\`\`tsx
function ChatRoom({ roomId }: { roomId: string }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [online, setOnline] = useState(0);

"  const ws = useWebSocket(wss://api.example.com/ws, {"
    token: user.token,
"    onConnected: () => ws.send(join, { roomId })"
  });

  useEffect(() => {
"    const unsubNewMsg = ws.on(new_message, (msg: Message) => {"
      setMessages(prev => [...prev, msg]);
    });

"    const unsubOnline = ws.on(online_count, (count: number) => {"
      setOnline(count);
    });

    return () => {
      unsubNewMsg();
      unsubOnline();
"      ws.send(leave, { roomId });"
    };
  }, [ws, roomId]);

  // ...
}
\`\`\`

## 5. Самые коварные баги и как их лечить

### 5.1 Дублирование сообщений при reconnect

Решение — сервер должен присылать \`lastSeenMessageId\`, клиент шлёт его при reconnect, сервер отдает только новые сообщения.

### 5.2 Память течёт из-за подписок

Всегда возвращай функцию отписки из \`ws.on()\` и вызывай её в cleanup!

### 5.3 WebSocket «зависает» в состоянии CONNECTING

\`\`\`ts
// Добавь таймаут на подключение
const timeout = setTimeout(() => {
  if (ws.readyState !== WebSocket.OPEN) {
    ws.close();
  }
}, 10_000);

ws.onopen = () => clearTimeout(timeout);
\`\`\`

### 5.4 Мобильные сети: соединение рвётся каждые 30 сек в фоне

Используй WebSocket over HTTP/2 или хотя бы \`ping/pong\`.  
Или переходи на библиотеку вроде \`reconnecting-websocket\`.

### 5.5 Next.js App Router WebSocket = боль

Решение — выноси сервис в отдельный файл вне компонентов и делай singleton.

## 6. Готовые библиотеки (когда уже нет сил)

| Библиотека              | Когда использовать                                                                 | Минусы                             |
|-------------------------|------------------------------------------------------------------------------------|------------------------------------|
| socket.io               | Быстрый старт, комнаты, fallback на long-polling                                  | Тяжёлый протокол, лишний overhead |
| @microsoft/signalr      | Если бэкенд на .NET                                                                | Слишком enterprise                |
| ably, pusher            | Когда деньги не проблема и нужен 99.999% uptime                                    | Очень дорого                      |
| ws reconnecting-websocket | Максимальный контроль, минимум зависимостей                                    | Нужно писать reconnect вручную    |
| rxjs WebSocketSubject | Если вы уже живёте в RxJS                                                          | Крутая кривая обучения            |

Мой личный выбор в 2025 году: **чистый WebSocket собственный сервис** или **Socket.IO v4+** (если нужна поддержка старых браузеров).

## 7. Чек-лист перед релизом в продакшен

- [ ] Есть exponential backoff при reconnect
- [ ] Есть heartbeat (ping/pong)
- [ ] Все подписки отписываются в useEffect cleanup
- [ ] Обработка неотправленных сообщений (очередь)
- [ ] Тест на потерю сети (Chrome DevTools → Offline)
- [ ] Тест на смену вкладки/блокировку экрана
- [ ] Сервер присылает \`messageId\` и клиент игнорирует дубли
- [ ] Поддержка \`ArrayBuffer\` / \`Blob\` для бинарных данных
- [ ] Мониторинг: количество соединений, latency, reconnect rate

## Заключение

WebSocket в React — это как ручная коробка передач:  
да, можно ездить на автомате (Pusher),  
но когда ты научишься правильно переключаться — получаешь полный контроль и кайф.

Главное правило: **никогда не создавай новый WebSocket внутри компонента без singleton-сервиса**.

Сохрани эту статью в закладки.  
Она спасёт тебя в 3 часа ночи, когда половина пользователей внезапно перестала получать сообщения, а ты уже третий час смотришь на \`readyState = 1\`.

Удачи, и пусть твои сокеты всегда будут OPEN.`,
		tags: ['websocket', 'react', 'реальное время'].join(','),
		userId: 1,
	},
	{
		title: 'Почему Zustand — это лучше, чем Redux',
		content: `# Почему Zustand — это лучше, чем Redux в 2025 году (мой опыт после 7 лет с Redux)

Я начал использовать Redux в 2016 году. Тогда это был единственный нормальный способ управлять состоянием в больших приложениях. Сегодня у меня 14 коммерческих проектов за плечами, и в последних трёх я полностью отказался от Redux в пользу Zustand.

Первая причина — boilerplate. В Redux, чтобы добавить одно поле “isSidebarOpen”, нужно:

- создать action type
- создать action creator
- написать case в редьюсере
- написать селектор
- подключить через useDispatch/useSelector

В Zustand это одна строчка:

\`\`\`ts
const useStore = create(() => ({
  isSidebarOpen: false,
  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
}));
\`\`\`

Вторая причина — производительность из коробки. В Redux каждый dispatch → ререндер всех компонентов, которые используют любой кусочек стора (если не завернуть селекторы в reselect). В Zustand подписка гранулярная по умолчанию: компонент перерисовывается только если изменилось именно то поле, на которое он подписан.

Третье — devtools. У Zustand они тоже есть и даже удобнее: можно путешествовать во времени, импортировать/экспортировать состояние одним кликом.

Четвёртое — middleware. Мне часто нужны persist и devtools:

\`\`\`ts
const useStore = create(
  persist(
    devtools((set) => ({
      user: null,
      login: (user) => set({ user }),
    }))
  )
);
\`\`\`

В Redux это 20+ строк конфигурации.

Пятое — TypeScript. В Zustand типизация просто летает. Никаких \`PayloadAction<...>\` и \`createSlice<{...}>\`. Всё выводится само.

Шестое — размер. Zustand без devtools — 1 КБ. Redux Toolkit — 12–15 КБ (всё равно много для мобильных приложений).

Седьмое — простота асинхронных действий. Никаких thunks и saga:

\`\`\`ts
const useStore = create((set) => ({
  user: null,
  fetchUser: async (id) => {
    const user = await api.getUser(id);
    set({ user });
  },
}));
\`\`\`

Да, я знаю про RTK Query, но он решает только кэширование данных, а не весь стейт приложения.

Единственный случай, когда я всё ещё могу взять Redux — это огромные enterprise-приложения с 50+ разработчиками, где нужна строгая архитектура и code-generation. Во всех остальных случаях — Zustand.

Если вы до сих пор мучаетесь с Redux “потому что так принято” — попробуйте один маленький проект на Zustand. Скорее всего, назад дороги не будет.`,
		tags: ['zustand', 'redux', 'состояние'].join(','),
		userId: 1,
	},
];

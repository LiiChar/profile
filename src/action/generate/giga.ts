'use server';

import { randomUUID } from 'crypto';

type GigaMessage = {
	role: 'system' | 'user' | 'assistant' | 'function';
	content: string;
	attachments?: string[];
};

class GigaChat {
	private readonly authKey: string;
	private readonly scope: string;
	private token: string | null = null;
	private tokenExpiresAt = 0;

	constructor(opts: { authKey: string; scope?: string }) {
		this.authKey = opts.authKey;
		this.scope = opts.scope ?? 'GIGACHAT_API_PERS';
	}

	//-------------------------------------
	// Получение токена
	//-------------------------------------
	private async fetchToken() {
		const rqUid = randomUUID();

		const res = await fetch(
			'https://ngw.devices.sberbank.ru:9443/api/v2/oauth',
			{
				method: 'POST',
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded',
					Accept: 'application/json',
					Authorization: `Basic ${this.authKey}`,
					RqUID: rqUid,
				},
				body: new URLSearchParams({
					scope: this.scope,
				}),
			}
		);

		if (!res.ok) {
			const body = await res.text();
			throw new Error(`Не удалось получить токен: ${res.status} — ${body}`);
		}

		const data = await res.json();
		this.token = data.access_token;
		this.tokenExpiresAt = data.expires_at * 1000;

		return this.token;
	}

	private async getToken() {
		const now = Date.now();

		// Обновляем токен заранее, за 5 секунд
		if (!this.token || now >= this.tokenExpiresAt - 5000) {
			await this.fetchToken();
		}

		return this.token!;
	}

	//-------------------------------------
	// Запрос к модели
	//-------------------------------------
	async chat(messages: GigaMessage[], model = 'GigaChat-Pro') {
		const token = await this.getToken();

		const res = await fetch(
			'https://gigachat.devices.sberbank.ru/api/v1/chat/completions',
			{
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${token}`,
					Accept: 'application/json',
				},
				body: JSON.stringify({ model, messages }),
			}
		);

		if (!res.ok) {
			const body = await res.text();
			throw new Error(`Ошибка chat: ${res.status} — ${body}`);
		}

		return res.json();
	}
}

const giga = new GigaChat({
	authKey: process.env.GIGI_SECRET_KEY!,
});

// ← Теперь это корректный server action (async функция)
export async function gigaChat(
	messages: GigaMessage[],
	model = 'GigaChat-Pro'
) {
	return await giga.chat(messages, model);
}

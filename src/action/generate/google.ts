'use server';

import { GoogleGenAI } from '@google/genai';

type GoogleMessage = {
	role: 'system' | 'user' | 'assistant' | 'function';
	content: string;
};

class GoogleChat {
	private readonly ai: GoogleGenAI;
	private readonly authKey: string;

	constructor(opts: { authKey: string }) {
		this.authKey = opts.authKey;
		this.ai = new GoogleGenAI({
			apiKey: this.authKey,
		});
	}

	//-------------------------------------
	async chat(messages: GoogleMessage[], model = 'gemini-2.5-flash') {
		const res = await this.ai.models.generateContent({
			model: model,
			contents: messages.map(msg => ({
				role: msg.role,
				text: msg.content,
			})),
		});

		return res.text;
	}
}

const giga = new GoogleChat({
	authKey: process.env.GOOGLE_SECRET_KEY!,
});

export async function googleChat(
	messages: GoogleMessage[],
	model = 'gemini-2.5-flash'
) {
	return await giga.chat(messages, model);
}


'use server';

import { gigaChat } from './giga';
import { googleChat } from './google';

export const chat = async (text: string, gen: 'google' | 'giga' = 'google') => {
  let message = '';

  switch (gen) {
    case 'giga':
      message = await gigaChat([
        {
          role: 'system',
          content: `Ты — помощник. Генерируй ответ строго в контексте: "${text}".`,
        },
        {
          role: 'user',
          content: text,
        },
      ]);
      break;
    case 'google':
      message = await googleChat([
        {
          role: 'system',
          content: `Ты — помощник. Генерируй ответ строго в контексте: "${text}".`,
        },
        {
          role: 'user',
          content: text,
        },
      ]) ?? '';
      break;
  }
	return message;
};
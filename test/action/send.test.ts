import { describe, it, expect, vi, afterEach } from 'vitest';
import * as nodemailer from 'nodemailer';
import { sendMail } from '@/action/email/send';

// Мокаем nodemailer правильно с importActual
vi.mock('nodemailer', async () => {
	const actual = await vi.importActual<typeof import('nodemailer')>(
		'nodemailer'
	);
	return {
		...actual,
		createTransport: vi.fn().mockReturnValue({
			sendMail: vi.fn().mockResolvedValue({}),
		}),
	};
});

afterEach(() => {
	vi.clearAllMocks();
	vi.unstubAllEnvs();
});

describe('sendMail', () => {
	it('успешно отправляет письмо', async () => {
		vi.stubEnv('YANDEX_USERNAME', 'test_user');
		vi.stubEnv('YANDEX_PASSWORD', 'test_pass');

		const result = await sendMail({ name: 'Максим', message: 'Привет!' });

		expect(result).toBe('Email has been sended');

		// Проверяем, что nodemailer создал транспорт и вызвал sendMail с нужными параметрами
		const transport = (nodemailer.createTransport as jest.Mock).mock.results[0]
			.value;

		expect(transport.sendMail).toHaveBeenCalledWith(
			expect.objectContaining({
				from: expect.any(String),
				to: expect.any(String),
				subject: expect.stringContaining('Максим'),
				html: expect.stringContaining('Привет'),
			})
		);
	});

	it('выбрасывает ошибку при пустых полях', async () => {
		await expect(sendMail({ name: '', message: '' })).rejects.toThrow(
			'Поля не должны быть пустыми'
		);
	});

	it('выбрасывает ошибку при сбое отправки', async () => {
		vi.stubEnv('YANDEX_USERNAME', 'u');
		vi.stubEnv('YANDEX_PASSWORD', 'p');

		const transport = (nodemailer.createTransport as jest.Mock).mock.results[0]
			.value;
		transport.sendMail.mockRejectedValueOnce(new Error('SMTP Error'));

		await expect(
			sendMail({ name: 'Тест', message: 'Сообщение' })
		).rejects.toThrow('Произошла ошибка при отправке почты');
	});
});

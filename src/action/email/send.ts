'use server';

import nodemailer from 'nodemailer';

type SendMailData = {
	name: string;
	message: string;
};

export const sendMail = async ({ message, name }: SendMailData) => {
	const transporter = nodemailer.createTransport({
		host: 'smtp.yandex.ru',
		port: 465,
		secure: true, // true for 465, false for other ports
		auth: {
			user: process.env.YANDEX_USERNAME,
			pass: process.env.YANDEX_PASSWORD,
		},
	});

	if (message === '' || name === '') {
		throw new Error('Поля не должны быть пустыми');
	}

	try {
		await transporter.sendMail({
			from: 'yura22875@yandex.com',
			to: 'yura22875@yandex.com',
			subject: 'Вам пришло сообщения с вашего сайта от: ' + name,
			html: `
			<h3>Содержание сообщения от пользователя ${name}:</h3>
			${message}
			`,
		});
		return 'Email has been sended';
	} catch (error) {
		console.log('[Отправка почту]: ', error);
		throw new Error('Произошла ошибка при отправке почты');
	}
};

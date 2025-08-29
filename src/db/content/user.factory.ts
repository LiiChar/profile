import { dbFactory } from '.';
import { users, UserType } from '../tables/user';

type UserFactoryInsert = Pick<UserType, 'name'>;

export const userFactory = async (content: UserFactoryInsert[]) => {
	await dbFactory.insert(users).values(content);
};

export const userFactoryReset = async () => {
	await dbFactory.delete(users).execute();
};

export const runUserFactory = async () => {
	console.log('Начало миграции UserFactory');
	await userFactory(userContent);
	console.log(' - Конец миграции UserFactory', '\n');
};

const userContent: UserFactoryInsert[] = [
	{
		name: 'Rosa',
	},
	{
		name: 'Sofi',
	},
];

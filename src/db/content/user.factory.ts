import { dbFactory } from '.';
import { users, UserType } from '../tables/user';
import bcrypt from 'bcryptjs';

type UserFactoryInsert = Pick<UserType, 'name' | 'password' | 'isAdmin'>;

export const userFactory = async (content: UserFactoryInsert[]) => {
	await dbFactory
		.insert(users)
		.values(
			content.map(user => ({
				...user,
				password: user.password ? bcrypt.hashSync(user.password, 10): null,
			}))
		);
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
		name: 'Maxim',
		password: '24688642',
		isAdmin: true
	},
];

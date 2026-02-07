import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { login, logout, getCurrentUser } from '@/action/auth/login';
import { db } from '@/db/db';
import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';

// Mock dependencies
vi.mock('@/db/db', () => ({
	db: {
		select: vi.fn(),
	},
}));

vi.mock('bcryptjs', () => ({
	default: {
		compare: vi.fn(),
	},
}));

vi.mock('next/headers', () => ({
	cookies: vi.fn(),
}));

const mockSelect = db.select as any;
const mockBcryptCompare = bcrypt.compare as any;
const mockCookies = cookies as any;

describe('login', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('successfully logs in a user with valid credentials', async () => {
		const mockUser = {
			id: 1,
			name: 'testuser',
			password: 'hashedpassword',
			photo: 'photo.jpg',
		};

		mockSelect.mockReturnValue({
			from: vi.fn().mockReturnThis(),
			where: vi.fn().mockReturnThis(),
			limit: vi.fn().mockResolvedValue([mockUser]),
		});

		mockBcryptCompare.mockResolvedValue(true);

		const mockCookieStore = {
			set: vi.fn(),
		};
		mockCookies.mockResolvedValue(mockCookieStore);

		const result = await login({ name: 'testuser', password: 'password123' });

		expect(result.success).toBe(true);
		expect(result.user).toEqual({
			id: 1,
			name: 'testuser',
			photo: 'photo.jpg',
		});
		expect(mockCookieStore.set).toHaveBeenCalledWith(
			'user_id',
			'1',
			expect.objectContaining({
				httpOnly: true,
				sameSite: 'strict',
			})
		);
	});

	it('throws error for non-existent user', async () => {
		mockSelect.mockReturnValue({
			from: vi.fn().mockReturnThis(),
			where: vi.fn().mockReturnThis(),
			limit: vi.fn().mockResolvedValue([]),
		});

		await expect(login({ name: 'nonexistent', password: 'password' }))
			.rejects.toThrow('Invalid username or password');
	});

	it('throws error for invalid password', async () => {
		const mockUser = {
			id: 1,
			name: 'testuser',
			password: 'hashedpassword',
		};

		mockSelect.mockReturnValue({
			from: vi.fn().mockReturnThis(),
			where: vi.fn().mockReturnThis(),
			limit: vi.fn().mockResolvedValue([mockUser]),
		});

		mockBcryptCompare.mockResolvedValue(false);

		await expect(login({ name: 'testuser', password: 'wrongpassword' }))
			.rejects.toThrow('Invalid username or password');
	});
});

describe('logout', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('successfully logs out user', async () => {
		const mockCookieStore = {
			delete: vi.fn(),
		};
		mockCookies.mockResolvedValue(mockCookieStore);

		const result = await logout();

		expect(result.success).toBe(true);
		expect(mockCookieStore.delete).toHaveBeenCalledWith('user_id');
	});

	it('throws error if logout fails', async () => {
		mockCookies.mockRejectedValue(new Error('Cookie error'));

		await expect(logout()).rejects.toThrow('Logout failed');
	});
});

describe('getCurrentUser', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('returns user when logged in', async () => {
		const mockUser = {
			id: 1,
			name: 'testuser',
			photo: 'photo.jpg',
			isAdmin: false,
		};

		const mockCookieStore = {
			get: vi.fn().mockReturnValue({ value: '1' }),
		};
		mockCookies.mockResolvedValue(mockCookieStore);

		mockSelect.mockReturnValue({
			from: vi.fn().mockReturnThis(),
			where: vi.fn().mockReturnThis(),
			limit: vi.fn().mockResolvedValue([mockUser]),
		});

		const result = await getCurrentUser();

		expect(result).toEqual({
			id: 1,
			name: 'testuser',
			photo: 'photo.jpg',
			isAdmin: false,
		});
	});

	it('returns null when no user_id cookie', async () => {
		const mockCookieStore = {
			get: vi.fn().mockReturnValue(undefined),
		};
		mockCookies.mockResolvedValue(mockCookieStore);

		const result = await getCurrentUser();

		expect(result).toBeNull();
	});

	it('returns null when user not found in database', async () => {
		const mockCookieStore = {
			get: vi.fn().mockReturnValue({ value: '999' }),
		};
		mockCookies.mockResolvedValue(mockCookieStore);

		mockSelect.mockReturnValue({
			from: vi.fn().mockReturnThis(),
			where: vi.fn().mockReturnThis(),
			limit: vi.fn().mockResolvedValue([]),
		});

		const result = await getCurrentUser();

		expect(result).toBeNull();
	});

	it('returns null on database error', async () => {
		const mockCookieStore = {
			get: vi.fn().mockReturnValue({ value: '1' }),
		};
		mockCookies.mockResolvedValue(mockCookieStore);

		mockSelect.mockReturnValue({
			from: vi.fn().mockReturnThis(),
			where: vi.fn().mockReturnThis(),
			limit: vi.fn().mockRejectedValue(new Error('DB error')),
		});

		const result = await getCurrentUser();

		expect(result).toBeNull();
	});
});


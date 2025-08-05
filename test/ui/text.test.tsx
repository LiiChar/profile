import React from 'react';
import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import * as langStore from '@/stores/lang/langStore';
import { Text } from '@/components/ui/text-client';

const dictionary = {
	home: {
		title: 'Главная страница',
	},
};

describe('<Text />', () => {
	it('отображает текст по ключу', () => {
		render(<Text<typeof dictionary> text='home.title' dict={dictionary} />);
		expect(screen.getByText('Главная страница')).toBeInTheDocument();
	});
});

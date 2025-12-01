'use client';
import { env } from '@/helpers/env.client';
import { useTheme } from '@/hooks/useTheme';
import HCaptcha from '@hcaptcha/react-hcaptcha';

export const Captcha = ({ ...attr }: Omit<React.ComponentProps<typeof HCaptcha>, 'sitekey'>) => {
	const [theme] = useTheme();
	return (
		<HCaptcha
			theme={theme}
			{...attr}
			sitekey={env.NEXT_PUBLIC_HCAPTCHA_PUBLIC_KEY}
		/>
	);
};
 
import Link from 'next/link';
import { Text } from '@/components/ui/text-client';
import { Button } from '@/components/ui/button';

export default function NotFound() {
	return (
		<main id="main-content" className="min-h-screen flex items-center justify-center px-6">
			<div className="text-center space-y-6">
				<h1 className="text-6xl font-bold text-primary">
					<Text text="notFound.title" />
				</h1>
				<p className="text-lg text-muted-foreground max-w-md mx-auto">
					<Text text="notFound.description" />
				</p>
				<Link href="/">
					<Button size="lg">
						<Text text="notFound.goHome" />
					</Button>
				</Link>
			</div>
		</main>
	);
}

'use client';
import { Separator } from "@/components/ui/separator";
import { Text } from "@/components/ui/text-client";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

export const NavigationFooterLinks = () => {
    const pathname = usePathname();
  
    const pathWithoutLocale = pathname.replace(/^\/[a-z]{2}/, '') || '/';
  
    const isActive = (href: string): boolean => {
      const normalizedHref = href === '/' ? '/' : href.replace(/\/$/, '');
      if (normalizedHref === '/') {
        return pathWithoutLocale === '/' || pathWithoutLocale === '';
      }
      return (
        pathWithoutLocale.startsWith(normalizedHref + '/') ||
        pathWithoutLocale === normalizedHref
      );
    };

	return (
		<div className='text-center text-foreground/60 flex flex-row items-center justify-center text-sm'>
			<Link
				href='/resume'
				className={cn(
					'relative text-sm border-[1px] border-transparent font-medium transition-all p-1 rounded-md no-underline duration-300 hover:border-foreground',
					isActive('/resume') &&
						' border-foreground hover:bg-foreground hover:text-background'
				)}
			>
				<Text text='layout.footer.links.resume' />
			</Link>
			<Separator
				orientation='vertical'
				className={cn(
					'!w-4 !h-[1px]',
				)}
			/>
			<div className="px-1">
				© {new Date().getFullYear()} <Text text='layout.footer.text' />
			</div>
			<Separator
				orientation='vertical'
				className={cn(
					'!w-4 !h-[1px]',
				)}
			/>
			<Link
				href='/settings'
				className={cn(
					'relative text-sm border-[1px] border-transparent font-medium transition-all p-1 rounded-md no-underline duration-300 hover:border-foreground',
					isActive('/settings') &&
						' border-foreground hover:bg-foreground hover:text-background'
				)}
			>
				<Text text='layout.footer.links.settings' />
			</Link>
		</div>
	);
}
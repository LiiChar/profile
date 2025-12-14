import Link from "next/link";
import { Button } from "./button";
import { ArrowLeft } from "lucide-react";

type BackwardLinkProps = {
	href: string;
} & React.HTMLAttributes<HTMLButtonElement>;

export const BackwardLink = ({ href, ...attr }: BackwardLinkProps) => {
	return (
		<Link
			className='
          fixed
          bottom-4
					lg:translate-x-full
					lg:right-[calc(50%-384px)]
					right-4
          z-50
        '
			href={href}
		>
			<Button
				{...attr}
				variant='outline'
				className='
          p-2
					h-[36px]
					w-[36px]
        '
			>
				<ArrowLeft />
			</Button>
		</Link>
	);
};

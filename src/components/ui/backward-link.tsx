import Link from "next/link";
import { Button } from "./button";
import { ArrowLeft } from "lucide-react";

type BackwardLinkProps = {
	href: string;
} & React.HTMLAttributes<HTMLButtonElement>;

export const BackwardLink = ({href, ...attr}: BackwardLinkProps) => {
	return (
		<Button
    className={'fixed top-[66px] p-2 translate-x-[8px] translate-y-[8px] z-100'}
    variant={'outline'}
			{...attr}
		>
			<Link href={href}>
				<ArrowLeft />
			</Link>
		</Button>
	);
};
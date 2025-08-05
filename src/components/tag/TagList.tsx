import Link from "next/link";
import {Separator} from "@/components/ui/separator";
import React, {ReactNode} from "react";
import {cn} from "@/lib/utils";

type TagListProps = {
    tags: string | string[];
    limit?: number;
    separator?: ReactNode;
    prefix?: ReactNode;
    linkBase?: string;
} & React.HTMLAttributes<HTMLDivElement>;

export const TagList = ({tags, limit = tags.length, separator = <Separator orientation='vertical' />, prefix, linkBase = `/blog/tag/`, ...attr}: TagListProps) => {
    return (
        <div {...attr} className={cn('flex gap-1 text-foreground/60', attr.className)}>
            {(typeof tags == 'string' ? tags.split(',') : tags)
                .slice(0, limit)
                .map(t => t.trim())
                .filter(Boolean)
                .map((t, i, arr) => (
                    <div key={t} className='flex gap-1'>

                        <Link href={linkBase + t} className='text-nowrap'>
                            {prefix && prefix}{t}
                        </Link>
                        {i !== arr.length - 1 && (
                            <>
                                {separator}
                            </>
                        )}
                    </div>
                ))}
        </div>
    )
}
import { ProjectType } from "@/db/tables/project";
import React from "react";
import { CardBlur } from "@/components/ui/card-blur";
import { TagList } from "@/components/tag/TagList";
import SpotlightCard from "@/components/ui/card-spotlight";
import { cn } from "@/lib/utils";
import Link from "next/link";

type ProjectCardProps = {
    project: ProjectType;
    limitTag?: number;
    link?: string;
} & React.HTMLAttributes<HTMLDivElement>;

export const ProjectCard = ({ project, className, limitTag, link, ...props }: ProjectCardProps) => {
    return (
        <SpotlightCard {...props} className={cn("rounded-lg group", className)}>
            <CardBlur className={'!h-full'}>
                <h4 className="text-xl">
                    {link ? (
                        <Link href={link} passHref className={'group-hover:no-underline group-hover:text-background'}>
                            {project.title}
                        </Link>
                    ) : (
                        project.title
                    )}
                </h4>
                <p className="text-foreground/70 text-sm">
                    {project.description}
                </p>
                {project.tags && (
                    <TagList
                        limit={limitTag ?? project.tags.length}
                        className="flex gap-2 mt-4 flex-wrap text-sm text-gray-500"
                        tags={project.tags}
                        prefix="#"
                        separator=""
                    />
                )}
            </CardBlur>
        </SpotlightCard>
    );
};

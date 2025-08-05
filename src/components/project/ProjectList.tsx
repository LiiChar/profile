import {ProjectType} from "@/db/tables/project";
import {cn} from "@/lib/utils";
import {ProjectCard} from "@/components/project/ProjectCard";

type ProjectListVariant = 'grid' | 'column' | 'vertical'

const style: Record<ProjectListVariant, {
    wrapper: string;
    item: string
}> = {
    column: {
        wrapper: 'flex-col',
        item: ''
    },
    grid:{
        wrapper: 'flex-row flex-wrap gap-2',
        item: 'w-[calc(33%-8px)]'
    },
    vertical: {
        wrapper: 'flex-row',
        item: ''
    },
}

type ProjectListProps = {
    projects: ProjectType[];
    variant?: ProjectListVariant;
} & React.HTMLAttributes<HTMLDivElement>;

export const ProjectList = ({projects, variant = 'grid', ...attr}: ProjectListProps) => {
    return (
        <section {...attr} className={cn('flex', style[variant]['wrapper'], attr.className)}>
            {projects.map((project) => (
                <ProjectCard link={`/projects/${project.id}`} limitTag={2} className={cn('', style[variant]['item'])} key={project.id} project={project} />
            ))}
        </section>
    )
}
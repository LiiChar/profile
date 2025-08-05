import {db} from "@/db/db";
import {ProjectList} from "@/components/project/ProjectList";
import {Text} from "@/components/ui/text-server";

export default async function Projects() {
    const projects = await db.query.projects.findMany();
	return <main>
        <h1 className={'py-8'}>
            <Text text={'page.project.title'}/>
        </h1>
        <ProjectList projects={projects} />
    </main>;
}

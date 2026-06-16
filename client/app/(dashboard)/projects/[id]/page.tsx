import ProjectViewPageClient from "@/modules/projects/components/ProjectViewPageClient";

interface ProjectViewPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ProjectViewPage({
  params,
}: ProjectViewPageProps) {
  const { id } = await params;

  return <ProjectViewPageClient projectId={id} />;
}

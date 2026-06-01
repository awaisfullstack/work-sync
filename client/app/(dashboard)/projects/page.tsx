import ProjectsPageClient from "@/features/projects/ProjectsPageClient";
import PageHeader from "@/components/shared/PageHeader";

export default function ProjectsPage() {

  return (
    <>
      <PageHeader
        title="Projects"
        description="Manage your projects and their details here."
        href="/projects/create"
        buttonText="Add Project"
      />

      <ProjectsPageClient />
    </>
  );
}

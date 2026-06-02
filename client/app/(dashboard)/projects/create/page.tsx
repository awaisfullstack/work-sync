
import { ProjectForm } from "@/features/projects/components/ProjectForm";

export default function CreateProjectPage() {
  return (
    <section className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Create Project
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Add a new project for your team.
        </p>
      </div>

      <ProjectForm mode="create" />
    </section>
  );
}
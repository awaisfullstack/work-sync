import { DepartmentForm } from "@/features/departments/components/DepartmentForm";

export default function CreateDepartmentPage() {
  return (
    <section className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Create Department
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Add a new department for your team.
        </p>
      </div>

      <DepartmentForm mode="create" />
    </section>
  );
}

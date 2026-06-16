import { TaskForm } from "@/modules/tasks/components/TaskForm";

export default function CreateTaskPage() {
  return (
    <section className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Create Task
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Add a new task for your team.
        </p>
      </div>

      <TaskForm mode="create" />
    </section>
  );
}

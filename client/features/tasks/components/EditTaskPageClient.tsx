"use client";

import FetchByIdError from "@/components/shared/FetchByIdError";
import { isSuccessResponse } from "@/types/api-response";
import { useGetTaskByIdQuery } from "../tasksApi";
import { TaskForm } from "./TaskForm";

interface EditTaskPageClientProps {
  taskId: string;
}

export function EditTaskPageClient({ taskId }: EditTaskPageClientProps) {
  const { data, isLoading, isError } = useGetTaskByIdQuery(taskId);
  const task = isSuccessResponse(data) ? data.data : undefined;

  if (isLoading) {
    return (
      <div className="rounded-2xl border bg-white p-8 text-center text-sm text-slate-500">
        Loading task...
      </div>
    );
  }

  if (isError || !task) {
    return (
      <FetchByIdError
        title="Task not found"
        message="This task does not exist or you do not have permission to access it."
      />
    );
  }

  return (
    <section className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Edit Task
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Update task details, assignment, status, and due date.
        </p>
      </div>

      <TaskForm mode="update" task={task} />
    </section>
  );
}

"use client";

import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, FieldErrors, useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/ui/date-picker";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useGetProjectOptionsQuery } from "@/store/api/projectsApi";
import { logFrontendError } from "@/lib/logger/frontendLogger";
import { logFormValidationIssue } from "@/lib/logger/formValidationLogger";
import { formatApiError } from "@/lib/utils/formatError";
import { taskSchema, type TaskFormValues } from "@/validators/task.schema";
import { TaskStatus, type Task } from "@/types/task.types";
import {
  useCreateTaskMutation,
  useUpdateTaskMutation,
} from "@/store/api/tasksApi";
import {
  getDateInputValue,
  formatDateInputValue,
  parseDateInputValue,
} from "@/lib/utils/index";

interface TaskFormProps {
  mode: "create" | "update";
  task?: Task;
}

export function TaskForm({ mode, task }: TaskFormProps) {
  const router = useRouter();

  const { data: projectsResponse, isLoading: isProjectsLoading } =
    useGetProjectOptionsQuery();

  const [createTask, { isLoading: isCreating }] = useCreateTaskMutation();
  const [updateTask, { isLoading: isUpdating }] = useUpdateTaskMutation();

  const projects = projectsResponse?.data ?? [];

  const isSubmitting = isCreating || isUpdating;

  const {
    register,
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<TaskFormValues>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: task?.title ?? "",
      description: task?.description ?? "",
      status: task?.status.name ?? TaskStatus.TODO,
      dueDate: getDateInputValue(task?.dueDate),
      projectId: task?.projectId ?? task?.project?.id ?? "",
    },
  });

  async function onSubmit(values: TaskFormValues) {
    try {
      if (mode === "create") {
        const res = await createTask({
          title: values.title,
          description: values.description,
          dueDate: values.dueDate,
          projectId: values.projectId,
          status: values.status as TaskStatus,
        }).unwrap();

        toast.success(res.message);
      }

      if (mode === "update" && task) {
        const res = await updateTask({
          id: task.id,
          body: {
            title: values.title,
            description: values.description,
            dueDate: values.dueDate,
            status: values.status as TaskStatus,
          },
        }).unwrap();

        toast.success(res.message);
      }

      router.push("/tasks");
    } catch (error) {
      const message = formatApiError(error);
      void logFrontendError("Task form submit error", error, {
        source: "tasks.form.submit",
        metadata: {
          mode,
          taskId: task?.id ?? null,
          message,
        },
      });
      setError("root", {
        message,
      });
    }
  }

  function onInvalid(errors: FieldErrors<TaskFormValues>) {
    void logFormValidationIssue("Task", errors, "tasks.form.validation");
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit, onInvalid)}
      className="space-y-6 rounded-2xl border bg-white p-6 shadow-sm"
    >
      {errors.root?.message && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {errors.root.message}
        </div>
      )}

      <div className="grid gap-2">
        <Label htmlFor="title">Task Title</Label>
        <Input
          id="title"
          placeholder="Build dashboard statistics cards"
          disabled={isSubmitting}
          {...register("title")}
        />
        {errors.title?.message && (
          <p className="text-sm text-red-600">{errors.title.message}</p>
        )}
      </div>

      <div className="grid gap-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          rows={5}
          placeholder="Describe what needs to be completed..."
          disabled={isSubmitting}
          {...register("description")}
        />
        {errors.description?.message && (
          <p className="text-sm text-red-600">{errors.description.message}</p>
        )}
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <div className="grid w-full gap-2">
          <Label>Status</Label>
          <Controller
            name="status"
            control={control}
            render={({ field }) => (
              <Select
                value={field.value}
                onValueChange={field.onChange}
                disabled={isSubmitting}
              >
                <SelectTrigger className="w-auto" onBlur={field.onBlur}>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="TODO">Todo</SelectItem>
                  <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                  <SelectItem value="COMPLETED">Completed</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
          {errors.status?.message && (
            <p className="text-sm text-red-600">{errors.status.message}</p>
          )}
        </div>
        <div className="grid gap-2">
          <Label htmlFor="dueDate">Due Date</Label>
          <Controller
            name="dueDate"
            control={control}
            render={({ field }) => (
              <DatePicker
                value={parseDateInputValue(field.value)}
                onChange={(date) => field.onChange(formatDateInputValue(date))}
                onBlur={field.onBlur}
                disabled={isSubmitting}
                triggerClassName="w-full justify-between text-left font-normal data-[empty=true]:text-muted-foreground"
              />
            )}
          />
          {errors.dueDate?.message && (
            <p className="text-sm text-red-600">{errors.dueDate.message}</p>
          )}
        </div>
      </div>

      {mode === "create" && (
        <div className="grid w-full gap-2">
          <Label>Project</Label>
          <Controller
            name="projectId"
            control={control}
            render={({ field }) => (
              <Select
                value={field.value}
                onValueChange={field.onChange}
                disabled={isSubmitting || isProjectsLoading}
              >
                <SelectTrigger className="w-auto" onBlur={field.onBlur}>
                  <SelectValue
                    placeholder={
                      isProjectsLoading
                        ? "Loading projects..."
                        : "Select project"
                    }
                  />
                </SelectTrigger>

                <SelectContent>
                  {projects.map((project) => (
                    <SelectItem key={project.id} value={project.id}>
                      {project.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {errors.projectId?.message && (
            <p className="text-sm text-red-600">{errors.projectId.message}</p>
          )}
        </div>
      )}

      <div className="flex justify-end gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/tasks")}
        >
          Cancel
        </Button>

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting
            ? "Saving..."
            : mode === "create"
              ? "Create Task"
              : "Update Task"}
        </Button>
      </div>
    </form>
  );
}

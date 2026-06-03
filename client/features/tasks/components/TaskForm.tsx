"use client";

import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";

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
import { useGetProjectOptionsQuery } from "@/features/projects/projectsApi";
import { useGetUserOptionsQuery } from "@/features/users/usersApi";
import { formatApiError } from "@/lib/utils/formatError";
import { taskSchema, type TaskFormValues } from "@/lib/validations/task.schema";
import { isSuccessResponse } from "@/types/api-response";
import type { Task } from "../taskTypes";
import {
  useAssignTaskMutation,
  useCreateTaskMutation,
  useUnassignTaskMutation,
  useUpdateTaskMutation,
  useUpdateTaskStatusMutation,
} from "../tasksApi";

interface TaskFormProps {
  mode: "create" | "update";
  task?: Task;
}

function getDateInputValue(date?: string) {
  if (!date) return "";

  return date.split("T")[0];
}

function parseDateInputValue(value?: string) {
  if (!value) return undefined;

  const [year, month, day] = value.split("-").map(Number);

  if (!year || !month || !day) return undefined;

  return new Date(year, month - 1, day);
}

function formatDateInputValue(date?: Date) {
  if (!date) return "";

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function getAssignedUserId(task?: Task) {
  return task?.assignments?.find((assignment) => !assignment.unassignedAt)
    ?.userId;
}

export function TaskForm({ mode, task }: TaskFormProps) {
  const router = useRouter();

  const { data: projectsResponse, isLoading: isProjectsLoading } =
    useGetProjectOptionsQuery();
  const { data: usersResponse, isLoading: isUsersLoading } =
    useGetUserOptionsQuery();

  const [createTask, { isLoading: isCreating }] = useCreateTaskMutation();
  const [updateTask, { isLoading: isUpdating }] = useUpdateTaskMutation();
  const [updateTaskStatus, { isLoading: isUpdatingStatus }] =
    useUpdateTaskStatusMutation();
  const [assignTask, { isLoading: isAssigning }] = useAssignTaskMutation();
  const [unassignTask, { isLoading: isUnassigning }] =
    useUnassignTaskMutation();

  const projects = isSuccessResponse(projectsResponse)
    ? (projectsResponse.data ?? [])
    : [];
  const users = isSuccessResponse(usersResponse)
    ? (usersResponse.data ?? [])
    : [];
  const assignedUserId = getAssignedUserId(task);
  const isSubmitting =
    isCreating ||
    isUpdating ||
    isUpdatingStatus ||
    isAssigning ||
    isUnassigning;

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
      status: task?.status.name ?? "TODO",
      dueDate: getDateInputValue(task?.dueDate),
      projectId: task?.projectId ?? task?.project?.id ?? "",
      assignedUserId: assignedUserId ?? "",
    },
  });

  async function syncAssignment(taskId: string, nextUserId?: string) {
    if (assignedUserId === nextUserId) return;

    if (assignedUserId) {
      await unassignTask({ id: taskId, userId: assignedUserId }).unwrap();
    }

    if (nextUserId) {
      await assignTask({ id: taskId, userId: nextUserId }).unwrap();
    }
  }

  async function onSubmit(values: TaskFormValues) {
    try {
      if (mode === "create") {
        const response = await createTask({
          title: values.title,
          description: values.description,
          dueDate: values.dueDate,
          projectId: values.projectId,
          assignedUserId: values.assignedUserId || undefined,
        }).unwrap();

        if (values.status !== "TODO" && isSuccessResponse(response)) {
          await updateTaskStatus({
            id: response.data.id,
            status: values.status,
          }).unwrap();
        }
      }

      if (mode === "update" && task) {
        await updateTask({
          id: task.id,
          body: {
            title: values.title,
            description: values.description,
            dueDate: values.dueDate,
          },
        }).unwrap();

        if (task.status.name !== values.status) {
          await updateTaskStatus({
            id: task.id,
            status: values.status,
          }).unwrap();
        }

        await syncAssignment(task.id, values.assignedUserId || undefined);
      }

      router.push("/tasks");
    } catch (error) {
      setError("root", {
        message: formatApiError(error),
      });
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
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
          <Label>Project</Label>
          <Controller
            name="projectId"
            control={control}
            render={({ field }) => (
              <Select
                value={field.value}
                onValueChange={field.onChange}
                disabled={
                  isSubmitting || isProjectsLoading || mode === "update"
                }
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
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <div className="grid w-full gap-2">
          <Label>Assign To</Label>
          <Controller
            name="assignedUserId"
            control={control}
            render={({ field }) => (
              <Select
                value={field.value}
                onValueChange={field.onChange}
                disabled={isSubmitting || isUsersLoading}
              >
                <SelectTrigger className="w-auto" onBlur={field.onBlur}>
                  <SelectValue
                    placeholder={
                      isUsersLoading ? "Loading users..." : "Select employee"
                    }
                  />
                </SelectTrigger>

                <SelectContent>
                  {users.map((user) => (
                    <SelectItem key={user.id} value={user.id}>
                      {user.name} - {user.email}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {errors.assignedUserId?.message && (
            <p className="text-sm text-red-600">
              {errors.assignedUserId.message}
            </p>
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

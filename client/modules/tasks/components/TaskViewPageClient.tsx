"use client";

import Link from "next/link";
import { toast } from "sonner";
import {
  ArrowLeft,
  CalendarDays,
  Clock,
  Edit,
  FolderKanban,
  UserRound,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import FetchByIdError from "@/components/common/FetchByIdError";
import {
  formatDate,
  formatDateTime,
  getDeadlineStatus,
  isOverdue,
} from "@/lib/utils/formatDate";
import { formatApiError } from "@/lib/utils/formatError";

import { useGetTaskByIdQuery, useUpdateTaskStatusMutation } from "@/store/api/tasksApi";
import type { TaskStatus } from "@/types/task.types";
import { TaskCommentsCard } from "./TaskCommentsCard";
import { TaskMembersManager } from "./TaskMembersManager";
import { TaskStatusBadge } from "./TaskStatusBadge";
import { TaskViewSkeleton } from "./TaskViewSkeleton";
import { useAppSelector } from "@/store/hooks";
import { Role } from "@/types/auth.types";

interface TaskViewPageClientProps {
  taskId: string;
}

const TaskViewPageClient = ({ taskId }: TaskViewPageClientProps) => {
  const user = useAppSelector((state) => state.auth.user);
  const { data, isLoading, isFetching, isError, refetch } = useGetTaskByIdQuery(
    taskId,
    {
      skip: !taskId,
    },
  );
  const [updateTaskStatus, { isLoading: isUpdatingStatus }] =
    useUpdateTaskStatusMutation();

  const task = data?.data;

  async function handleStatusChange(status: TaskStatus) {
    if (!task || status === task.status.name) return;

    try {
      const res = await updateTaskStatus({
        id: task.id,
        status,
      }).unwrap();
      toast.success(res.message);
    } catch (error) {
      toast.error(formatApiError(error));
    }
  }

  if (isLoading || isFetching) {
    return <TaskViewSkeleton />;
  }

  if (isError || !task) {
    return (
      <FetchByIdError
        title="Task not found"
        message="The task you are trying to view does not exist or you do not have permission to access it."
        refetch={refetch}
        backLink="/tasks"
        backLinkText="Back to Tasks"
      />
    );
  }

  const overdue = isOverdue(task.dueDate, task.status.name);
  const deadlineStatus = getDeadlineStatus(task.dueDate);

  return (
    <section className="space-y-6 mb-4">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
        <div className="flex items-center gap-3">
          <Button variant="outline" size="icon" asChild>
            <Link href="/tasks">
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">Back to tasks</span>
            </Link>
          </Button>

          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Task Details
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              View full task information, members, and related work.
            </p>
          </div>
        </div>
        {user?.role === Role.ADMIN && (
          <div className="flex items-center gap-2">
            <Button variant="outline" asChild>
              <Link href={`/tasks/${task.id}/edit`}>
                <Edit className="mr-2 h-4 w-4" />
                Edit Task
              </Link>
            </Button>
          </div>
        )}
      </div>

      <Card className="rounded-2xl">
        <CardHeader>
          <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-start">
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <CardTitle className="text-2xl">{task.title}</CardTitle>
                {overdue && <Badge variant="destructive">Overdue</Badge>}
              </div>

              <p className="mt-2 max-w-3xl whitespace-pre-line text-sm leading-6 text-slate-500">
                {task.description}
              </p>
            </div>

            <TaskStatusBadge status={task.status.name} />
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <Separator />

          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-xl border bg-slate-50 p-4">
              <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
                <FolderKanban className="h-4 w-4" />
                Project
              </div>

              <p className="mt-2 text-lg font-semibold text-slate-900">
                {task.project?.title ?? "No project"}
              </p>

              <p className="mt-1 text-sm text-slate-500">Linked project</p>
            </div>

            <div className="rounded-xl border bg-slate-50 p-4">
              <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
                <UserRound className="h-4 w-4" />
                Created By
              </div>

              <p className="mt-2 text-lg font-semibold text-slate-900">
                {task.creator?.name ?? "Unassigned"}
              </p>

              <p className="mt-1 text-sm text-slate-500">
                {task.creator?.email ?? "No email available"}
              </p>
            </div>

            <div className="rounded-xl border bg-slate-50 p-4">
              <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
                <CalendarDays className="h-4 w-4" />
                Due Date
              </div>

              <p className="mt-2 text-lg font-semibold text-slate-900">
                {formatDate(task.dueDate)}
              </p>

              <p
                className={
                  deadlineStatus.variant === "danger"
                    ? "mt-1 text-sm text-red-600"
                    : deadlineStatus.variant === "warning"
                      ? "mt-1 text-sm text-amber-600"
                      : "mt-1 text-sm text-slate-500"
                }
              >
                {deadlineStatus.label}
              </p>
            </div>

            <div className="rounded-xl border bg-slate-50 p-4">
              <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
                <Clock className="h-4 w-4" />
                Status
              </div>

              <div className="mt-2">
                <Select
                  value={task.status.name}
                  onValueChange={(value) =>
                    handleStatusChange(value as TaskStatus)
                  }
                  disabled={isUpdatingStatus}
                >
                  <SelectTrigger className="w-full bg-white">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectItem value="TODO">Todo</SelectItem>
                    <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                    <SelectItem value="COMPLETED">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <p className="mt-1 text-sm text-slate-500">
                Updated {formatDateTime(task.updatedAt)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-6">
        <TaskCommentsCard taskId={task.id} />
      </div>

      <TaskMembersManager task={task} />
    </section>
  );
};

export default TaskViewPageClient;

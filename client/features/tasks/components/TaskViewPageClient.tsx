"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
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
import { Separator } from "@/components/ui/separator";
import { useGetTaskByIdQuery } from "../tasksApi";
import { isSuccessResponse } from "@/types/api-response";
import { TaskViewSkeleton } from "./TaskViewSkeleton";
import FetchByIdError from "@/components/shared/FetchByIdError";
import { formatDate, formatDateTime, isOverdue } from "@/lib/utils/formatDate";
import { TaskStatusBadge } from "./TaskStatusBadge";
import { TaskCommentsCard } from "./TaskCommentsCard";
import { TaskMembersManager } from "./TaskMembersManager";

interface TaskViewPageClientProps {
  taskId: string;
}
const TaskViewPageClient = ({ taskId }: TaskViewPageClientProps) => {
  const router = useRouter();

  const { data, isLoading, isFetching, isError, refetch } = useGetTaskByIdQuery(
    taskId,
    {
      skip: !taskId,
    },
  );

  const task = isSuccessResponse(data) && data?.data;

  if (isLoading || isFetching) {
    return <TaskViewSkeleton />;
  }

  if (isError || !task) {
    return (
      <FetchByIdError
        title="Task not found"
        message="The task you are trying to view does not exist or you do not have
              permission to access it."
        refetch={refetch}
        backLink="/tasks"
        backLinkText="Back to Tasks"
      />
    );
  }

  const overdue = isOverdue(task.dueDate, task.status.name);
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

        <div className="flex items-center gap-2">
          <Button variant="outline" asChild>
            <Link href={`/tasks/${task.id}/edit`}>
              <Edit className="mr-2 h-4 w-4" />
              Edit Task
            </Link>
          </Button>
        </div>
      </div>
      <Card>
        {/*  <CardHeader>
              <CardTitle>Description</CardTitle>
            </CardHeader> */}

        <CardContent>
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-2xl font-bold tracking-tight">
                {task.title}
              </h1>

              <TaskStatusBadge status={task.status.name} />

              {overdue && <Badge variant="destructive">Overdue</Badge>}
            </div>

            <p className="mt-2 text-sm text-muted-foreground">
              Created on {formatDateTime(task.createdAt)} · Last updated{" "}
              {formatDateTime(task.updatedAt)}
            </p>
          </div>
          <p className="whitespace-pre-line text-sm leading-7 mt-2">
            {task.description}
          </p>
        </CardContent>
      </Card>

      <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
        <div className="space-y-6">
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                  <FolderKanban className="h-4 w-4" />
                  Project
                </CardTitle>
              </CardHeader>

              <CardContent>
                <p className="font-semibold">
                  {task.project?.title ?? "No project"}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                  <UserRound className="h-4 w-4" />
                  Created By
                </CardTitle>
              </CardHeader>

              <CardContent>
                <p className="font-semibold">
                  {task.creator?.name ?? "Unassigned"}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                  <CalendarDays className="h-4 w-4" />
                  Due Date
                </CardTitle>
              </CardHeader>

              <CardContent>
                <p
                  className={
                    overdue ? "font-semibold text-red-600" : "font-semibold"
                  }
                >
                  {formatDate(task.dueDate)}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  Status
                </CardTitle>
              </CardHeader>

              <CardContent>
                <TaskStatusBadge status={task.status.name} />
              </CardContent>
            </Card>
          </div>

          <TaskCommentsCard taskId={task.id} />
        </div>

        <aside className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Status History</CardTitle>
            </CardHeader>

            <CardContent>
              {task.statusHistory && task.statusHistory.length > 0 ? (
                <div className="space-y-4">
                  {task.statusHistory.map((history) => (
                    <div key={history.id} className="relative border-l pl-4">
                      <div className="absolute -left-[5px] top-1 h-2.5 w-2.5 rounded-full bg-slate-900" />

                      <TaskStatusBadge status={history.status} />

                      <p className="mt-1 text-xs text-muted-foreground">
                        {formatDateTime(history.createdAt)}
                      </p>

                      {history.changedBy?.name && (
                        <p className="mt-1 text-xs text-muted-foreground">
                          Changed by {history.changedBy.name}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  No status history available.
                </p>
              )}
            </CardContent>
          </Card>

          <TaskMembersManager task={task} />
        </aside>
      </div>
    </section>
  );
};

export default TaskViewPageClient;

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="space-y-1">
      <p className="break-all font-medium text-slate-800">
        {label}
      </p>

      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{value}</p>
    </div>
  );
}

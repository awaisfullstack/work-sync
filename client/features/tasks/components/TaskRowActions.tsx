"use client";

import Link from "next/link";
import { MoreHorizontal, Pencil, Eye, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Task } from "../taskTypes";
import { useDeleteTaskMutation } from "../tasksApi";
import { toast } from "sonner";
import { useAppSelector } from "@/store/hooks";
import { Role } from "@/constants";

interface TaskRowActionsProps {
  task: Task;
}

export function TaskRowActions({ task }: TaskRowActionsProps) {
  const user = useAppSelector((state) => state.auth.user);
  const router = useRouter();
  const [deleteTask, { isLoading }] = useDeleteTaskMutation();

  async function handleDelete() {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${task.title}"?`,
    );

    if (!confirmed) return;
    try {
      await deleteTask(task.id).unwrap();
      router.refresh();
      toast.success("Task deleted successfully");
    } catch {
      toast.error("Failed to delete task");
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <MoreHorizontal className="h-4 w-4" />
          <span className="sr-only">Open task actions</span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-44">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuItem asChild>
          <Link href={`/tasks/${task.id}`} className="cursor-pointer">
            <Eye className="mr-2 h-4 w-4" />
            View
          </Link>
        </DropdownMenuItem>
        {user?.role === Role.ADMIN && (
          <>
            <DropdownMenuItem asChild>
              <Link href={`/tasks/${task.id}/edit`} className="cursor-pointer">
                <Pencil className="mr-2 h-4 w-4" />
                Edit
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />

            <DropdownMenuItem
              disabled={isLoading}
              onClick={handleDelete}
              className="cursor-pointer text-red-600 focus:text-red-600"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

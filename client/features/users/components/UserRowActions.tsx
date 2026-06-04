"use client";

import Link from "next/link";
import { Eye, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Role } from "@/constants";
import { useAppSelector } from "@/store/hooks";
import { useDeleteUserMutation } from "../usersApi";
import type { User } from "../userTypes";

interface UserRowActionsProps {
  user: User;
}

export function UserRowActions({ user }: UserRowActionsProps) {
  const currentUser = useAppSelector((state) => state.auth.user);
  const router = useRouter();
  const [deleteUser, { isLoading }] = useDeleteUserMutation();
  const isCurrentUser = currentUser?.id === user.id;

  async function handleDelete() {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${user.name}"?`,
    );

    if (!confirmed) return;

    try {
      await deleteUser(user.id).unwrap();
      router.refresh();
      toast.success("User deleted successfully");
    } catch {
      toast.error("Failed to delete user");
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <MoreHorizontal className="h-4 w-4" />
          <span className="sr-only">Open user actions</span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-44">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuItem asChild>
          <Link href={`/users/${user.id}`} className="cursor-pointer">
            <Eye className="mr-2 h-4 w-4" />
            View
          </Link>
        </DropdownMenuItem>

        {currentUser?.role === Role.ADMIN && (
          <>
            <DropdownMenuItem asChild>
              <Link href={`/users/${user.id}/edit`} className="cursor-pointer">
                <Pencil className="mr-2 h-4 w-4" />
                Edit
              </Link>
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem
              disabled={isLoading || isCurrentUser}
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

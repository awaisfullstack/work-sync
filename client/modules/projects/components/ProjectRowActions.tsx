"use client";

import { useState } from "react";
import Link from "next/link";
import { MoreHorizontal, Archive, Pencil, Eye } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Project } from "@/types/project.types";
import { useArchiveProjectMutation } from "@/store/api/projectsApi";
import { useAppSelector } from "@/store/hooks";
import { Role } from "@/types/auth.types";
import { formatApiError } from "@/lib/utils/formatError";

interface ProjectRowActionsProps {
  project: Project;
}

export function ProjectRowActions({ project }: ProjectRowActionsProps) {
  const user = useAppSelector((state) => state.auth.user);
  const router = useRouter();
  const [archiveProject, { isLoading }] = useArchiveProjectMutation();
  const [archiveDialogOpen, setArchiveDialogOpen] = useState(false);

  async function handleArchive() {
    try {
      await archiveProject(project.id).unwrap();
      router.refresh();
      toast.success("Project archived successfully");
    } catch (error) {
      toast.error(formatApiError(error));
    }
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <MoreHorizontal className="h-4 w-4" />
            <span className="sr-only">Open project actions</span>
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-44">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>

          <DropdownMenuSeparator />

          <DropdownMenuItem asChild>
            <Link href={`/projects/${project.id}`} className="cursor-pointer">
              <Eye className="mr-2 h-4 w-4" />
              View
            </Link>
          </DropdownMenuItem>
          {user?.role === Role.ADMIN && (
            <>
              <DropdownMenuItem asChild>
                <Link
                  href={`/projects/${project.id}/edit`}
                  className="cursor-pointer"
                >
                  <Pencil className="mr-2 h-4 w-4" />
                  Edit
                </Link>
              </DropdownMenuItem>

              {project.status !== "ARCHIVED" && (
                <>
                  <DropdownMenuSeparator />

                  <DropdownMenuItem
                    disabled={isLoading}
                    onSelect={() => setArchiveDialogOpen(true)}
                    className="cursor-pointer text-red-600 focus:text-red-600"
                  >
                    <Archive className="mr-2 h-4 w-4" />
                    Archive
                  </DropdownMenuItem>
                </>
              )}
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog
        open={archiveDialogOpen}
        onOpenChange={setArchiveDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Archive project?</AlertDialogTitle>
            <AlertDialogDescription>
              {`This will archive "${project.title}" and move it out of active project work.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              disabled={isLoading}
              onClick={handleArchive}
              className="bg-destructive/10 text-destructive hover:bg-destructive/20 focus-visible:border-destructive/40 focus-visible:ring-destructive/20"
            >
              Archive
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

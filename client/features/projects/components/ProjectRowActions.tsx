
"use client";

import Link from "next/link";
import { MoreHorizontal, Archive, Pencil, Eye } from "lucide-react";
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
import { Project } from "../projectTypes";
import { useArchiveProjectMutation } from "../projectsApi";

interface ProjectRowActionsProps {
  project: Project;
}

export function ProjectRowActions({ project }: ProjectRowActionsProps) {
  const router = useRouter();
  const [archiveProject, { isLoading }] = useArchiveProjectMutation();

  async function handleArchive() {
    const confirmed = window.confirm(
      `Are you sure you want to archive "${project.title}"?`
    );

    if (!confirmed) return;

    await archiveProject(project.id).unwrap();
    router.refresh();
  }

  return (
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
              onClick={handleArchive}
              className="cursor-pointer text-red-600 focus:text-red-600"
            >
              <Archive className="mr-2 h-4 w-4" />
              Archive
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
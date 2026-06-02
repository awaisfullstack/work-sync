"use client";

import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Project } from "../projectTypes";
import { useCreateProjectMutation, useUpdateProjectMutation } from "../projectsApi";
import { ProjectFormValues, projectSchema } from "@/lib/validations/project.schema";
import { formatApiError } from "@/lib/utils/formatError";
import { Textarea } from "@/components/ui/textarea";
import { DatePicker } from "@/components/ui/date-picker";

interface ProjectFormProps {
  mode: "create" | "update";
  project?: Project;
}

function getDateInputValue(date?: string) {
  if (!date) return "";
  return new Date(date).toISOString().split("T")[0];
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

export function ProjectForm({ mode, project }: ProjectFormProps) {
  const router = useRouter();

  const [createProject, { isLoading: isCreating }] =
    useCreateProjectMutation();

  const [updateProject, { isLoading: isUpdating }] =
    useUpdateProjectMutation();

  const isSubmitting = isCreating || isUpdating;

  const {
    register,
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      title: project?.title ?? "",
      description: project?.description ?? "",
      status: project?.status ?? "ACTIVE",
      deadline: getDateInputValue(project?.deadline),
    },
  });

  async function onSubmit(values: ProjectFormValues) {
    try {
      if (mode === "create") {
        await createProject(values).unwrap();
      }

      if (mode === "update" && project) {
        await updateProject({
          id: project.id,
          body: values,
        }).unwrap();
      }

      router.push("/projects");
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
        <Label htmlFor="title">Project Title</Label>
        <Input
          id="title"
          placeholder="Website Redesign"
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
          placeholder="Write project description..."
          {...register("description")}
        />
        {errors.description?.message && (
          <p className="text-sm text-red-600">
            {errors.description.message}
          </p>
        )}
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <div className="grid w-full gap-2">
          <Label>Status</Label>

          <Controller
            name="status"
            control={control}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger className="w-auto" onBlur={field.onBlur}>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="ACTIVE">Active</SelectItem>
                  <SelectItem value="COMPLETED">Completed</SelectItem>
                  <SelectItem value="ARCHIVED">Archived</SelectItem>
                </SelectContent>
              </Select>
            )}
          />

          {errors.status?.message && (
            <p className="text-sm text-red-600">{errors.status.message}</p>
          )}
        </div>

        <div className="grid gap-2">
          <Label htmlFor="deadline">Deadline</Label>
          <Controller
            name="deadline"
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
          {errors.deadline?.message && (
            <p className="text-sm text-red-600">
              {errors.deadline.message}
            </p>
          )}
        </div>
      </div>

      <div className="flex justify-end gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/projects")}
        >
          Cancel
        </Button>

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting
            ? "Saving..."
            : mode === "create"
              ? "Create Project"
              : "Update Project"}
        </Button>
      </div>
    </form>
  );
}

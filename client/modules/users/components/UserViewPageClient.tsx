"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { toast } from "sonner";
import {
  ArrowLeft,
  Building2,
  CalendarDays,
  Clock,
  FolderKanban,
  Mail,
  Pencil,
  ShieldCheck,
  UserCheck,
  UserX,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import FetchByIdError from "@/components/common/FetchByIdError";
import { formatDate } from "@/lib/utils/formatDate";
import { formatEnumLabel } from "@/lib/utils/label";
import { formatApiError } from "@/lib/utils/formatError";
import { Role } from "@/types/auth.types";
import { useAppSelector } from "@/store/hooks";

import {
  useActivateUserMutation,
  useDeactivateUserMutation,
  useGetUserByIdQuery,
} from "@/store/api/usersApi";
import { RoleBadge } from "./RoleBadge";
import { UserStatusBadge } from "./UserStatusBadge";
import { UserViewSkeleton } from "./UserViewSkeleton";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface UserViewPageClientProps {
  userId: string;
}

export default function UserViewPageClient({
  userId,
}: UserViewPageClientProps) {
  const currentUser = useAppSelector((state) => state.auth.user);
  const { data, isLoading, isFetching, isError, refetch } = useGetUserByIdQuery(
    userId,
    {
      skip: !userId,
    },
  );
  const [activateUser, { isLoading: isActivating }] =
    useActivateUserMutation();
  const [deactivateUser, { isLoading: isDeactivating }] =
    useDeactivateUserMutation();

  const user = data?.data;

  if (isLoading || isFetching) {
    return <UserViewSkeleton />;
  }

  if (isError || !user) {
    return (
      <FetchByIdError
        title="User not found"
        message="This user does not exist or you do not have permission to access it."
        refetch={refetch}
        backLink="/users"
        backLinkText="Back to users"
      />
    );
  }

  const selectedUser = user;
  const isAdmin = currentUser?.role === Role.ADMIN;
  const isCurrentUser = currentUser?.id === selectedUser.id;
  const isStatusSubmitting = isActivating || isDeactivating;
  const statusAction = selectedUser.isActive ? "deactivate" : "activate";
  const projectMemberships = selectedUser.projectMemberships ?? [];

  async function handleStatusChange() {
    try {
      if (selectedUser.isActive) {
        const res = await deactivateUser(selectedUser.id).unwrap();
        toast.success(res.message);
      } else {
        const res = await activateUser(selectedUser.id).unwrap();
        toast.success(res.message);
      }
    } catch (error) {
      toast.error(formatApiError(error));
    }
  }

  return (
    <section className="space-y-6">
      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
        <div className="flex items-center gap-3">
          <Button variant="outline" size="icon" asChild>
            <Link href="/users">
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">Back to users</span>
            </Link>
          </Button>

          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              User Details
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              View account information, role, department, and status.
            </p>
          </div>
        </div>

        {isAdmin && (
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <Button variant="outline" asChild>
              <Link href={`/users/${selectedUser.id}/edit`}>
                <Pencil className="mr-2 h-4 w-4" />
                Edit User
              </Link>
            </Button>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant={selectedUser.isActive ? "destructive" : "default"}
                  disabled={isStatusSubmitting || isCurrentUser}
                >
                  {selectedUser.isActive ? (
                    <UserX className="mr-2 h-4 w-4" />
                  ) : (
                    <UserCheck className="mr-2 h-4 w-4" />
                  )}
                  {isStatusSubmitting
                    ? "Saving..."
                    : selectedUser.isActive
                      ? "Deactivate"
                      : "Activate"}
                </Button>
              </AlertDialogTrigger>

              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    {selectedUser.isActive ? "Deactivate" : "Activate"} user?
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    {`This will ${statusAction} "${selectedUser.name}".`}
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    disabled={isStatusSubmitting}
                    onClick={handleStatusChange}
                    className={
                      selectedUser.isActive
                        ? "bg-destructive/10 text-destructive hover:bg-destructive/20 focus-visible:border-destructive/40 focus-visible:ring-destructive/20"
                        : undefined
                    }
                  >
                    {selectedUser.isActive ? "Deactivate" : "Activate"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        )}
      </div>

      <Card className="rounded-2xl">
        <CardHeader>
          <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-start">
            <div className="flex items-center gap-4">
              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <CardTitle className="text-2xl">
                    {selectedUser.name}
                  </CardTitle>
                  <RoleBadge role={selectedUser.role} />
                  <UserStatusBadge isActive={selectedUser.isActive} />
                </div>

                <p className="mt-2 flex items-center gap-2 text-sm text-slate-500">
                  <Mail className="h-4 w-4" />
                  {selectedUser.email}
                </p>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <Separator />

          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            <DetailTile
              icon={<ShieldCheck className="h-4 w-4" />}
              label="Role"
              value={selectedUser.role === "ADMIN" ? "Admin" : "Employee"}
            />

            <DetailTile
              icon={<Building2 className="h-4 w-4" />}
              label="Department"
              value={selectedUser.department?.name ?? "No department"}
            />

            <DetailTile
              icon={<CalendarDays className="h-4 w-4" />}
              label="Created"
              value={formatDate(selectedUser.createdAt)}
            />

            <DetailTile
              icon={<Clock className="h-4 w-4" />}
              label="Last Updated"
              value={formatDate(selectedUser.updatedAt)}
            />
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-2xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FolderKanban className="h-5 w-5" />
            Projects
          </CardTitle>
        </CardHeader>

        <CardContent>
          {projectMemberships.length === 0 ? (
            <div className="rounded-xl border border-dashed p-6 text-center">
              <p className="font-medium text-slate-900">
                No projects assigned
              </p>
              <p className="mt-1 text-sm text-slate-500">
                This user is not a member of any project yet.
              </p>
            </div>
          ) : (
            <div className="grid gap-3">
              {projectMemberships.map((membership) => (
                <Link
                  key={membership.id}
                  href={`/projects/${membership.project.id}`}
                  className="flex flex-col gap-3 rounded-xl border p-4 transition-colors hover:bg-slate-50 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="min-w-0">
                    <p className="truncate font-medium text-slate-900">
                      {membership.project.title}
                    </p>
                    <p className="mt-1 text-sm text-slate-500">
                      Joined {formatDate(membership.joinedAt)}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary">
                      {formatEnumLabel(membership.roleInProject)}
                    </Badge>
                    <Badge variant="outline">
                      {formatEnumLabel(membership.project.status)}
                    </Badge>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

    </section>
  );
}

function DetailTile({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: ReactNode;
}) {
  return (
    <div className="rounded-xl border bg-slate-50 p-4">
      <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
        {icon}
        {label}
      </div>

      <p className="mt-2 break-words text-lg font-semibold text-slate-900">
        {value}
      </p>
    </div>
  );
}

"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { toast } from "sonner";
import {
  ArrowLeft,
  Building2,
  CalendarDays,
  Clock,
  KeyRound,
  Mail,
  Pencil,
  ShieldCheck,
  UserCheck,
  UserX,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import FetchByIdError from "@/components/shared/FetchByIdError";
import { formatDate, formatDateTime } from "@/lib/utils/formatDate";
import { formatApiError } from "@/lib/utils/formatError";
import { isSuccessResponse } from "@/types/api-response";
import { Role } from "@/constants";
import { useAppSelector } from "@/store/hooks";

import {
  useActivateUserMutation,
  useDeactivateUserMutation,
  useGetUserByIdQuery,
} from "@/features/users/usersApi";
import { UserRoleBadge } from "./UserRoleBadge";
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

  const user = isSuccessResponse(data) ? data.data : undefined;

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

  async function handleStatusChange() {
    try {
      if (selectedUser.isActive) {
        await deactivateUser(selectedUser.id).unwrap();
        toast.success("User deactivated successfully");
      } else {
        await activateUser(selectedUser.id).unwrap();
        toast.success("User activated successfully");
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
                  <UserRoleBadge role={selectedUser.role} />
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

      <Card>
        <CardHeader>
          <CardTitle>Account Information</CardTitle>
        </CardHeader>

        <CardContent className="flex flex-col gap-4 text-sm">
          <InfoRow
            label="User ID"
            value={selectedUser.id}
            icon={<KeyRound className="h-4 w-4" />}
          />
          <InfoRow
            label="Department ID"
            value={selectedUser.departmentId ?? "N/A"}
            icon={<Building2 className="h-4 w-4" />}
          />
          <Separator />
          <InfoRow
            label="Created At"
            value={formatDateTime(selectedUser.createdAt)}
            icon={<CalendarDays className="h-4 w-4" />}
          />
          <InfoRow
            label="Updated At"
            value={formatDateTime(selectedUser.updatedAt)}
            icon={<Clock className="h-4 w-4" />}
          />
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

function InfoRow({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1">
      <p className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {icon}
        {label}
      </p>

      <p className="break-all font-medium text-slate-800">{value}</p>
    </div>
  );
}

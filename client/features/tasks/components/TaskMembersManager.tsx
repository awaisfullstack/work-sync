"use client";

import { useMemo, useState } from "react";
import { Check, ChevronsUpDown, Trash2, UserPlus } from "lucide-react";
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
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { useAppSelector } from "@/store/hooks";
import { canManageProjectMembers } from "@/lib/auth/permissions";

import { useGetUserOptionsQuery } from "@/features/users/usersApi";
import { formatApiError } from "@/lib/utils/formatError";
import { cn } from "@/lib/utils";
import { Task } from "../taskTypes";
import { useAssignTaskMutation, useUnassignTaskMutation } from "../tasksApi";
import { getInitials } from "@/lib/utils/index";

interface TaskMembersManagerProps {
  task: Task;
}

export function TaskMembersManager({ task }: TaskMembersManagerProps) {
  const currentUser = useAppSelector((state) => state.auth.user);
  const canManage = canManageProjectMembers(currentUser);

  const [open, setOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState("");
  const [memberToRemove, setMemberToRemove] = useState<{
    userId: string;
    name?: string;
  } | null>(null);
  const [error, setError] = useState("");

  const { data: usersResponse, isLoading: isUsersLoading } =
    useGetUserOptionsQuery(undefined, {
      skip: !canManage,
    });

  const [assignTaskMember, { isLoading: isAssigning }] =
    useAssignTaskMutation();

  const [unassignTaskMember, { isLoading: isRemoving }] =
    useUnassignTaskMutation();

  const members = useMemo(() => task.assignments ?? [], [task.assignments]);

  const assignedUserIds = useMemo(() => {
    return new Set(members.map((member) => member.userId));
  }, [members]);

  const assignableUsers = useMemo(() => {
    const users = usersResponse?.data ?? [];

    return users.filter((user) => !assignedUserIds.has(user.id));
  }, [usersResponse, assignedUserIds]);

  const selectedUser = assignableUsers.find(
    (user) => user.id === selectedUserId,
  );

  async function handleAssignMember() {
    if (!selectedUserId) return;

    setError("");

    try {
      const res = await assignTaskMember({
        id: task.id,
        userId: selectedUserId,
      }).unwrap();

      setSelectedUserId("");
      setOpen(false);
      toast.success(res.message);
    } catch (error) {
      const message = formatApiError(error);
      setError(message);
    }
  }

  async function handleRemoveMember() {
    if (!memberToRemove) return;

    setError("");

    try {
     const res = await unassignTaskMember({
        id: task.id,
        userId: memberToRemove.userId,
      }).unwrap();
      setMemberToRemove(null);
      toast.success(res.message);
    } catch (error) {
      const message = formatApiError(error);
      setError(message);
    }
  }

  return (
    <Card className="rounded-2xl">
      <CardHeader>
        <div className="flex flex-col justify-between gap-4 xl:flex-row xl:items-center">
          <div>
            <CardTitle>Task Assignments</CardTitle>
            <p className="mt-1 text-sm text-slate-500">
              {members.length} {members.length === 1 ? "member" : "members"}{" "}
              assigned to this task.
            </p>
          </div>

          {canManage && (
            <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    className="w-full justify-between sm:w-[260px]"
                    disabled={isUsersLoading}
                  >
                    {selectedUser
                      ? selectedUser.name
                      : isUsersLoading
                        ? "Loading users..."
                        : "Select employee"}

                    <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
                  </Button>
                </PopoverTrigger>

                <PopoverContent className="w-[300px] p-0" align="end">
                  <Command className="">
                    <CommandInput placeholder="Search employee..." />

                    <CommandList
                      style={{
                        maxHeight:
                          "max(8rem, min(16rem, calc(var(--radix-popover-content-available-height, 20rem) - 3.5rem)))",
                      }}
                    >
                      <CommandEmpty>No employee found.</CommandEmpty>

                      <CommandGroup>
                        {assignableUsers.map((user) => (
                          <CommandItem
                            key={user.id}
                            value={`${user.name} ${user.email}`}
                            onSelect={() => {
                              setSelectedUserId(user.id);
                              setOpen(false);
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                selectedUserId === user.id
                                  ? "opacity-100"
                                  : "opacity-0",
                              )}
                            />

                            <div>
                              <p className="font-medium">{user.name}</p>
                              <p className="text-xs text-slate-500">
                                {user.email}
                              </p>
                            </div>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>

              <Button
                onClick={handleAssignMember}
                disabled={!selectedUserId || isAssigning}
              >
                <UserPlus className="mr-2 h-4 w-4" />
                {isAssigning ? "Assigning..." : "Assign"}
              </Button>
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent>
        {error && (
          <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        {members.length === 0 ? (
          <div className="rounded-xl border border-dashed p-8 text-center">
            <h3 className="font-semibold text-slate-900">
              No members assigned
            </h3>
            <p className="mt-1 text-sm text-slate-500">
              Assign employees to this task to start collaboration.
            </p>
          </div>
        ) : (
          <div className="grid gap-3">
            {members.map((member) => (
              <div
                key={member.id}
                className="flex items-center justify-between gap-4 rounded-xl border p-3"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <Avatar>
                    <AvatarFallback>
                      {getInitials(member.user?.name)}
                    </AvatarFallback>
                  </Avatar>

                  <div className="min-w-0">
                    <p className="truncate font-medium text-slate-900">
                      {member.user?.name ?? "Unknown User"}
                    </p>

                    <p className="truncate text-sm text-slate-500">
                      {member.user?.email ?? member.userId}
                    </p>
                  </div>
                </div>

                {canManage && (
                  <Button
                    variant="ghost"
                    size="icon"
                    disabled={isRemoving}
                    onClick={() =>
                      setMemberToRemove({
                        userId: member.userId,
                        name: member.user?.name,
                      })
                    }
                    className="text-red-600 hover:bg-red-50 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                    <span className="sr-only">Remove member</span>
                  </Button>
                )}
              </div>
            ))}
          </div>
        )}

        {!canManage && (
          <p className="mt-4 text-sm text-slate-500">
            Only admins can assign or unassign task members.
          </p>
        )}

        <AlertDialog
          open={!!memberToRemove}
          onOpenChange={(open) => {
            if (!open) setMemberToRemove(null);
          }}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Remove task member?</AlertDialogTitle>
              <AlertDialogDescription>
                This will remove {memberToRemove?.name ?? "this user"} from this
                task.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                disabled={isRemoving}
                onClick={handleRemoveMember}
                className="bg-destructive/10 text-destructive hover:bg-destructive/20 focus-visible:border-destructive/40 focus-visible:ring-destructive/20"
              >
                Remove
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardContent>
    </Card>
  );
}

"use client";

import { useMemo, useState } from "react";
import { Check, ChevronsUpDown, Trash2, UserPlus } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { useAppSelector } from "@/store/hooks";
import { canManageProjectMembers } from "@/lib/auth/permissions";

import {
  useAssignProjectMemberMutation,
  useRemoveProjectMemberMutation,
} from "../projectsApi";
import type { Project } from "../projectTypes";
import { useGetUserOptionsQuery } from "@/features/users/usersApi";
import { formatApiError } from "@/lib/utils/formatError";
import { cn } from "@/lib/utils";
import { isSuccessResponse } from "@/types/api-response";

interface ProjectMembersManagerProps {
  project: Project;
}

function getInitials(name?: string) {
  if (!name) return "U";

  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function ProjectMembersManager({ project }: ProjectMembersManagerProps) {
  const currentUser = useAppSelector((state) => state.auth.user);
  const canManage = canManageProjectMembers(currentUser);

  const [open, setOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState("");
  const [error, setError] = useState("");

  const { data: usersResponse, isLoading: isUsersLoading } =
    useGetUserOptionsQuery(undefined, {
      skip: !canManage,
    });

  const [assignProjectMember, { isLoading: isAssigning }] =
    useAssignProjectMemberMutation();

  const [removeProjectMember, { isLoading: isRemoving }] =
    useRemoveProjectMemberMutation();

  const members = useMemo(() => project.members ?? [], [project.members]);

  const assignedUserIds = useMemo(() => {
    return new Set(members.map((member) => member.userId));
  }, [members]);

  const assignableUsers = useMemo(() => {
    const users = isSuccessResponse(usersResponse) ? usersResponse.data : [];

    return users.filter((user) => !assignedUserIds.has(user.id));
  }, [usersResponse, assignedUserIds]);

  const selectedUser = assignableUsers.find(
    (user) => user.id === selectedUserId
  );

  async function handleAssignMember() {
    if (!selectedUserId) return;

    setError("");

    try {
      await assignProjectMember({
        projectId: project.id,
        userId: selectedUserId,
      }).unwrap();

      setSelectedUserId("");
      setOpen(false);
    } catch (error) {
      setError(formatApiError(error));
    }
  }

  async function handleRemoveMember(userId: string, name?: string) {
    const confirmed = window.confirm(
      `Remove ${name ?? "this user"} from this project?`
    );

    if (!confirmed) return;

    setError("");

    try {
      await removeProjectMember({
        projectId: project.id,
        userId,
      }).unwrap();
    } catch (error) {
      setError(formatApiError(error));
    }
  }

  return (
    <Card className="rounded-2xl">
      <CardHeader>
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <CardTitle>Project Members</CardTitle>
            <p className="mt-1 text-sm text-slate-500">
              {members.length} {members.length === 1 ? "member" : "members"}{" "}
              assigned to this project.
            </p>
          </div>

          {canManage && (
            <div className="flex flex-col gap-2 sm:flex-row">
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

                <PopoverContent className="max-h-64 overflow-y-auto w-[300px] p-0" align="end">
                  <Command className="">
                    <CommandInput placeholder="Search employee..." />

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
                                : "opacity-0"
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
              Assign employees to this project to start collaboration.
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

                    {member.user?.department?.name && (
                      <p className="text-xs text-slate-400">
                        {member.user.department.name}
                      </p>
                    )}
                  </div>
                </div>

                {canManage && (
                  <Button
                    variant="ghost"
                    size="icon"
                    disabled={isRemoving}
                    onClick={() =>
                      handleRemoveMember(member.userId, member.user?.name)
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
            Only admins can assign or remove project members.
          </p>
        )}
      </CardContent>
    </Card>
  );
}

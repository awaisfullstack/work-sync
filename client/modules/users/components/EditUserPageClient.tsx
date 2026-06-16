"use client";

import FetchByIdError from "@/components/common/FetchByIdError";
import { useGetUserByIdQuery } from "@/store/api/usersApi";
import { UserForm } from "./UserForm";

interface EditUserPageClientProps {
  userId: string;
}

export function EditUserPageClient({ userId }: EditUserPageClientProps) {
  const { data, isLoading, isError } = useGetUserByIdQuery(userId);
  const user = data?.data;

  if (isLoading) {
    return (
      <div className="rounded-2xl border bg-white p-8 text-center text-sm text-slate-500">
        Loading user...
      </div>
    );
  }

  if (isError || !user) {
    return (
      <FetchByIdError
        title="User not found"
        message="This user does not exist or you do not have permission to access it."
      />
    );
  }

  return (
    <section className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Edit User
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Update user profile, role, and department.
        </p>
      </div>

      <UserForm mode="update" user={user} />
    </section>
  );
}

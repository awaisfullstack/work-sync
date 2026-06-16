import { UserForm } from "@/modules/users/components/UserForm";

export default function CreateUserPage() {
  return (
    <section className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Create User
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Add a new user for your team.
        </p>
      </div>

      <UserForm mode="create" />
    </section>
  );
}

import PageHeader from "@/components/shared/PageHeader";
import UsersPageClient from "@/features/users/components/UsersPageClient";

export default function UsersPage() {
  return (
    <>
      <PageHeader
        title="Users"
        description="Manage your users and their details here."
        href="/users/create"
        buttonText="Add User"
      />

      <UsersPageClient />
    </>
  );
}

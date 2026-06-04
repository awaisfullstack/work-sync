import PageHeader from "@/components/shared/PageHeader";
import DepartmentsPageClient from "@/features/departments/components/DepartmentsPageClient";

export default function DepartmentsPage() {
  return (
    <>
      <PageHeader
        title="Departments"
        description="Manage your departments and their details here."
        href="/departments/create"
        buttonText="Add Department"
      />

      <DepartmentsPageClient />
    </>
  );
}

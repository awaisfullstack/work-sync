import PageHeader from "@/components/common/PageHeader";
import DepartmentsPageClient from "@/modules/departments/components/DepartmentsPageClient";

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

import { EditDepartmentPageClient } from "@/features/departments/components/EditDepartmentPageClient";

interface EditDepartmentPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditDepartmentPage({
  params,
}: EditDepartmentPageProps) {
  const { id } = await params;

  return <EditDepartmentPageClient departmentId={id} />;
}

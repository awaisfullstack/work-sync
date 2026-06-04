import DepartmentViewPageClient from "@/features/departments/components/DepartmentViewPageClient";

interface DepartmentViewPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function DepartmentViewPage({
  params,
}: DepartmentViewPageProps) {
  const { id } = await params;

  return <DepartmentViewPageClient departmentId={id} />;
}

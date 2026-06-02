
import { EditProjectPageClient } from "@/features/projects/components/EditProjectPageClient";

interface EditProjectPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditProjectPage({ params }: EditProjectPageProps) {
  const { id } = await params;

  return <EditProjectPageClient projectId={id} />;
}
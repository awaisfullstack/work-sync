import { EditTaskPageClient } from "@/features/tasks/components/EditTaskPageClient";

interface EditTaskPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditTaskPage({ params }: EditTaskPageProps) {
  const { id } = await params;

  return <EditTaskPageClient taskId={id} />;
}

import TaskViewPageClient from "@/features/tasks/components/TaskViewPageClient";

interface TaskViewPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function TaskViewPage({
  params,
}: TaskViewPageProps) {
  const { id } = await params;

  return <TaskViewPageClient taskId={id} />;
}

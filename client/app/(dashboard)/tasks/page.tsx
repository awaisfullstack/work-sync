import PageHeader from "@/components/common/PageHeader";
import TasksPageClient from "@/modules/tasks/components/TasksPageClient";

export default function TasksPage() {

  return (
    <>
      <PageHeader
        title="Tasks"
        description="Manage your tasks and their details here."
        href="/tasks/create"
        buttonText="Add Task"
      />

      <TasksPageClient />
    </>
  );
}

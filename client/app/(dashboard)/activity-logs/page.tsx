import PageHeader from "@/components/shared/PageHeader";
import ActivityLogsPageClient from "@/features/activity-logs/components/ActivityLogsPageClient";

export default function ActivityLogsPage() {
  return (
    <>
      <PageHeader
        title="Activity Log"
        description="Review audit events across projects, tasks, shifts, and users."
      />

      <ActivityLogsPageClient />
    </>
  );
}

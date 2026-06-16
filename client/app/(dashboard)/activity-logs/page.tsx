import PageHeader from "@/components/common/PageHeader";
import ActivityLogsPageClient from "@/modules/activity-logs/components/ActivityLogsPageClient";

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

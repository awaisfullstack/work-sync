import PageHeader from "@/components/shared/PageHeader";
import DashboardPageClient from "@/features/dashboard/components/DashboardPageClient";

export default function DashboardPage() {
  return (
    <>
      <PageHeader
        title="Dashboard"
        description="Track work, projects, shifts, and recent activity."
      />

      <DashboardPageClient />
    </>
  );
}

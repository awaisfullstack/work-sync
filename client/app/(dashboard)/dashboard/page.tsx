import PageHeader from "@/components/common/PageHeader";
import DashboardPageClient from "@/modules/dashboard/components/DashboardPageClient";
import type { DashboardData } from "@/types/dashboard.types";
import { serverFetch } from "@/lib/api/serverFetch";
import type { SuccessResponse } from "@/types/api-response";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const dashboardResponse =
    await serverFetch<SuccessResponse<DashboardData>>("/dashboard");
  const initialDashboard =
    dashboardResponse?.success === true ? dashboardResponse.data : undefined;

  return (
    <>
      <PageHeader
        title="Dashboard"
        description="A simple overview of tasks, projects, shifts, and activity."
      />

      <DashboardPageClient initialDashboard={initialDashboard} />
    </>
  );
}

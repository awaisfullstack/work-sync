import AdminRoutes from "@/components/shared/AdminRoutes";
import type { ReactNode } from "react";

export default function ActivityLogsLayout({ children }: { children: ReactNode }) {
  return <AdminRoutes>{children}</AdminRoutes>;
}

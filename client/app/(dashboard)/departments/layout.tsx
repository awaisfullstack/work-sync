import AdminRoutes from "@/components/layout/AdminRoutes";
import type { ReactNode } from "react";

export default function DepartmentsLayout({ children }: { children: ReactNode }) {
  return <AdminRoutes>{children}</AdminRoutes>;
}

import AdminRoutes from "@/components/layout/AdminRoutes";
import type { ReactNode } from "react";

export default function UsersLayout({ children }: { children: ReactNode }) {
  return <AdminRoutes>{children}</AdminRoutes>;
}

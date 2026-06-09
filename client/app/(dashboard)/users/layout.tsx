import AdminRoutes from "@/components/shared/AdminRoutes";
import type { ReactNode } from "react";

export default function UsersLayout({ children }: { children: ReactNode }) {
  return <AdminRoutes>{children}</AdminRoutes>;
}

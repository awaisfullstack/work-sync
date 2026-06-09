import AdminRoutes from "@/components/shared/AdminRoutes";
import type { ReactNode } from "react";

export default function CreateProjectLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <AdminRoutes>{children}</AdminRoutes>;
}

"use client";
import { Role } from "@/constants";
import { useAppSelector } from "@/store/hooks";
import { useRouter } from "next/navigation";
import { ReactNode, useEffect } from "react";

function AdminRoutes({ children }: { children: ReactNode }) {
  const user = useAppSelector((state) => state.auth.user);
  const router = useRouter();

  useEffect(() => {
    if (user?.role !== Role.ADMIN) {
      router.back();
    }
  }, [router, user?.role]);

  if (user?.role !== Role.ADMIN) return null;

  return <>{children}</>;
}

export default AdminRoutes;

"use client";
import { Role } from "@/constants";
import { useAppSelector } from "@/store/hooks";
import { useRouter } from "next/navigation";
import { ReactNode, useEffect } from "react";
import { Spinner } from "../ui/spinner";

function AdminRoutes({ children }: { children: ReactNode }) {
  const user = useAppSelector((state) => state.auth.user);
  const router = useRouter();

  useEffect(() => {
    if (!user) return;

    if (user?.role !== Role.ADMIN) {
      router.replace("/dashboard");
    }
  }, [router, user]);

  if (!user || user.role !== Role.ADMIN) {
    return (
      <div className="main-container min-h-screen flex items-center justify-center">
        <Spinner className="w-6 h-6" />
      </div>
    );
  }

  return <>{children}</>;
}

export default AdminRoutes;

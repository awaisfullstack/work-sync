"use client";

import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Spinner } from "@/components/ui/spinner";
import { useGetMeQuery } from "@/features/auth/authApi";
import { setUser } from "@/features/auth/authSlice";
import { useAppDispatch } from "@/store/hooks";
import { isSuccessResponse } from "@/types/api-response";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { data: userData, isLoading } = useGetMeQuery();

  useEffect(() => {
    if (isLoading) return;

    if (!isSuccessResponse(userData)) {
      router.replace("/login");
      return;
    }
    dispatch(setUser(userData.data));
  }, [userData, isLoading, router, dispatch]);

  if (isLoading) {
    return (
      <div className="main-container min-h-screen flex items-center justify-center">
        <Spinner className="w-6 h-6" />
      </div>
    );
  }
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="px-4">
            <SidebarTrigger className="-ml-1" />
          </div>
        </header>
        <main className="main-container">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default DashboardLayout;

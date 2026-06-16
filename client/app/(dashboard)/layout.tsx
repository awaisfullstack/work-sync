"use client";

import { AppSidebar } from "@/components/layout/app-sidebar";
import AppLoader from "@/components/common/AppLoader";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { useGetMeQuery } from "@/store/api/authApi";
import { logout, setUser } from "@/store/slices/authSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const isAuth = useAppSelector((state) => state.auth.isAuthenticated);
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { data: userData, isLoading } = useGetMeQuery();

  useEffect(() => {
    if (isLoading) return;
    if (!userData) {
      dispatch(logout());
      router.replace("/login");
      return;
    }
    dispatch(setUser(userData.data));
  }, [userData, isLoading, router, dispatch]);  

  if (isLoading || !isAuth) {
    return <AppLoader />;
  }
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-14 shrink-0 items-center mb-4 border-b gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="px-4">
            <SidebarTrigger className="-ml-1" />
          </div>
        </header>
        <main className="main-container min-w-0">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default DashboardLayout;

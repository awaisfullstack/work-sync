"use client";

import * as React from "react";

import { NavMain, type NavMainItem } from "@/components/layout/nav-main";
import { NavUser } from "@/components/layout/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import {
  BuildingsIcon,
  CalendarCheckIcon,
  ChartBarIcon,
  ClipboardTextIcon,
  FolderOpenIcon,
  ListMagnifyingGlassIcon,
  UsersThreeIcon,
} from "@phosphor-icons/react";
import { HugeiconsIcon } from "@hugeicons/react";
import { WorkIcon } from "@hugeicons/core-free-icons";
import { useAppSelector } from "@/store/hooks";
import { usePathname } from "next/navigation";
import { Role } from "@/types/auth.types";

const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: <ChartBarIcon />,
    },
    {
      title: "Projects",
      url: "/projects",
      icon: <FolderOpenIcon />,
    },
    {
      title: "Tasks",
      url: "/tasks",
      icon: <ClipboardTextIcon />,
    },
    {
      title: "Activity Log",
      url: "/activity-logs",
      icon: <ListMagnifyingGlassIcon />,
      allowedRoles: [Role.ADMIN],
    },
    {
      title: "Shifts",
      url: "/shifts",
      icon: <CalendarCheckIcon />,
    },
    {
      title: "Users",
      url: "/users",
      icon: <UsersThreeIcon />,
      allowedRoles: [Role.ADMIN],
    },
    {
      title: "Departments",
      url: "/departments",
      icon: <BuildingsIcon />,
      allowedRoles: [Role.ADMIN],
    },
  ] satisfies NavMainItem[],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();
  const user = useAppSelector((state) => state.auth.user);
  const userData = {
    name: user?.name || "User",
    email: user?.email || "user@example.com",
    avatar: "",
  };
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader className="group-data-[collapsible=icon]:items-center">
        <div className="flex items-center gap-2">
          <HugeiconsIcon icon={WorkIcon} className="text-lg text-accent" />
          <p className="text-lg text-accent group-data-[collapsible=icon]:hidden">
            WorkSync
          </p>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} currentPath={pathname} user={user} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={userData} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}

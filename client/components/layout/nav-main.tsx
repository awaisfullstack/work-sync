"use client";

import type { ReactNode } from "react";
import Link from "next/link";

import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import type { AuthUser } from "@/types/auth.types";
import type { Role } from "@/types/auth.types";

export interface NavMainItem {
  title: string;
  url: string;
  icon?: ReactNode;
  allowedRoles?: Role[];
}

export function NavMain({
  items,
  currentPath,
  user,
}: {
  items: NavMainItem[];
  currentPath: string;
  user: AuthUser | null;
}) {
  const { isMobile, setOpenMobile } = useSidebar();
  const visibleItems = items.filter((item) => {
    if (!item.allowedRoles) return true;

    return user ? item.allowedRoles.includes(user.role) : false;
  });

  function isItemActive(url: string) {
    return (
      currentPath === url || (url !== "/" && currentPath.startsWith(`${url}/`))
    );
  }

  return (
    <SidebarGroup>
      <SidebarMenu>
        {visibleItems.map((item) => (
          <SidebarMenuItem key={item.title}>
            <SidebarMenuButton
              asChild
              isActive={isItemActive(item.url)}
              tooltip={item.title}
            >
              <Link
                onClick={() => isMobile && setOpenMobile(false)}
                href={item.url}
              >
                {item.icon}
                <span>{item.title}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}

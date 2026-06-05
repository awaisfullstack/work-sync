"use client";

import type { ReactNode } from "react";
import Link from "next/link";

import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import type { AuthUser, UserRole } from "@/features/auth/authTypes";

export interface NavMainItem {
  title: string;
  url: string;
  icon?: ReactNode;
  allowedRoles?: UserRole[];
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
  const visibleItems = items.filter((item) => {
    if (!item.allowedRoles) return true;

    return user ? item.allowedRoles.includes(user.role) : false;
  });

  function isItemActive(url: string) {
    return currentPath === url || (url !== "/" && currentPath.startsWith(`${url}/`));
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
              <Link href={item.url}>
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

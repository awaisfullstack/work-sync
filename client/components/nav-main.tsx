"use client";
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Link from "next/link";

export function NavMain({
  items,
  currentPath,
}: {
  items: {
    title: string;
    url: string;
    icon?: React.ReactNode;
  }[];
  currentPath: string;
}) {
  return (
    <SidebarGroup>
      <SidebarMenu>
        {items.map((item) => (
          <Link
            href={item.url}
            key={item.title}
            className={
              currentPath === item.url
                ? "bg-sidebar-accent text-sidebar-accent-foreground"
                : ""
            }
          >
            <SidebarMenuItem>
              <SidebarMenuButton tooltip={item.title}>
                {item.icon}
                <span>{item.title}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </Link>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}

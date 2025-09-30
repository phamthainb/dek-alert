"use client"

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  ShieldCheck, 
  LayoutDashboard, 
  Webhook,
  Settings,
  Database,
  FileText,
  AlertTriangle,
  FileCode,
} from "lucide-react";
import { 
  Sidebar, 
  SidebarHeader, 
  SidebarContent, 
  SidebarMenu, 
  SidebarMenuItem, 
  SidebarMenuButton,
  SidebarFooter 
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

const menuItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { type: 'divider', key: 'monitors-divider' },
  { href: "/monitors/elasticsearch", label: "Elasticsearch", icon: FileText },
  { href: "/monitors/sql", label: "SQL Alerts", icon: AlertTriangle },
  { href: "/custom-scripts", label: "Custom Scripts", icon: FileCode },
  { type: 'divider', key: 'settings-divider' },
  { href: "/webhooks", label: "Webhooks", icon: Webhook },
  { href: "/datasources", label: "Data Sources", icon: Database },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function MainSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar>
      <SidebarHeader>
        <Link href="/" className="flex items-center gap-2.5" aria-label="Alert Hub Home">
          <ShieldCheck className="w-8 h-8 text-primary" />
          <span className="text-xl font-bold text-foreground">
            Alert Hub
          </span>
        </Link>
      </SidebarHeader>
      <SidebarContent className="p-2">
        <SidebarMenu>
          {menuItems.map((item) => (
            item.type === 'divider' ? <Separator key={item.key} className="my-2" /> :
            <SidebarMenuItem key={item.href}>
              <Link href={item.href}>
                <SidebarMenuButton
                  isActive={pathname === item.href}
                  tooltip={item.label}
                >
                  <item.icon />
                  <span>{item.label}</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <Separator />
      <SidebarFooter>
        <div className="flex items-center gap-3">
            <Avatar className="h-9 w-9">
              <AvatarImage src="https://picsum.photos/100" alt="User" data-ai-hint="person face" />
              <AvatarFallback>U</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="text-sm font-medium text-foreground">Admin User</span>
              <span className="text-xs text-muted-foreground">admin@sentinel.io</span>
            </div>
            <Settings className="ml-auto h-5 w-5 text-muted-foreground hover:text-foreground cursor-pointer" />
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}

import { NavLink, useLocation } from "react-router-dom";
import {
  BarChart3,
  FolderOpen,
  GitBranch,
  BookOpen,
  Users,
  ShieldCheck,
  Bot,
  Settings,
  HelpCircle,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const navigationItems = [
  { title: "Dashboard", url: "/", icon: BarChart3 },
  { title: "Projects", url: "/projects", icon: FolderOpen },
];

const pluginItems = [
  { title: "Rater Plugin", url: "/rater-plugin", icon: Bot },
  { title: "QC Plugin", url: "/qc-plugin", icon: Settings },
];

export function AppSidebar() {
  const location = useLocation();
  const currentPath = location.pathname;

  const isActive = (path: string) => {
    if (path === "/") return currentPath === "/";
    return currentPath.startsWith(path);
  };

  const getNavClass = (path: string) => {
    return isActive(path)
      ? "bg-primary text-primary-foreground shadow-sm font-medium"
      : "hover:bg-accent hover:text-accent-foreground transition-colors";
  };

  return (
    <Sidebar collapsible="icon">
      <SidebarContent className="bg-card border-r border-border">
        <div className="p-4">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="font-semibold text-sm">RaterAI</div>
              <div className="text-xs text-muted-foreground">Enterprise</div>
            </div>
          </div>
        </div>

        <SidebarGroup>
          <SidebarGroupLabel>Platform</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} end={item.url === "/"} className={getNavClass(item.url)}>
                      <item.icon className="w-4 h-4" />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Plugins & Tools</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {pluginItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} className={getNavClass(item.url)}>
                      <item.icon className="w-4 h-4" />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <div className="mt-auto p-4">
          <SidebarMenu>
            <SidebarMenuItem>
            <SidebarMenuButton>
              <HelpCircle className="w-4 h-4" />
              <span>Help & Support</span>
            </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}
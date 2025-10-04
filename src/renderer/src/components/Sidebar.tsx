import { Globe, Check, X, ClockFading, LogOut, Settings } from "lucide-react";
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarRail } from "./ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useUser } from "@renderer/contexts/UserContext";
import { Link, useLocation } from "react-router";

const links = [
  {
    name: "Marketplace Search",
    url: "/",
    icon: Globe
  },
  {
    name: "Pending Review",
    url: "/pending-review",
    icon: ClockFading
  },
  {
    name: "Saved",
    url: "/saved",
    icon: Check
  },
  {
    name: "Discarded",
    url: "/discarded",
    icon: X
  }
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const location = useLocation();

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Pages</SidebarGroupLabel>
          <SidebarMenu>
            {links.map((item) => (
              <SidebarMenuItem key={item.name}>
                <SidebarMenuButton className={location.pathname === item.url ? "bg-gray-200" : ""} asChild>
                  <Link to={item.url}>
                    <item.icon />
                    <span>{item.name}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenuButton className={location.pathname === "/settings" ? "bg-gray-200" : ""} asChild>
          <Link to={"/settings"}>
            <Settings />
            <span>Settings</span>
          </Link>
        </SidebarMenuButton>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}

function NavUser() {
  const { logout, user } = useUser();

  const handleLogout = () => {
    logout();
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton size="lg" className="bg-gray-100">
          <Avatar className="h-8 w-8 rounded-lg">
            <AvatarImage src={user?.profilePicture} alt={user?.name} />
            <AvatarFallback className="rounded-lg">{user?.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-medium">{user?.name}</span>
            {/* <span className="truncate text-xs">{user?.name}</span> */}
          </div>
          <LogOut className="ml-auto size-4 cursor-pointer hover:opacity-70" onClick={handleLogout} />
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}

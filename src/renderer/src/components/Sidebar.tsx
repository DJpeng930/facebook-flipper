import { Globe, Check, X, ClockFading, LogOut } from "lucide-react";
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarRail } from "./ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useUser } from "@renderer/contexts/UserContext";

const links = [
  {
    name: "Listing Scraper",
    url: "/",
    icon: Globe
  },
  {
    name: "Pending Review",
    url: "/archive",
    icon: ClockFading
  },
  {
    name: "Saved",
    url: "#",
    icon: Check
  },
  {
    name: "Discarded",
    url: "#",
    icon: X
  },
  {
    name: "TEST PAGE",
    url: "/test",
    icon: X
  }
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Pages</SidebarGroupLabel>
          <SidebarMenu>
            {links.map((item) => (
              <SidebarMenuItem key={item.name}>
                <SidebarMenuButton className={window.location.pathname === item.url ? "bg-gray-200" : ""} asChild>
                  <a href={item.url}>
                    <item.icon />
                    <span>{item.name}</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
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

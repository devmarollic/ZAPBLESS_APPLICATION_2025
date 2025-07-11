
import { ChartArea, MessageSquare, Users, Building, Bell } from "lucide-react";
import { NavLink } from "react-router-dom";
import { 
  SidebarGroup, 
  SidebarGroupLabel, 
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton
} from "../ui/sidebar";

const SidebarDashboardGroup = () => {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Dashboard</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {/* <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip="Gráficos de acesso">
              <NavLink to="/dashboard/graficos/acesso" className={({isActive}) => isActive ? "data-[active=true]" : ""}>
                <ChartArea className="h-5 w-5" />
                <span>Gráficos de acesso</span>
              </NavLink>
            </SidebarMenuButton>
          </SidebarMenuItem> */}
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip="Gráficos de mensagens">
              <NavLink to="/dashboard/graficos/mensagens" className={({isActive}) => isActive ? "data-[active=true]" : ""}>
                <MessageSquare className="h-5 w-5" />
                <span>Gráficos de mensagens</span>
              </NavLink>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip="Gráficos de membros">
              <NavLink to="/dashboard/graficos/membros" className={({isActive}) => isActive ? "data-[active=true]" : ""}>
                <Users className="h-5 w-5" />
                <span>Gráficos de membros</span>
              </NavLink>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip="Gráficos de ministérios">
              <NavLink to="/dashboard/graficos/ministerios" className={({isActive}) => isActive ? "data-[active=true]" : ""}>
                <Building className="h-5 w-5" />
                <span>Gráficos de ministérios</span>
              </NavLink>
            </SidebarMenuButton>
          </SidebarMenuItem>
          {/* <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip="Gráficos de avisos">
              <NavLink to="/dashboard/graficos/avisos" className={({isActive}) => isActive ? "data-[active=true]" : ""}>
                <Bell className="h-5 w-5" />
                <span>Gráficos de avisos</span>
              </NavLink>
            </SidebarMenuButton>
          </SidebarMenuItem> */}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
};

export default SidebarDashboardGroup;

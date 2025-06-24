
import { Calendar, Plus, Edit } from "lucide-react";
import { NavLink } from "react-router-dom";
import { 
  SidebarGroup, 
  SidebarGroupLabel, 
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton
} from "../ui/sidebar";

const SidebarAgendaGroup = () => {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Agenda</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip="Calendário">
              <NavLink to="/dashboard/calendario" className={({isActive}) => isActive ? "data-[active=true]" : ""}>
                <Calendar className="h-5 w-5" />
                <span>Calendário</span>
              </NavLink>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip="Eventos">
              <NavLink to="/dashboard/eventos" className={({isActive}) => isActive ? "data-[active=true]" : ""}>
                <Calendar className="h-5 w-5" />
                <span>Eventos</span>
              </NavLink>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip="Novo evento">
              <NavLink to="/dashboard/eventos/novo" className={({isActive}) => isActive ? "data-[active=true]" : ""}>
                <Plus className="h-5 w-5" />
                <span>Novo evento</span>
              </NavLink>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
};

export default SidebarAgendaGroup;

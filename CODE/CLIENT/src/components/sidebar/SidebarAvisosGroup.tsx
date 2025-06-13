
import { Bell, Plus, Edit, Import, ArrowUpRight } from "lucide-react";
import { NavLink } from "react-router-dom";
import { 
  SidebarGroup, 
  SidebarGroupLabel, 
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton
} from "../ui/sidebar";

const SidebarAvisosGroup = () => {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Avisos</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip="Listagem de avisos">
              <NavLink to="/dashboard/avisos" className={({isActive}) => isActive ? "data-[active=true]" : ""}>
                <Bell className="h-5 w-5" />
                <span>Listagem de avisos</span>
              </NavLink>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip="Novo aviso">
              <NavLink to="/dashboard/avisos/novo" className={({isActive}) => isActive ? "data-[active=true]" : ""}>
                <Plus className="h-5 w-5" />
                <span>Novo aviso</span>
              </NavLink>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip="Editar/Excluir aviso">
              <NavLink to="/dashboard/avisos/gerenciar" className={({isActive}) => isActive ? "data-[active=true]" : ""}>
                <Edit className="h-5 w-5" />
                <span>Editar/Excluir aviso</span>
              </NavLink>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip="Importar avisos">
              <NavLink to="/dashboard/avisos/importar" className={({isActive}) => isActive ? "data-[active=true]" : ""}>
                <Import className="h-5 w-5" />
                <span>Importar avisos</span>
              </NavLink>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip="Exportar avisos">
              <NavLink to="/dashboard/avisos/exportar" className={({isActive}) => isActive ? "data-[active=true]" : ""}>
                <ArrowUpRight className="h-5 w-5" />
                <span>Exportar avisos</span>
              </NavLink>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
};

export default SidebarAvisosGroup;

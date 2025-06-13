
import { Building, Plus, Edit, Import, ArrowUpRight } from "lucide-react";
import { NavLink } from "react-router-dom";
import { 
  SidebarGroup, 
  SidebarGroupLabel, 
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton
} from "../ui/sidebar";

const SidebarMinisteriosGroup = () => {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Ministérios</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip="Listagem de ministérios">
              <NavLink to="/dashboard/ministerios" className={({isActive}) => isActive ? "data-[active=true]" : ""}>
                <Building className="h-5 w-5" />
                <span>Listagem de ministérios</span>
              </NavLink>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip="Novo ministério">
              <NavLink to="/dashboard/ministerios/novo" className={({isActive}) => isActive ? "data-[active=true]" : ""}>
                <Plus className="h-5 w-5" />
                <span>Novo ministério</span>
              </NavLink>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip="Editar/Excluir ministério">
              <NavLink to="/dashboard/ministerios/gerenciar" className={({isActive}) => isActive ? "data-[active=true]" : ""}>
                <Edit className="h-5 w-5" />
                <span>Editar/Excluir ministério</span>
              </NavLink>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip="Importar ministérios">
              <NavLink to="/dashboard/ministerios/importar" className={({isActive}) => isActive ? "data-[active=true]" : ""}>
                <Import className="h-5 w-5" />
                <span>Importar ministérios</span>
              </NavLink>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip="Exportar ministérios">
              <NavLink to="/dashboard/ministerios/exportar" className={({isActive}) => isActive ? "data-[active=true]" : ""}>
                <ArrowUpRight className="h-5 w-5" />
                <span>Exportar ministérios</span>
              </NavLink>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
};

export default SidebarMinisteriosGroup;

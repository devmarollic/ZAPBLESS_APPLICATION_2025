
import { Users, MessageSquare, Plus, Edit, Import, ArrowUpRight } from "lucide-react";
import { NavLink } from "react-router-dom";
import { 
  SidebarGroup, 
  SidebarGroupLabel, 
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton
} from "../ui/sidebar";

const SidebarMembrosGroup = () => {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Membros</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip="Listagem de membros">
              <NavLink to="/dashboard/membros" className={({isActive}) => isActive ? "data-[active=true]" : ""}>
                <Users className="h-5 w-5" />
                <span>Listagem de membros</span>
              </NavLink>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip="Enviar Mensagem">
              <NavLink to="/dashboard/membros/mensagem" className={({isActive}) => isActive ? "data-[active=true]" : ""}>
                <MessageSquare className="h-5 w-5" />
                <span>Enviar Mensagem</span>
              </NavLink>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip="Novo membro">
              <NavLink to="/dashboard/membros/novo" className={({isActive}) => isActive ? "data-[active=true]" : ""}>
                <Plus className="h-5 w-5" />
                <span>Novo membro</span>
              </NavLink>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip="Gerenciar membros">
              <NavLink to="/dashboard/membros/gerenciar" className={({isActive}) => isActive ? "data-[active=true]" : ""}>
                <Edit className="h-5 w-5" />
                <span>Editar/Excluir membro</span>
              </NavLink>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip="Importar membros">
              <NavLink to="/dashboard/membros/importar" className={({isActive}) => isActive ? "data-[active=true]" : ""}>
                <Import className="h-5 w-5" />
                <span>Importar membros</span>
              </NavLink>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip="Exportar membros">
              <NavLink to="/dashboard/membros/exportar" className={({isActive}) => isActive ? "data-[active=true]" : ""}>
                <ArrowUpRight className="h-5 w-5" />
                <span>Exportar membros</span>
              </NavLink>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
};

export default SidebarMembrosGroup;

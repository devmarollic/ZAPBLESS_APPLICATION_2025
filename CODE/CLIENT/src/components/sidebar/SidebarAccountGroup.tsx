
import { Book, FileText, Users } from "lucide-react";
import { NavLink } from "react-router-dom";
import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarGroupContent,
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton
} from "../ui/sidebar";

const SidebarAccountGroup = () => {
    return (
        <SidebarGroup>
            <SidebarGroupLabel>Minha Conta</SidebarGroupLabel>
            <SidebarGroupContent>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton asChild tooltip="Meu plano">
                            <NavLink to="/dashboard/meu-plano" className={({ isActive }) => isActive ? "data-[active=true]" : ""}>
                                <Book className="h-5 w-5" />
                                <span>Meu plano</span>
                            </NavLink>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                        <SidebarMenuButton asChild tooltip="Meus dados">
                            <NavLink to="/dashboard/meus-dados" className={({ isActive }) => isActive ? "data-[active=true]" : ""}>
                                <FileText className="h-5 w-5" />
                                <span>Meus dados</span>
                            </NavLink>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                        <SidebarMenuButton asChild tooltip="Gerenciar usuários">
                            <NavLink to="/dashboard/gerenciar-usuarios" className={({ isActive }) => isActive ? "data-[active=true]" : ""}>
                                <Users className="h-5 w-5" />
                                <span>Gerenciar usuários</span>
                            </NavLink>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarGroupContent>
        </SidebarGroup>
    );
};

export default SidebarAccountGroup;

import { Users, UserPlus, Send, MessageSquare, Upload, Download, Settings } from "lucide-react";
import { NavLink } from "react-router-dom";
import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarGroupContent,
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
} from "../ui/sidebar";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger
} from "../ui/collapsible";

const SidebarMembrosGroup = () => {
    return (
        <SidebarGroup>
            <SidebarGroupLabel>Membros</SidebarGroupLabel>
            <SidebarGroupContent>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton asChild tooltip="Membros">
                            <NavLink to="/dashboard/membros" className={({ isActive }) => isActive ? "data-[active=true]" : ""}>
                                <Users className="h-5 w-5" />
                                <span>Membros</span>
                            </NavLink>
                        </SidebarMenuButton>
                    </SidebarMenuItem>

                    <Collapsible>
                        <SidebarMenuItem>
                            <CollapsibleTrigger asChild>
                                <SidebarMenuButton>
                                    <MessageSquare className="h-5 w-5" />
                                    <span>Mensagens</span>
                                </SidebarMenuButton>
                            </CollapsibleTrigger>
                            <CollapsibleContent>
                                <SidebarMenuSub>
                                    <SidebarMenuSubItem>
                                        <SidebarMenuSubButton asChild>
                                            <NavLink to="/dashboard/membros/mensagem">
                                                <Send className="h-4 w-4" />
                                                <span>Enviar Mensagem</span>
                                            </NavLink>
                                        </SidebarMenuSubButton>
                                    </SidebarMenuSubItem>
                                    <SidebarMenuSubItem>
                                        <SidebarMenuSubButton asChild>
                                            <NavLink to="/dashboard/mensagens/status">
                                                <MessageSquare className="h-4 w-4" />
                                                <span>Status Mensagens</span>
                                            </NavLink>
                                        </SidebarMenuSubButton>
                                    </SidebarMenuSubItem>
                                </SidebarMenuSub>
                            </CollapsibleContent>
                        </SidebarMenuItem>
                    </Collapsible>

                    <Collapsible>
                        <SidebarMenuItem>
                            <CollapsibleTrigger asChild>
                                <SidebarMenuButton>
                                    <Settings className="h-5 w-5" />
                                    <span>Gerenciar</span>
                                </SidebarMenuButton>
                            </CollapsibleTrigger>
                            <CollapsibleContent>
                                <SidebarMenuSub>
                                    <SidebarMenuSubItem>
                                        <SidebarMenuSubButton asChild>
                                            <NavLink to="/dashboard/membros/novo">
                                                <UserPlus className="h-4 w-4" />
                                                <span>Novo Membro</span>
                                            </NavLink>
                                        </SidebarMenuSubButton>
                                    </SidebarMenuSubItem>
                                    <SidebarMenuSubItem>
                                        <SidebarMenuSubButton asChild>
                                            <NavLink to="/dashboard/membros/gerenciar">
                                                <Settings className="h-4 w-4" />
                                                <span>Gerenciar Membros</span>
                                            </NavLink>
                                        </SidebarMenuSubButton>
                                    </SidebarMenuSubItem>
                                    <SidebarMenuSubItem>
                                        <SidebarMenuSubButton asChild>
                                            <NavLink to="/dashboard/membros/importar">
                                                <Upload className="h-4 w-4" />
                                                <span>Importar</span>
                                            </NavLink>
                                        </SidebarMenuSubButton>
                                    </SidebarMenuSubItem>
                                    <SidebarMenuSubItem>
                                        <SidebarMenuSubButton asChild>
                                            <NavLink to="/dashboard/membros/exportar">
                                                <Download className="h-4 w-4" />
                                                <span>Exportar</span>
                                            </NavLink>
                                        </SidebarMenuSubButton>
                                    </SidebarMenuSubItem>
                                </SidebarMenuSub>
                            </CollapsibleContent>
                        </SidebarMenuItem>
                    </Collapsible>
                </SidebarMenu>
            </SidebarGroupContent>
        </SidebarGroup>
    );
};

export default SidebarMembrosGroup;

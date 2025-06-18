
import { Bell } from "lucide-react";
import { NavLink } from "react-router-dom";
import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarGroupContent,
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton
} from "../ui/sidebar";

const SidebarLembretesGroup = () => {
    return (
        <SidebarGroup>
            <SidebarGroupLabel>Lembretes</SidebarGroupLabel>
            <SidebarGroupContent>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton asChild tooltip="Lembretes">
                            <NavLink to="/dashboard/lembretes" className={({ isActive }) => isActive ? "data-[active=true]" : ""}>
                                <Bell className="h-5 w-5" />
                                <span>Lembretes</span>
                            </NavLink>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarGroupContent>
        </SidebarGroup>
    );
};

export default SidebarLembretesGroup;

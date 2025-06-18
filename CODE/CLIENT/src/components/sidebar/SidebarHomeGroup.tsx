
import { House, FileText } from "lucide-react";
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
            <SidebarGroupLabel>Dashboard</SidebarGroupLabel>
            <SidebarGroupContent>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton asChild tooltip="Dashboard">
                            <NavLink to="/dashboard" className={({ isActive }) => isActive ? "data-[active=true]" : ""}>
                                <House className="h-5 w-5" />
                                <span>Home</span>
                            </NavLink>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarGroupContent>
        </SidebarGroup>
    );
};

export default SidebarAccountGroup;


import { Sidebar, SidebarContent, SidebarHeader, SidebarFooter, SidebarSeparator, SidebarTrigger } from "./ui/sidebar";
import SidebarAccountGroup from "./sidebar/SidebarAccountGroup";
import SidebarAgendaGroup from "./sidebar/SidebarAgendaGroup";
import SidebarMembrosGroup from "./sidebar/SidebarMembrosGroup";
import SidebarAvisosGroup from "./sidebar/SidebarAvisosGroup";
import SidebarMinisteriosGroup from "./sidebar/SidebarMinisteriosGroup";
import SidebarDashboardGroup from "./sidebar/SidebarDashboardGroup";
import SidebarHomeGroup from "./sidebar/SidebarHomeGroup";
import SidebarLembretesGroup from "./sidebar/SidebarLembretesGroup";
import AccountDropdown from "./AccountDropdown";

const DashboardSidebar = () => {
    return (
        <Sidebar>
            <SidebarHeader className="flex items-center justify-between px-4">
                <div className="flex items-center space-x-2">
                    <AccountDropdown />
                </div>
                <SidebarTrigger />
            </SidebarHeader>

            <SidebarContent>
                <SidebarHomeGroup />

                <SidebarSeparator />

                <SidebarAccountGroup />

                <SidebarSeparator />

                <SidebarAgendaGroup />

                <SidebarSeparator />

                <SidebarMembrosGroup />

                <SidebarSeparator />

                <SidebarAvisosGroup />

                <SidebarSeparator />

                <SidebarMinisteriosGroup />

                <SidebarSeparator />

                <SidebarLembretesGroup />

                <SidebarSeparator />

                <SidebarDashboardGroup />
            </SidebarContent>

            <SidebarFooter className="p-4">
                <div className="text-sm text-gray-500">
                    ZapBless © {new Date().getFullYear()}
                </div>
            </SidebarFooter>
        </Sidebar>
    );
};

export default DashboardSidebar;

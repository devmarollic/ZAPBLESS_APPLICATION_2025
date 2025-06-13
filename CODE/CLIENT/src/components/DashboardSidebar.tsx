
import { Sidebar, SidebarContent, SidebarHeader, SidebarFooter, SidebarSeparator, SidebarTrigger } from "./ui/sidebar";
import SidebarAccountGroup from "./sidebar/SidebarAccountGroup";
import SidebarAgendaGroup from "./sidebar/SidebarAgendaGroup";
import SidebarMembrosGroup from "./sidebar/SidebarMembrosGroup";
import SidebarAvisosGroup from "./sidebar/SidebarAvisosGroup";
import SidebarMinisteriosGroup from "./sidebar/SidebarMinisteriosGroup";
import SidebarDashboardGroup from "./sidebar/SidebarDashboardGroup";

const DashboardSidebar = () => {
  return (
    <Sidebar>
      <SidebarHeader className="flex items-center justify-between px-4">
        <div className="flex items-center space-x-2">
          <span className="text-xl font-bold text-zapPurple-600">ZapBless</span>
        </div>
        <SidebarTrigger />
      </SidebarHeader>
      
      <SidebarContent>
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

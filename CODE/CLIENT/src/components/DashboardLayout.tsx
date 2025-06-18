
import { Outlet } from "react-router-dom";
import DashboardSidebar from "./DashboardSidebar";
import { Menu } from "lucide-react";
import { SidebarProvider, SidebarTrigger, useSidebar } from "./ui/sidebar";
import { Button } from "./ui/button";

const SidebarToggle = () => {
    // Remove the conditional rendering based on sidebar state
    // so the button is always visible
    return (
        <Button
            variant="ghost"
            size="icon"
            className="fixed right-4 top-4 z-50 md:hidden"
        >
            <SidebarTrigger>
                <Menu className="h-5 w-5" />
            </SidebarTrigger>
        </Button>
    );
};

const DashboardLayout = () => {
    return (
        <SidebarProvider defaultOpen={true}>
            <div className="flex min-h-screen w-full">
                <DashboardSidebar />
                <SidebarToggle />
                <main className="flex-1 overflow-y-auto">
                    <div className="container py-6 px-4 md:px-6">
                        <Outlet />
                    </div>
                </main>
            </div>
        </SidebarProvider>
    );
};

export default DashboardLayout;

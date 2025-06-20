
import { Outlet } from 'react-router-dom';
import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import DashboardSidebar from './DashboardSidebar';
import AccountDropdown from './AccountDropdown';
import { Button } from './ui/button';
import { Menu } from 'lucide-react';

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
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <DashboardSidebar />
        <SidebarToggle />
        <SidebarInset className="flex-1">
          {/* <header className="flex h-16 shrink-0 items-center justify-between border-b px-4">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-semibold">
                <span className="text-zapPurple-600">Zap</span>
                <span className="text-zapBlue-600">Bless</span>
              </h1>
            </div>
            <AccountDropdown />
          </header> */}
          <main className="max-w-[100dvw] flex-1 p-6">
            <Outlet />
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default DashboardLayout;

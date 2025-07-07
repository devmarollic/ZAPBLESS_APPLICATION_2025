
import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { User, Settings, Lock, LogOut, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AuthenticationService } from '@/lib/authentication_service';
import { useToast } from '@/hooks/use-toast';

interface AccountDropdownProps {
    userName?: string;
    userEmail?: string;
    userAvatar?: string;
}

const AccountDropdown = ({
    userName = "",
    userEmail = "",
    userAvatar
}: AccountDropdownProps) => {
    const navigate = useNavigate();
    const { toast } = useToast();
    const [isOpen, setIsOpen] = useState(false);

    const handleLogout = () => {
        AuthenticationService.logOff();
        toast({
            title: "Logout realizado",
            description: "Você foi desconectado com sucesso",
        });
        navigate('/login');
    };

    const getUserInitials = (name: string) => {
        return name
            .split(' ')
            .map(n => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    return (
        <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    className="h-auto p-2 hover:bg-gray-100 transition-colors"
                >
                    <div className="flex items-center space-x-3">
                        <Avatar className="h-8 w-8">
                            <AvatarImage src={userAvatar} alt={userName} />
                            <AvatarFallback className="bg-zapPurple-600 text-white text-sm">
                                {getUserInitials(userName)}
                            </AvatarFallback>
                        </Avatar>

                        <div className="flex flex-col items-start min-w-0">
                            <a href="/dashboard">
                                <h1 className="text-xl font-bold">
                                    <span className="text-zapPurple-600">Zap</span>
                                    <span className="text-zapBlue-600">Bless</span>
                                </h1></a>
                        </div>
                        <ChevronDown className={`h-4 w-4 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                    </div>
                </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium">{userName}</p>
                        <p className="text-xs text-muted-foreground">{userEmail}</p>
                    </div>
                </DropdownMenuLabel>

                <DropdownMenuSeparator />

                <DropdownMenuItem
                    onClick={() => navigate('/dashboard/meus-dados')}
                    className="cursor-pointer"
                >
                    <User className="mr-2 h-4 w-4" />
                    <span>Editar conta</span>
                </DropdownMenuItem>

                <DropdownMenuItem
                    onClick={() => navigate('/dashboard/alterar-senha')}
                    className="cursor-pointer"
                >
                    <Lock className="mr-2 h-4 w-4" />
                    <span>Alterar senha</span>
                </DropdownMenuItem>

                <DropdownMenuItem
                    onClick={() => navigate('/dashboard/meu-plano')}
                    className="cursor-pointer"
                >
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Configurações</span>
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <DropdownMenuItem
                    onClick={handleLogout}
                    className="cursor-pointer text-red-600 focus:text-red-600"
                >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Sair</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default AccountDropdown;

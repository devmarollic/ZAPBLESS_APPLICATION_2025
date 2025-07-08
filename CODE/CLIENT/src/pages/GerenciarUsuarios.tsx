
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Plus, Edit, Trash2, UserCheck, UserX } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import UserFormModal from '@/components/users/UserFormModal';
import { HttpClient } from '@/lib/http_client';
import { useQuery } from '@tanstack/react-query';
import { z } from 'zod';
import { useSearchParams } from 'react-router-dom';

interface User {
    id: string;
    legalName: string;
    firstName: string;
    lastName: string;
    email: string;
    phonePrefix: string;
    phoneNumber: string;
    role: { roleSlug: string };
    statusId: 'active' | 'inactive';
    createdAt: string;
}

type UserResponse = {
    data: User[];
    totalCount: number;
    totalPages: number;
    currentPage: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
}

const userSearchParams = z.object({
    searchTerm: z.string().optional(),
    statusFilter: z.enum(['active', 'inactive']).optional(),
    roleFilter: z.enum(['administrator', 'minister', 'leader', 'secretary', 'treasurer', 'user']).optional(),
});

const GerenciarUsuarios = () => {
    const { toast } = useToast();
    const [users, setUsers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [userModalOpen, setUserModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [searchParams, setSearchParams] = useSearchParams();
    const searchTerm = searchParams.get('searchTerm') || '';
    const statusFilter = searchParams.get('statusFilter') || '';
    const roleFilter = searchParams.get('roleFilter') || '';

    const handleFilterChange = (newKey: string, newValue: string) => {
        if (newValue === 'all') {
            searchParams.delete(newKey);

            setSearchParams(
                {
                    ...Object.fromEntries(searchParams),
                },
                {
                    replace: true
                }
            );

            return;
        }

        setSearchParams(
            {
                ...Object.fromEntries(searchParams),
                [newKey]: newValue
            },
            {
                replace: true
            }
        );
    };

    const { data: churchAndProfileData, isLoading: isLoadingChurchAndProfile, refetch: refetchUsers, isFetching: isFetchingUsers } = useQuery({
        queryKey: ['users', searchTerm, statusFilter, roleFilter],
        queryFn: () => HttpClient.getDefault().get<UserResponse>(`/church/users/list?searchTerm=${searchTerm}&statusFilter=${statusFilter}&roleFilter=${roleFilter}`)
    });

    const deleteUser = async (userId: string) => {
        try {
            await HttpClient.getDefault().delete(`/church/user/${userId}/delete`);

            toast({
                title: "Usuário deletado",
                description: "O usuário foi removido com sucesso.",
            });
        } catch (error) {
            console.error("Error deleting user:", error);
        }
        finally {
            refetchUsers();
        }
    };

    const toggleUserStatus = (userId: string, currentStatus: string) => {
        try {
            HttpClient.getDefault().put(`/church/user/${userId}/update`, {
                statusId: ( currentStatus === 'active' ? 'inactive' : 'active' ) as User['statusId']
            });

            toast({
                title: "Status do usuário atualizado",
                description: "O status do usuário foi alterado com sucesso.",
            });
        } catch (error) {
            console.error("Error updating user status:", error);
        }
        finally {
            refetchUsers();
        }
    };

    const handleSaveUser = (userData: User) => {
        refetchUsers();
    };

    const handleEditUser = (user: User) => {
        setEditingUser(user);
        setUserModalOpen(true);
    };

    const handleNewUser = () => {
        setEditingUser(null);
        setUserModalOpen(true);
    };

    const getRoleName = (roleSlug: string) => {
        const roles = {
            administrator: 'Administrador',
            minister: 'Pastor',
            leader: 'Líder',
            secretary: 'Secretário',
            treasurer: 'Tesoureiro',
            user: 'Usuário'
        };
        return roles[roleSlug as keyof typeof roles] || roleSlug;
    };

    const getStatusColor = (status: string) => {
        return status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
    };

    return (
        <div className="md:container mx-auto py-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Gerenciar Usuários</h1>
                <Button onClick={handleNewUser}>
                    <Plus className="h-4 w-4 mr-2" />
                    Novo Usuário
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Lista de Usuários</CardTitle>
                    <CardDescription>
                        Gerencie todos os usuários do sistema
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex gap-4 mb-6 ">
                        <div className="flex-1">
                            <div className="relative">
                                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Buscar por nome ou email..."
                                    value={searchTerm}
                                    onChange={(e) => handleFilterChange('searchTerm', e.target.value)}
                                    className="pl-8"
                                />
                            </div>
                        </div>
                        <Select value={statusFilter} onValueChange={(value) => handleFilterChange('statusFilter', value)}>
                            <SelectTrigger className="w-48">
                                <SelectValue placeholder="Filtrar por status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Todos os status</SelectItem>
                                <SelectItem value="active">Ativo</SelectItem>
                                <SelectItem value="inactive">Inativo</SelectItem>
                            </SelectContent>
                        </Select>
                        <Select value={roleFilter} onValueChange={(value) => handleFilterChange('roleFilter', value)}>
                            <SelectTrigger className="w-48">
                                <SelectValue placeholder="Filtrar por role" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Todos os roles</SelectItem>
                                <SelectItem value="administrator">Administrador</SelectItem>
                                <SelectItem value="minister">Pastor</SelectItem>
                                <SelectItem value="leader">Líder</SelectItem>
                                <SelectItem value="secretary">Secretário</SelectItem>
                                <SelectItem value="treasurer">Tesoureiro</SelectItem>
                                <SelectItem value="user">Usuário</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Nome</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Telefone</TableHead>
                                <TableHead>Role</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Ações</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {churchAndProfileData?.data.map((user) => (
                                <TableRow key={user.id}>
                                    <TableCell className="font-medium">
                                        {user.firstName} {user.lastName}
                                    </TableCell>
                                    <TableCell>{user.email}</TableCell>
                                    <TableCell>
                                        {user.phonePrefix} {user.phoneNumber}
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline">
                                            {getRoleName(user?.role?.roleSlug)}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Badge className={getStatusColor(user.statusId)}>
                                            {user.statusId === 'active' ? 'Ativo' : 'Inativo'}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex gap-2">
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => handleEditUser(user)}
                                            >
                                                <Edit className="h-3 w-3" />
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => toggleUserStatus(user.id, user.statusId)}
                                            >
                                                {user.statusId === 'active' ?
                                                    <UserX className="h-3 w-3" /> :
                                                    <UserCheck className="h-3 w-3" />
                                                }
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="destructive"
                                                onClick={() => deleteUser(user.id)}
                                            >
                                                <Trash2 className="h-3 w-3" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>

                    {churchAndProfileData?.data.length === 0 && (
                        <div className="text-center py-8 text-muted-foreground">
                            Nenhum usuário encontrado
                        </div>
                    )}
                </CardContent>
            </Card>

            <UserFormModal
                open={userModalOpen}
                onOpenChange={setUserModalOpen}
                user={editingUser}
                onSave={handleSaveUser}
            />
        </div>
    );
};

export default GerenciarUsuarios;

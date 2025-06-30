
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

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phonePrefix: string;
  phoneNumber: string;
  roleSlug: 'administrator' | 'minister' | 'leader' | 'secretary' | 'treasurer' | 'user';
  statusId: 'active' | 'inactive';
  createdAt: string;
}

const GerenciarUsuarios = () => {
  const { toast } = useToast();
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [userModalOpen, setUserModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true);
      try {
        // Simulate fetching users from an API
        setTimeout(() => {
          const mockUsers: User[] = [
            {
              id: '1',
              firstName: 'João',
              lastName: 'Silva',
              email: 'joao.silva@example.com',
              phonePrefix: '+55',
              phoneNumber: '11999999999',
              roleSlug: 'administrator',
              statusId: 'active',
              createdAt: '2023-01-01T00:00:00.000Z',
            },
            {
              id: '2',
              firstName: 'Maria',
              lastName: 'Santos',
              email: 'maria.santos@example.com',
              phonePrefix: '+55',
              phoneNumber: '11988888888',
              roleSlug: 'minister',
              statusId: 'active',
              createdAt: '2023-02-15T00:00:00.000Z',
            },
            {
              id: '3',
              firstName: 'Carlos',
              lastName: 'Oliveira',
              email: 'carlos.oliveira@example.com',
              phonePrefix: '+55',
              phoneNumber: '11977777777',
              roleSlug: 'leader',
              statusId: 'inactive',
              createdAt: '2023-03-20T00:00:00.000Z',
            },
          ];
          setUsers(mockUsers);
          setIsLoading(false);
        }, 500);
      } catch (error) {
        console.error("Error fetching users:", error);
        toast({
          title: "Erro ao carregar usuários",
          description: "Não foi possível carregar a lista de usuários.",
          variant: "destructive",
        });
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, [toast]);

  const deleteUser = (userId: string) => {
    setUsers(users.filter(user => user.id !== userId));
    toast({
      title: "Usuário deletado",
      description: "O usuário foi removido com sucesso.",
    });
  };

  const toggleUserStatus = (userId: string, currentStatus: string) => {
    setUsers(users.map(user =>
      user.id === userId ? { ...user, statusId: currentStatus === 'active' ? 'inactive' as const : 'active' as const } : user
    ));
  
    toast({
      title: "Status do usuário atualizado",
      description: "O status do usuário foi alterado com sucesso.",
    });
  };

  const handleSaveUser = (userData: User) => {
    if (editingUser) {
      // Update existing user
      setUsers(users.map(user => user.id === userData.id ? userData : user));
    } else {
      // Add new user
      setUsers([...users, userData]);
    }
    setEditingUser(null);
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setUserModalOpen(true);
  };

  const handleNewUser = () => {
    setEditingUser(null);
    setUserModalOpen(true);
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || user.statusId === statusFilter;
    const matchesRole = roleFilter === 'all' || user.roleSlug === roleFilter;
    
    return matchesSearch && matchesStatus && matchesRole;
  });

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
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filtrar por status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os status</SelectItem>
                <SelectItem value="active">Ativo</SelectItem>
                <SelectItem value="inactive">Inativo</SelectItem>
              </SelectContent>
            </Select>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
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
              {filteredUsers.map((user) => (
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
                      {getRoleName(user.roleSlug)}
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

          {filteredUsers.length === 0 && (
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

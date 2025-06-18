import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Users, Plus, Edit, Trash2, Shield, Mail, Phone } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useToast } from '@/hooks/use-toast';
import { HttpClient } from '@/lib/http_client';
import { useQuery } from '@tanstack/react-query';

interface RoleSlug {
    roleSlug: 'administrator' | 'minister' | 'leader' | 'secretary' | 'treasurer' | 'user';
}

interface User {
    id?: string;
    legalName?: string;
    firstName: string;
    lastName: string;
    email: string;
    phonePrefix: string;
    phoneNumber: string;
    roleSlugArray?: RoleSlug[];
    statusId: 'active' | 'inactive';
    lastLogin?: string;
    creationTimestamp?: string;
}

const userFormSchema = z.object({
    firstName: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
    lastName: z.string().min(2, "Sobrenome deve ter pelo menos 2 caracteres"),
    email: z.string().email("Digite um e-mail válido"),
    phonePrefix: z.string().min(2, "Prefixo de telefone deve ter pelo menos 2 dígitos"),
    phoneNumber: z.string().min(10, "Telefone deve ter pelo menos 10 dígitos"),
    roleSlug: z.enum(['administrator', 'minister', 'leader', 'secretary', 'treasurer', 'user']),
    statusId: z.enum(['active', 'inactive']),
});

type UserFormValues = z.infer<typeof userFormSchema>;

const GerenciarUsuarios = () => {
    const { toast } = useToast();
    const { data: users, isLoading: isLoadingUsers, error: errorUsers } = useQuery({
        queryKey: ['users'],
        queryFn: async () => {
            return await HttpClient.get<User[]>('/church/user/list');
        }
    });

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);

    const form = useForm<UserFormValues>({
        resolver: zodResolver(userFormSchema),
        defaultValues: {
            firstName: '',
            lastName: '',
            email: '',
            phonePrefix: '',
            phoneNumber: '',
            roleSlug: 'user',
            statusId: 'active',
        },
    });

    const handleSubmit = async (data: UserFormValues) => {
        if (editingUser) {
            const updatedUser = {
                ...editingUser,
                ...data
            };
            await HttpClient.put(`/church/user/${editingUser.id}/set`, updatedUser);
            toast({
                title: "Usuário atualizado",
                description: "Os dados do usuário foram atualizados com sucesso.",
            });
        } else {
            const newUser: User = {
                firstName: data.firstName,
                lastName: data.lastName,
                email: data.email,
                phonePrefix: data.phonePrefix,
                phoneNumber: data.phoneNumber,
                roleSlugArray: data.roleSlugArray,
                statusId: data.statusId
            };
            const response = await HttpClient.post<User>('/church/user/add', newUser);
            toast({
                title: "Usuário criado",
                description: "Novo usuário foi criado com sucesso.",
            });
        }

        resetForm();
    };

    const resetForm = () => {
        form.reset();
        setEditingUser(null);
        setIsDialogOpen(false);
    };

    const handleEdit = (user: User) => {
        setEditingUser(user);
        form.reset({
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            phonePrefix: user.phonePrefix,
            phoneNumber: user.phoneNumber,
            roleSlug: user.roleSlugArray?.[0]?.roleSlug || 'user',
            statusId: user.statusId
        });
        setIsDialogOpen(true);
    };

    const handleDelete = (id: string) => {
        toast({
            title: "Usuário removido",
            description: "O usuário foi removido com sucesso.",
        });
    };

    const getRoleBadge = (role: string) => {
        const variants = {
            administrator: 'bg-red-100 text-red-800',
            minister: 'bg-purple-100 text-purple-800',
            leader: 'bg-blue-100 text-blue-800',
            secretary: 'bg-green-100 text-green-800',
            treasurer: 'bg-yellow-100 text-yellow-800',
            user: 'bg-gray-100 text-gray-800'
        };

        const labels = {
            administrator: 'Administrador',
            minister: 'Pastor',
            leader: 'Líder',
            secretary: 'Secretário',
            treasurer: 'Tesoureiro',
            user: 'Usuário'
        };

        return (
            <Badge className={variants[role]}>
                {labels[role]}
            </Badge>
        );
    };

    const getStatusBadge = (status: User['statusId']) => {
        const variants = {
            active: 'bg-green-100 text-green-800',
            inactive: 'bg-gray-100 text-gray-800',
        };

        const labels = {
            active: 'Ativo',
            inactive: 'Inativo',
        };

        return (
            <Badge className={variants[status]}>
                {labels[status]}
            </Badge>
        );
    };

    const formatDate = (dateString: string) => {
        if (!dateString) return 'Nunca';
        return new Date(dateString).toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="md:container mx-auto py-6 space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold">Gerenciar Usuários</h1>
                    <p className="text-gray-600">Gerencie usuários e suas permissões de acesso</p>
                </div>

                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button className="gap-2">
                            <Plus className="h-4 w-4" />
                            Novo Usuário
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md">
                        <DialogHeader>
                            <DialogTitle>{editingUser ? 'Editar Usuário' : 'Novo Usuário'}</DialogTitle>
                            <DialogDescription>
                                {editingUser ? 'Edite os dados do usuário' : 'Adicione um novo usuário ao sistema'}
                            </DialogDescription>
                        </DialogHeader>

                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="firstName"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Nome</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Digite o primeiro nome" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="lastName"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Sobrenome</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Digite o último nome" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>E-mail</FormLabel>
                                            <FormControl>
                                                <Input type="email" placeholder="usuario@igreja.com" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <div className="grid grid-cols-2 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="phonePrefix"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Prefixo de telefone</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="+55" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="phoneNumber"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Número de telefone</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="(00) 00000-0000" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <FormField
                                    control={form.control}
                                    name="roleSlugArray"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Função</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Selecione uma função" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="administrator">Administrador</SelectItem>
                                                    <SelectItem value="minister">Pastor</SelectItem>
                                                    <SelectItem value="leader">Líder</SelectItem>
                                                    <SelectItem value="secretary">Secretário</SelectItem>
                                                    <SelectItem value="treasurer">Tesoureiro</SelectItem>
                                                    <SelectItem value="user">Usuário</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="statusId"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Status</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Selecione o status" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="active">Ativo</SelectItem>
                                                    <SelectItem value="inactive">Inativo</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <div className="flex gap-2">
                                    <Button type="submit" className="flex-1">
                                        {editingUser ? 'Atualizar' : 'Criar'} Usuário
                                    </Button>
                                    <Button type="button" variant="outline" onClick={resetForm}>
                                        Cancelar
                                    </Button>
                                </div>
                            </form>
                        </Form>
                    </DialogContent>
                </Dialog>
            </div>

            <Card>
                <CardHeader>
                    <div className="flex items-center gap-2">
                        <Users className="h-5 w-5" />
                        <CardTitle>Usuários do Sistema</CardTitle>
                    </div>
                    <CardDescription>
                        Lista de todos os usuários com acesso ao dashboard
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Usuário</TableHead>
                                <TableHead>Contato</TableHead>
                                <TableHead>Função</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Último Acesso</TableHead>
                                <TableHead>Ações</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {users?.map((user) => (
                                <TableRow key={user.id}>
                                    <TableCell>
                                        <div>
                                            <div className="font-medium">{user.legalName}</div>
                                            <div className="text-sm text-gray-500">
                                                Criado em {formatDate(user.creationTimestamp)}
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-1 text-sm">
                                                <Mail className="h-3 w-3" />
                                                {user.email}
                                            </div>
                                            <div className="flex items-center gap-1 text-sm text-gray-500">
                                                <Phone className="h-3 w-3" />
                                                {user.phonePrefix} {user.phoneNumber}
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        {user.roleSlugArray?.map((role) => (
                                            <div className="flex items-center gap-2">
                                                <Shield className="h-4 w-4 text-gray-400" />
                                                {getRoleBadge(role.roleSlug)}
                                            </div>
                                        ))}
                                    </TableCell>
                                    <TableCell>{getStatusBadge(user.statusId)}</TableCell>
                                    <TableCell className="text-sm">
                                        {formatDate(user.lastLogin)}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex gap-2">
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => handleEdit(user)}
                                            >
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => handleDelete(user.id)}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
};

export default GerenciarUsuarios;

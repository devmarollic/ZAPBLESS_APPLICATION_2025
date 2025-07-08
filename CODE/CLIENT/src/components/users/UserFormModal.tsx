import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { DialogUser, DialogUserContent, DialogUserDescription, DialogUserFooter, DialogUserHeader, DialogUserTitle } from '@/components/ui/dialog-user';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { HttpClient } from '@/lib/http_client';

interface User {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phonePrefix: string;
    phoneNumber: string;
    roleSlug: string;
    statusId: 'active' | 'inactive';
}

interface UserFormModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    user?: User | null;
    onSave: (user: User) => void;
}

const userFormSchema = z.object({
    firstName: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
    lastName: z.string().min(2, "Sobrenome deve ter pelo menos 2 caracteres"),
    email: z.string().email("Email inválido"),
    phonePrefix: z.string().min(1, "Prefixo é obrigatório"),
    phoneNumber: z.string().min(8, "Telefone deve ter pelo menos 8 dígitos"),
    role: z.object({ roleSlug: z.string() }),
    statusId: z.enum(['active', 'inactive']),
});

type UserFormValues = z.infer<typeof userFormSchema>;

const UserFormModal = ({ open, onOpenChange, user, onSave }: UserFormModalProps) => {
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);

    const form = useForm<UserFormValues>({
        resolver: zodResolver(userFormSchema),
        defaultValues: {
            firstName: user?.firstName || '',
            lastName: user?.lastName || '',
            email: user?.email || '',
            phonePrefix: user?.phonePrefix || '+55',
            phoneNumber: user?.phoneNumber || '',
            roleSlug: user?.roleSlug || 'administrator',
            statusId: user?.statusId || 'active',
        },
    });

    const onSubmit = async (data: UserFormValues) => {
        try {
            setIsLoading(true);
            const userData: User = {
                id: user?.id,
                firstName: data.firstName,
                lastName: data.lastName,
                email: data.email,
                phonePrefix: data.phonePrefix,
                phoneNumber: data.phoneNumber,
                roleSlug: data.role.roleSlug,
                statusId: data.statusId
            };

            if ( user !== null )
            {
                await HttpClient.getDefault().put(`/church/user/${user.id}/update`, userData);
            }
            else
            {
                await HttpClient.getDefault().post(`/church/user/add`, userData);
            }

            toast({
                title: user ? "Usuário atualizado" : "Usuário criado",
                description: `O usuário foi ${user ? 'atualizado' : 'criado'} com sucesso!`,
            });

            onOpenChange(false);
            form.reset();

            onSave(userData);
        } catch (error) {
            console.error("Error saving user:", error);
            toast({
                title: "Erro ao salvar usuário",
                description: "Não foi possível salvar o usuário. Tente novamente.",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
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

    useEffect(
        () =>
        {
            form.reset({
                firstName: user?.firstName || '',
                lastName: user?.lastName || '',
                email: user?.email || '',
                phonePrefix: user?.phonePrefix || '+55',
                phoneNumber: user?.phoneNumber || '',
                role: { roleSlug: user?.role?.roleSlug || user?.roleSlug },
                statusId: user?.statusId || 'active',
            });
        },
        [user, open]
        );

    return (
        <DialogUser open={open} onOpenChange={onOpenChange}>
            <DialogUserContent className="max-w-md">
                <DialogUserHeader>
                    <DialogUserTitle>
                        {user ? 'Editar Usuário' : 'Novo Usuário'}
                    </DialogUserTitle>
                    <DialogUserDescription>
                        {user ? 'Atualize as informações do usuário' : 'Preencha os dados do novo usuário'}
                    </DialogUserDescription>
                </DialogUserHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="firstName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Nome</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Nome" {...field} />
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
                                            <Input placeholder="Sobrenome" {...field} />
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
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input disabled={!!user} type="email" placeholder="email@exemplo.com" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="grid grid-cols-3 gap-2">
                            <FormField
                                control={form.control}
                                name="phonePrefix"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Prefixo</FormLabel>
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
                                    <FormItem className="col-span-2">
                                        <FormLabel>Telefone</FormLabel>
                                        <FormControl>
                                            <Input placeholder="11999999999" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <FormField
                            control={form.control}
                            name="role.roleSlug"
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
                    </form>
                </Form>

                <DialogUserFooter>
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                    >
                        Cancelar
                    </Button>
                    <Button
                        onClick={form.handleSubmit(onSubmit)}
                        disabled={isLoading}
                    >
                        {isLoading ? "Salvando..." : user ? "Atualizar" : "Criar"}
                    </Button>
                </DialogUserFooter>
            </DialogUserContent>
        </DialogUser>
    );
};

export default UserFormModal;


import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { DialogUser, DialogUserContent, DialogUserDescription, DialogUserFooter, DialogUserHeader, DialogUserTitle } from '@/components/ui/dialog-user';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phonePrefix: string;
  phoneNumber: string;
  roleSlugArray: string[];
  statusId: 'active' | 'inactive';
  createdAt: string;
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
  roleSlug: z.enum(['administrator', 'minister', 'leader', 'secretary', 'treasurer', 'user']),
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
      roleSlugArray: user?.roleSlugArray || ['user'],
      statusId: user?.statusId || 'active',
    },
  });

  const onSubmit = async (data: UserFormValues) => {
    try {
      setIsLoading(true);
      
      const userData: User = {
        id: user?.id || Date.now().toString(),
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phonePrefix: data.phonePrefix,
        phoneNumber: data.phoneNumber,
        roleSlugArray: data.roleSlugArray,
        statusId: data.statusId,
        createdAt: user?.createdAt || new Date().toISOString(),
      };
      
      onSave(userData);
      
      toast({
        title: user ? "Usuário atualizado" : "Usuário criado",
        description: `O usuário foi ${user ? 'atualizado' : 'criado'} com sucesso!`,
      });
      
      onOpenChange(false);
      form.reset();
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
                    <Input type="email" placeholder="email@exemplo.com" {...field} />
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
              name="roleSlug"
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

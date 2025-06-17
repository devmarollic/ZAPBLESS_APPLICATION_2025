
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { HttpClient } from '@/lib/http_client';
import { User, Save } from 'lucide-react';
import { AuthenticationService } from '@/lib/authentication_service';

const userFormSchema = z.object({
  name: z.string().min(2, "O nome deve ter pelo menos 2 caracteres"),
  email: z.string().email("Digite um e-mail válido"),
  phone: z.string().min(10, "O telefone deve ter pelo menos 10 dígitos"),
});

type UserFormValues = z.infer<typeof userFormSchema>;

const MeusDados = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  
  const form = useForm<UserFormValues>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
    },
  });

  // Fetch user data when component mounts
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setIsLoading(true);
        // This would be a real API call in production
        // const userData = await HttpClient.get('/user/profile');
        
        // For now, we'll use fake data
        const userData = {
          name: "Usuário da Igreja",
          email: AuthenticationService.getUsername() || "usuario@igreja.com",
          phone: "(11) 98765-4321",
        };
        
        form.reset(userData);
      } catch (error) {
        console.error("Error fetching user data:", error);
        toast({
          title: "Erro ao carregar dados",
          description: "Não foi possível carregar seus dados. Tente novamente mais tarde.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchUserData();
  }, []);

  const onSubmit = async (data: UserFormValues) => {
    try {
      setIsLoading(true);
      
      // This would be a real API call in production
      // await HttpClient.post('/user/update', data);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Dados atualizados",
        description: "Seus dados foram atualizados com sucesso!",
      });
    } catch (error) {
      console.error("Error updating user data:", error);
      toast({
        title: "Erro ao atualizar",
        description: "Não foi possível atualizar seus dados. Tente novamente mais tarde.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="md:container mx-auto py-6">
      <h1 className="text-2xl md:text-3xl font-bold mb-6">Meus Dados</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div>
              <CardTitle className="text-sm font-medium">Informações Pessoais</CardTitle>
              <CardDescription>
                Atualize seus dados pessoais
              </CardDescription>
            </div>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome</FormLabel>
                      <FormControl>
                        <Input placeholder="Digite seu nome" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>E-mail</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="Digite seu e-mail" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Telefone</FormLabel>
                      <FormControl>
                        <Input placeholder="(00) 00000-0000" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <>Salvando...</>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Salvar Dados
                    </>
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div>
              <CardTitle className="text-sm font-medium">Segurança</CardTitle>
              <CardDescription>
                Altere sua senha de acesso
              </CardDescription>
            </div>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form className="space-y-4">
                <FormItem>
                  <FormLabel>Senha atual</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="Digite sua senha atual" />
                  </FormControl>
                </FormItem>
                
                <FormItem>
                  <FormLabel>Nova senha</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="Digite sua nova senha" />
                  </FormControl>
                </FormItem>
                
                <FormItem>
                  <FormLabel>Confirmar nova senha</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="Confirme sua nova senha" />
                  </FormControl>
                </FormItem>
                
                <Button className="w-full">
                  <Save className="mr-2 h-4 w-4" />
                  Atualizar Senha
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MeusDados;

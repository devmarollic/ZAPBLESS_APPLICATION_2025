
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { MinistryService, Ministry } from '@/services/ministryService';
import { useQuery } from '@tanstack/react-query';
import { HttpClient } from '@/lib/http_client';
import MinistryMemberSelection from '@/components/members/MinistryMemberSelection';

const ministryFormSchema = z.object({
  name: z.string().min(3, 'O nome deve ter pelo menos 3 caracteres'),
  description: z.string().min(10, 'A descrição deve ter pelo menos 10 caracteres'),
  color: z.string().min(4, 'Selecione uma cor'),
  leaderId: z.string().optional(),
  viceLeaderId: z.string().optional(),
});

type MinistryFormValues = z.infer<typeof ministryFormSchema>;

type Member = {
  id: string;
  legalName: string;
  email: string;
  phoneNumber: string;
}

interface MemberMembership {
  memberId: string;
  role: string;
}

const MinisterioEditar = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [ministry, setMinistry] = useState<Ministry | null>(null);
  const [memberMemberships, setMemberMemberships] = useState<MemberMembership[]>([]);

  const form = useForm<MinistryFormValues>({
    resolver: zodResolver(ministryFormSchema),
    defaultValues: {
      name: '',
      description: '',
      color: '#7C3AED',
      leaderId: '',
      viceLeaderId: '',
    },
  });

  const { data: members, isLoading: isLoadingMembers } = useQuery({
    queryKey: ['members'],
    queryFn: async () => {
      return await HttpClient.get<Member[]>('/church/members/list');
    }
  });

  useEffect(() => {
    const fetchMinistry = async () => {
      if (!id) return;
      
      try {
        const response = await MinistryService.getMinistry(id);
        if (response) {
          setMinistry(response);
          form.reset({
            name: response.name,
            description: response.description,
            color: response.color,
            leaderId: response.leaderId || 'none',
            viceLeaderId: response.viceLeaderId || 'none',
          });
          
          // Initialize member memberships with mock data
          const mockMemberships: MemberMembership[] = (response.memberIds || []).map(memberId => ({
            memberId,
            role: "member"
          }));
          setMemberMemberships(mockMemberships);
        }
      } catch (error) {
        console.error("Error fetching ministry:", error);
        toast({
          title: "Erro ao carregar ministério",
          description: "Não foi possível carregar os dados do ministério.",
          variant: "destructive",
        });
        navigate('/dashboard/ministerios');
      }
    };

    fetchMinistry();
  }, [id, form, toast, navigate]);

  const onSubmit = async (data: MinistryFormValues) => {
    if (!id) return;
    
    try {
      setIsLoading(true);
      
      const updateData = {
        name: data.name,
        description: data.description,
        color: data.color,
        leaderId: data.leaderId === 'none' ? undefined : data.leaderId,
        viceLeaderId: data.viceLeaderId === 'none' ? undefined : data.viceLeaderId,
        memberIds: memberMemberships.map(m => m.memberId),
        memberMemberships: memberMemberships,
      };
      
      await MinistryService.updateMinistry(id, updateData);
      
      toast({
        title: "Ministério atualizado",
        description: "O ministério foi atualizado com sucesso!",
      });

      navigate('/dashboard/ministerios');
    } catch (error) {
      console.error("Error updating ministry:", error);
      toast({
        title: "Erro ao atualizar ministério",
        description: "Não foi possível atualizar o ministério. Tente novamente mais tarde.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleMemberToggle = (memberId: string, checked: boolean, role: string = 'member') => {
    if (checked) {
      setMemberMemberships(current => [
        ...current,
        { memberId, role }
      ]);
    } else {
      setMemberMemberships(current => 
        current.filter(membership => membership.memberId !== memberId)
      );
    }
  };

  const handleUpdateMembership = (memberId: string, field: 'role', value: string) => {
    setMemberMemberships(current =>
      current.map(membership =>
        membership.memberId === memberId
          ? { ...membership, [field]: value }
          : membership
      )
    );
  };

  if (!ministry) {
    return (
      <div className="container mx-auto py-6">
        <div className="text-center">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="md:container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Editar Ministério</h1>
        <Button variant="outline" onClick={() => navigate('/dashboard/ministerios')}>
          Voltar para Ministérios
        </Button>
      </div>
      
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle>Editar Ministério</CardTitle>
          <CardDescription>
            Atualize as informações do ministério
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome do Ministério</FormLabel>
                    <FormControl>
                      <Input placeholder="Digite o nome do ministério" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descrição</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Digite a descrição do ministério"
                        rows={3}
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="color"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cor</FormLabel>
                    <FormControl>
                      <div className="flex gap-2">
                        <Input type="color" className="w-16 h-10" {...field} />
                        <Input value={field.value} onChange={field.onChange} placeholder="#7C3AED" />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="leaderId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Líder</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                        disabled={isLoadingMembers}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder={isLoadingMembers ? "Carregando..." : "Selecione um líder"} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="none">Nenhum líder</SelectItem>
                          {(members ?? []).map((member) => (
                            <SelectItem key={member.id} value={member.id}>
                              {member.legalName}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="viceLeaderId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Vice-Líder</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                        disabled={isLoadingMembers}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder={isLoadingMembers ? "Carregando..." : "Selecione um vice-líder"} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="none">Nenhum vice-líder</SelectItem>
                          {(members ?? []).map((member) => (
                            <SelectItem key={member.id} value={member.id}>
                              {member.legalName}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <MinistryMemberSelection
                members={members}
                isLoadingMembers={isLoadingMembers}
                memberMemberships={memberMemberships}
                onMemberToggle={handleMemberToggle}
                onUpdateMembership={handleUpdateMembership}
              />

              <div className="flex gap-4 pt-4">
                <Button type="submit" disabled={isLoading} className="flex-1">
                  {isLoading ? "Atualizando..." : "Atualizar Ministério"}
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => navigate('/dashboard/ministerios')}
                  className="flex-1"
                >
                  Cancelar
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default MinisterioEditar;

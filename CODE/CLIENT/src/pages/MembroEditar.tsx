import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Save, User } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { HttpClient } from '@/lib/http_client';
import MemberBasicInfoForm from '@/components/members/MemberBasicInfoForm';
import MemberMinistrySelection from '@/components/members/MemberMinistrySelection';
import MemberDeleteDialog from '@/components/members/MemberDeleteDialog';
import { memberFormSchema, MemberFormValues, Ministry, MinistryMembership } from '@/types/member';

// Mock data for testing
const mockMemberData = {
  id: "123",
  name: "João Silva",
  email: "joao.silva@email.com",
  phone: "(11) 98765-4321",
  birthDate: new Date("1990-05-15"),
  address: "Rua das Flores, 123 - São Paulo, SP",
  ministries: ["1", "3"],
  baptismDate: new Date("2015-03-30"),
  notes: "Membro desde 2015, participa ativamente dos cultos de domingo.",
  status: "active",
  ecclesiasticalTitle: "deacon",
};

const MembroEditar = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [ministryMemberships, setMinistryMemberships] = useState<MinistryMembership[]>([]);

  const form = useForm<MemberFormValues>({
    resolver: zodResolver(memberFormSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      address: '',
      notes: '',
      status: 'active',
      ministries: [],
      ecclesiasticalTitle: '',
    },
  });

  const { data: ministries, isLoading: isLoadingMinistries } = useQuery({
    queryKey: ['ministries'],
    queryFn: async () => {
      return await HttpClient.get<Ministry[]>('/ministry/list');
    }
  });

  useEffect(() => {
    const fetchMemberData = async () => {
      try {
        setIsLoading(true);
        
        // In a real app, this would be an API call
        // const data = await HttpClient.get(`/members/${memberId}`);
        
        // Using mock data for now
        const data = mockMemberData;
        
        form.reset({
          name: data.name,
          email: data.email,
          phone: data.phone,
          birthDate: data.birthDate,
          address: data.address,
          baptismDate: data.baptismDate,
          notes: data.notes,
          status: data.status,
          ecclesiasticalTitle: data.ecclesiasticalTitle,
        });
        
        // Initialize ministry memberships with mock data
        const mockMemberships: MinistryMembership[] = data.ministries.map(ministryId => ({
          ministryId,
          role: "member"
        }));
        setMinistryMemberships(mockMemberships);
      } catch (error) {
        console.error("Error fetching member data:", error);
        toast({
          title: "Erro ao carregar dados",
          description: "Não foi possível carregar os dados do membro.",
          variant: "destructive",
        });
        navigate('/dashboard/membros');
      } finally {
        setIsLoading(false);
      }
    };
    
    if (id) {
      fetchMemberData();
    } else {
      navigate('/dashboard/membros');
    }
  }, [id, navigate, toast, form]);

  const onSubmit = async (data: MemberFormValues) => {
    try {
      setIsLoading(true);
      
      // Add ministry memberships to the form data
      const submitData = {
        ...data,
        ministryMemberships
      };
      
      // This would be a real API call in production
      // await HttpClient.post(`/members/${memberId}/update`, submitData);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Membro atualizado",
        description: "Os dados do membro foram atualizados com sucesso!",
      });

      navigate('/dashboard/membros');
    } catch (error) {
      console.error("Error updating member:", error);
      toast({
        title: "Erro ao atualizar",
        description: "Não foi possível atualizar os dados do membro. Tente novamente mais tarde.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleMinistryToggle = (ministryId: string, checked: boolean) => {
    if (checked) {
      setMinistryMemberships(current => [
        ...current,
        { ministryId, role: "member" }
      ]);
    } else {
      setMinistryMemberships(current => 
        current.filter(membership => membership.ministryId !== ministryId)
      );
    }
  };

  const updateMinistryMembership = (ministryId: string, field: 'role', value: string) => {
    setMinistryMemberships(current =>
      current.map(membership =>
        membership.ministryId === ministryId
          ? { ...membership, [field]: value }
          : membership
      )
    );
  };

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      
      // This would be a real API call in production
      // await HttpClient.delete(`/members/${memberId}`);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Membro excluído",
        description: "O membro foi excluído com sucesso.",
      });

      navigate('/dashboard/membros');
    } catch (error) {
      console.error("Error deleting member:", error);
      toast({
        title: "Erro ao excluir",
        description: "Não foi possível excluir o membro. Tente novamente mais tarde.",
        variant: "destructive",
      });
      setIsDeleting(false);
    }
  };

  if (isLoading && !form.formState.isDirty) {
    return (
      <div className="container mx-auto py-6 flex justify-center items-center">
        <p>Carregando dados do membro...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl md:text-3xl font-bold">Editar Membro</h1>
        <div className="flex gap-2">
          <MemberDeleteDialog 
            isDeleting={isDeleting}
            onDelete={handleDelete}
          />
          
          <Button variant="outline" onClick={() => navigate('/dashboard/membros')}>
            Voltar para Membros
          </Button>
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <User className="mr-2 h-5 w-5" />
            Editar Membro
          </CardTitle>
          <CardDescription>
            Atualize os dados do membro
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <MemberBasicInfoForm control={form.control} />
              
              <MemberMinistrySelection
                ministries={ministries}
                isLoadingMinistries={isLoadingMinistries}
                ministryMemberships={ministryMemberships}
                onMinistryToggle={handleMinistryToggle}
                onUpdateMembership={updateMinistryMembership}
              />
              
              <div className="flex justify-end gap-4 pt-4">
                <Button type="button" variant="outline" onClick={() => navigate('/dashboard/membros')}>
                  Cancelar
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? (
                    <>Salvando...</>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Salvar Alterações
                    </>
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default MembroEditar;

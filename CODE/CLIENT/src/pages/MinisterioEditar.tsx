
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
import VirtualizedSelect from '@/components/ui/virtualized-select';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { MinistryService, Ministry } from '@/services/ministryService';
import { ContactService, Contact } from '@/services/contactService';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { HttpClient } from '@/lib/http_client';
import ContactSelection from '@/components/members/ContactSelection';
import MinistryStats from '@/components/members/MinistryStats';
import { Trash2 } from 'lucide-react';
import { AuthenticationService } from '@/lib/authentication_service';
import { useMinistryValidation } from '@/hooks/use-ministry-validation';

const ministryFormSchema = z.object({
  name: z.string().min(3, 'O nome deve ter pelo menos 3 caracteres'),
  description: z.string().min(10, 'A descrição deve ter pelo menos 10 caracteres'),
  color: z.string().min(4, 'Selecione uma cor'),
  leaderId: z.string().optional(),
  viceLeaderId: z.string().optional(),
});

type MinistryFormValues = z.infer<typeof ministryFormSchema>;

type Member = Contact;

interface MemberMembership {
  memberId: string;
  role: string;
}

const MinisterioEditar = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
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

  // Get all contacts for selection
  const { data: allContacts, isLoading: isLoadingAllContacts } = useQuery({
    queryKey: ['contacts', 'church'],
    queryFn: async () => {
      const churchId = AuthenticationService.getChurchId();
      return await ContactService.getContactsByChurch(churchId);
    }
  });

  const { validateMemberAddition, validateMinistryData, validationErrors, clearValidationErrors } = useMinistryValidation({
    memberMemberships,
    contacts: allContacts
  });

  useEffect(() => {
    const fetchMinistry = async () => {
      if (!id) return;
      
      try {
        const ministryResponse = await MinistryService.getMinistry(id);
        
        if (ministryResponse) {
          console.log('Ministry Response:', ministryResponse);
          setMinistry(ministryResponse);
          
          const formData = {
            name: ministryResponse.name,
            description: ministryResponse.description,
            color: ministryResponse.color,
            leaderId: 'none', // Will be determined from members later
            viceLeaderId: 'none', // Will be determined from members later
          };
          
          console.log('Form Data:', formData);
          
          // Use setValue to ensure fields are properly set
          form.setValue('name', formData.name);
          form.setValue('description', formData.description);
          form.setValue('color', formData.color);
          form.setValue('leaderId', formData.leaderId);
          form.setValue('viceLeaderId', formData.viceLeaderId);
          
          // Initialize member memberships from API response
          const memberships: MemberMembership[] = ministryResponse.members.map(member => ({
            memberId: member.contactId,
            role: member.roleSlug
          }));
          setMemberMemberships(memberships);
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

  // Ensure form values are set when ministry data is available
  useEffect(() => {
    if (ministry) {
      form.setValue('name', ministry.name);
      form.setValue('description', ministry.description);
      form.setValue('color', ministry.color);
      
      // Set leader and vice-leader based on member roles
      const leaderMember = ministry.members.find(m => m.roleSlug === 'leader');
      const viceLeaderMember = ministry.members.find(m => m.roleSlug === 'vice_leader');
      
      form.setValue('leaderId', leaderMember ? leaderMember.contactId : 'none');
      form.setValue('viceLeaderId', viceLeaderMember ? viceLeaderMember.contactId : 'none');
    }
  }, [ministry, form]);



  const onSubmit = async (data: MinistryFormValues) => {
    if (!id) return;
    
    // Clear previous validation errors
    clearValidationErrors();
    
    // Ensure leaders are added as members if they're not already
    const updatedMemberships = [...memberMemberships];
    
    if (data.leaderId !== 'none') {
      const isLeaderMember = updatedMemberships.some(m => m.memberId === data.leaderId);
      if (!isLeaderMember) {
        updatedMemberships.push({ memberId: data.leaderId, role: 'leader' });
      } else {
        // Update existing member to leader role
        const memberIndex = updatedMemberships.findIndex(m => m.memberId === data.leaderId);
        if (memberIndex !== -1) {
          updatedMemberships[memberIndex].role = 'leader';
        }
      }
    }
    
    if (data.viceLeaderId !== 'none') {
      const isViceLeaderMember = updatedMemberships.some(m => m.memberId === data.viceLeaderId);
      if (!isViceLeaderMember) {
        updatedMemberships.push({ memberId: data.viceLeaderId, role: 'vice_leader' });
      } else {
        // Update existing member to vice leader role
        const memberIndex = updatedMemberships.findIndex(m => m.memberId === data.viceLeaderId);
        if (memberIndex !== -1) {
          updatedMemberships[memberIndex].role = 'vice_leader';
        }
      }
    }
    
    // Update the state with the new memberships
    setMemberMemberships(updatedMemberships);
    
    // Validate ministry data before submission
    if (!validateMinistryData(data)) {
      return;
    }
    
    try {
      setIsLoading(true);
      
      // First update the ministry basic info
      const updateData = {
        name: data.name,
        description: data.description,
        color: data.color,
        leaderId: data.leaderId === 'none' ? undefined : data.leaderId,
        viceLeaderId: data.viceLeaderId === 'none' ? undefined : data.viceLeaderId,
      };
      
      await MinistryService.updateMinistry(id, updateData);
      
      // Then handle member changes efficiently
      const currentMembersData = ministry?.members || [];
      const currentMemberIds = new Set(currentMembersData.map(m => m.contactId));
      const newMemberIds = new Set(updatedMemberships.map(m => m.memberId));
      
      // Create arrays for batch operations
      const membersToRemove = currentMembersData.filter(m => !newMemberIds.has(m.contactId));
      const membersToAdd = updatedMemberships.filter(m => !currentMemberIds.has(m.memberId));
      
      // Execute removals in parallel
      await Promise.all(
        membersToRemove.map(member => 
          MinistryService.removeMemberFromMinistry(id, member.contactId)
        )
      );
      
      // Execute additions in parallel
      await Promise.all(
        membersToAdd.map(membership => 
          MinistryService.addMemberToMinistry(id, {
            contactId: membership.memberId,
            roleSlug: membership.role
          })
        )
      );
      
      // Invalidate related queries to refresh data
      await queryClient.invalidateQueries({ queryKey: ['contacts', 'church'] });
      
      toast({
        title: "Ministério atualizado",
        description: "O ministério foi atualizado com sucesso!",
      });

      navigate('/dashboard/ministerios/gerenciar');
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
      // Validate member addition
      if (!validateMemberAddition(memberId, role)) {
        return;
      }
      
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

  const handleLeaderChange = (leaderId: string) => {
    const formData = form.getValues();
    
    // If selecting a leader, add them as a member if not already present
    if (leaderId !== 'none') {
      const isAlreadyMember = memberMemberships.some(m => m.memberId === leaderId);
      
      if (!isAlreadyMember) {
        setMemberMemberships(current => [
          ...current,
          { memberId: leaderId, role: 'leader' }
        ]);
      } else {
        // Update existing member to leader role
        setMemberMemberships(current =>
          current.map(membership =>
            membership.memberId === leaderId
              ? { ...membership, role: 'leader' }
              : membership
          )
        );
      }
    }
    
    // If removing leader, update their role to member if they exist
    if (leaderId === 'none' && formData.leaderId !== 'none') {
      setMemberMemberships(current =>
        current.map(membership =>
          membership.memberId === formData.leaderId
            ? { ...membership, role: 'member' }
            : membership
        )
      );
    }
    
    // If the new leader was previously vice-leader, clear vice-leader
    if (leaderId !== 'none' && formData.viceLeaderId === leaderId) {
      form.setValue('viceLeaderId', 'none');
      setMemberMemberships(current =>
        current.map(membership =>
          membership.memberId === leaderId
            ? { ...membership, role: 'leader' }
            : membership
        )
      );
    }
  };

  const handleViceLeaderChange = (viceLeaderId: string) => {
    const formData = form.getValues();
    
    // If selecting a vice leader, add them as a member if not already present
    if (viceLeaderId !== 'none') {
      const isAlreadyMember = memberMemberships.some(m => m.memberId === viceLeaderId);
      
      if (!isAlreadyMember) {
        setMemberMemberships(current => [
          ...current,
          { memberId: viceLeaderId, role: 'vice_leader' }
        ]);
      } else {
        // Update existing member to vice leader role
        setMemberMemberships(current =>
          current.map(membership =>
            membership.memberId === viceLeaderId
              ? { ...membership, role: 'vice_leader' }
              : membership
          )
        );
      }
    }
    
    // If removing vice leader, update their role to member if they exist
    if (viceLeaderId === 'none' && formData.viceLeaderId !== 'none') {
      setMemberMemberships(current =>
        current.map(membership =>
          membership.memberId === formData.viceLeaderId
            ? { ...membership, role: 'member' }
            : membership
        )
      );
    }
  };

  const handleDeleteMinistry = async () => {
    if (!id) return;
    
    try {
      setIsLoading(true);
      await MinistryService.deleteMinistry(id);
      
      toast({
        title: "Ministério excluído",
        description: "O ministério foi excluído com sucesso!",
      });
      
      navigate('/dashboard/ministerios/gerenciar');
    } catch (error) {
      console.error("Error deleting ministry:", error);
      toast({
        title: "Erro ao excluir ministério",
        description: "Não foi possível excluir o ministério. Tente novamente mais tarde.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
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
        <div className="flex gap-2">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="sm">
                <Trash2 className="h-4 w-4 mr-2" />
                Excluir Ministério
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Excluir Ministério</AlertDialogTitle>
                <AlertDialogDescription>
                  Tem certeza que deseja excluir este ministério? Esta ação não pode ser desfeita.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction onClick={handleDeleteMinistry} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                  Excluir
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          <Button variant="outline" onClick={() => navigate('/dashboard/ministerios/gerenciar')}>
            Voltar para Ministérios
          </Button>
        </div>
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

              {validationErrors.length > 0 && (
                <div className="p-4 border border-destructive rounded-lg bg-destructive/10">
                  <h4 className="font-medium text-destructive mb-2">Erros de Validação:</h4>
                  <ul className="text-sm text-destructive space-y-1">
                    {validationErrors.map((error, index) => (
                      <li key={index}>• {error}</li>
                    ))}
                  </ul>
                </div>
              )}

              <MinistryStats 
                contacts={allContacts}
                memberMemberships={memberMemberships}
              />

              <ContactSelection
                contacts={allContacts}
                isLoadingContacts={isLoadingAllContacts}
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
                  onClick={() => navigate('/dashboard/ministerios/gerenciar')}
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

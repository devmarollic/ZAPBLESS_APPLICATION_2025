
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { MinistryService } from '@/services/ministryService';
import { ContactService, Contact } from '@/services/contactService';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { AuthenticationService } from '@/lib/authentication_service';
import { useMinistryValidation } from '@/hooks/use-ministry-validation';
import ContactSelection from '@/components/members/ContactSelection';
import MinistryStats from '@/components/members/MinistryStats';

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

const MinisterioNovo = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);
  const [memberMemberships, setMemberMemberships] = useState<MemberMembership[]>([]);

  const form = useForm<MinistryFormValues>({
    resolver: zodResolver(ministryFormSchema),
    defaultValues: {
      name: '',
      description: '',
      color: '#7C3AED',
      leaderId: 'none',
      viceLeaderId: 'none',
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

  const onSubmit = async (data: MinistryFormValues) => {
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
      
      const churchId = AuthenticationService.getChurchId();
      
      // Create the ministry with basic info
      const createData = {
        name: data.name,
        description: data.description,
        color: data.color,
        churchId: churchId,
      };
      
      const newMinistry = await MinistryService.createMinistry(createData);
      
      // Add members to the ministry
      if (updatedMemberships.length > 0) {
        await Promise.all(
          updatedMemberships.map(membership => 
            MinistryService.addMemberToMinistry(newMinistry.id, {
              contactId: membership.memberId,
              roleSlug: membership.role
            })
          )
        );
      }
      
      // Invalidate related queries to refresh data
      await queryClient.invalidateQueries({ queryKey: ['contacts', 'church'] });
      
      toast({
        title: "Ministério criado",
        description: "O ministério foi criado com sucesso!",
      });

      navigate('/dashboard/ministerios/gerenciar');
    } catch (error) {
      console.error("Error creating ministry:", error);
      toast({
        title: "Erro ao criar ministério",
        description: "Não foi possível criar o ministério. Tente novamente mais tarde.",
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

  return (
    <div className="md:container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Novo Ministério</h1>
        <Button variant="outline" onClick={() => navigate('/dashboard/ministerios/gerenciar')}>
          Voltar para Ministérios
        </Button>
      </div>
      
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle>Novo Ministério</CardTitle>
          <CardDescription>
            Crie um novo ministério para sua igreja
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
                  {isLoading ? "Criando..." : "Criar Ministério"}
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

export default MinisterioNovo;

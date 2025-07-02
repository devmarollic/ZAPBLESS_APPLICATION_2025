
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { HttpClient } from '@/lib/http_client';
import { useToast } from '@/hooks/use-toast';

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Save } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useQuery } from '@tanstack/react-query';
import MinistryMemberSelection from '@/components/members/MinistryMemberSelection';

const ministerioFormSchema = z.object({
    name: z.string().min(3, { message: 'O nome deve ter pelo menos 3 caracteres' }),
    description: z.string().min(10, { message: 'A descrição deve ter pelo menos 10 caracteres' }),
    leaderId: z.string().optional(),
    viceLeaderId: z.string().optional(),
    color: z.string().min(4, 'Selecione uma cor'),
});

type MinisterioFormValues = z.infer<typeof ministerioFormSchema>;

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

const MinisterioNovo = () => {
    const navigate = useNavigate();
    const { toast } = useToast();
    const [memberMemberships, setMemberMemberships] = React.useState<MemberMembership[]>([]);

    const form = useForm<MinisterioFormValues>({
        resolver: zodResolver(ministerioFormSchema),
        defaultValues: {
            name: '',
            description: '',
            leaderId: 'none',
            viceLeaderId: 'none',
            color: '#7C3AED',
        },
    });

    const { data: members, isLoading: isLoadingMembers } = useQuery({
        queryKey: ['members'],
        queryFn: async () => {
            return await HttpClient.get<Member[]>('/church/members/list');
        }
    });

    const onSubmit = async (data: MinisterioFormValues) => {
        try {
            const payload = {
                name: data.name,
                description: data.description,
                leaderId: data.leaderId === 'none' ? undefined : data.leaderId,
                viceLeaderId: data.viceLeaderId === 'none' ? undefined : data.viceLeaderId,
                color: data.color,
                memberMemberships: memberMemberships,
            };

            await HttpClient.post('/ministry/add', payload);

            toast({
                title: 'Ministério criado',
                description: 'O ministério foi criado com sucesso!',
            });

            navigate('/dashboard/ministerios');
        } catch (error) {
            console.error('Failed to create ministry:', error);

            toast({
                title: 'Erro ao criar ministério',
                description: 'Não foi possível criar o ministério. Tente novamente.',
                variant: 'destructive',
            });
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

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Novo Ministério</h1>
                <Button
                    variant="outline"
                    onClick={() => navigate('/dashboard/ministerios')}
                >
                    <ArrowLeft className="mr-2 h-4 w-4" /> Voltar
                </Button>
            </div>

            <div className="rounded-lg border bg-card shadow-sm p-6">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Nome do Ministério</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Ex: Ministério de Louvor" {...field} />
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
                                            placeholder="Descreva o propósito e atividades deste ministério..."
                                            className="min-h-[120px]"
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
                                            defaultValue={field.value}
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
                                            defaultValue={field.value}
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

                        <div className="flex justify-end">
                            <Button
                                type="submit"
                                className="bg-gradient-to-r from-zapBlue-600 to-zapPurple-600 hover:from-zapBlue-700 hover:to-zapPurple-700"
                                disabled={form.formState.isSubmitting}
                            >
                                {form.formState.isSubmitting ? (
                                    <>
                                        <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-t-transparent" />
                                        Salvando...
                                    </>
                                ) : (
                                    <>
                                        <Save className="mr-2 h-4 w-4" /> Salvar
                                    </>
                                )}
                            </Button>
                        </div>
                    </form>
                </Form>
            </div>
        </div>
    );
};

export default MinisterioNovo;


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
import { AuthenticationService } from '@/lib/authentication_service';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useQuery } from '@tanstack/react-query';

const ministerioFormSchema = z.object({
    name: z.string().min(3, { message: 'O nome deve ter pelo menos 3 caracteres' }),
    description: z.string().min(10, { message: 'A descrição deve ter pelo menos 10 caracteres' }),
    leaderId: z.string(),
});

type MinisterioFormValues = z.infer<typeof ministerioFormSchema>;

type Member = {
    id: string;
    legalName: string;
    email: string;
    phoneNumber: string;
}

const MinisterioNovo = () => {
    const navigate = useNavigate();
    const { toast } = useToast();

    const form = useForm<MinisterioFormValues>({
        resolver: zodResolver(ministerioFormSchema),
        defaultValues: {
            name: '',
            description: '',
            leaderId: ''
        },
    });

    const onSubmit = async (data: MinisterioFormValues) => {
        try {
            await HttpClient.post('/ministry/add', data);

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

    const { data: members, isLoading: isLoadingMembers, error: errorMembers } = useQuery({
        queryKey: ['members'],
        queryFn: async () => {
            return await HttpClient.get<Member[]>('/church/members/list');
        }
    });

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
                            name="leaderId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Selecione o líder</FormLabel>
                                    <Select
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                        disabled={isLoadingMembers}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder={isLoadingMembers ? "Carregando..." : "Selecione um membro"} />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
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

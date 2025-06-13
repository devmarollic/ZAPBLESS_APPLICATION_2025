
import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useQuery } from '@tanstack/react-query';
import { HttpClient } from '@/lib/http_client';
import { useToast } from '@/hooks/use-toast';
import { Ministry } from '@/types/ministry';

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

const ministerioFormSchema = z.object({
  name: z.string().min(3, { message: 'O nome deve ter pelo menos 3 caracteres' }),
  description: z.string().min(10, { message: 'A descrição deve ter pelo menos 10 caracteres' }),
  leader: z.string().optional(),
});

type MinisterioFormValues = z.infer<typeof ministerioFormSchema>;

const MinisterioEditar = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const form = useForm<MinisterioFormValues>({
    resolver: zodResolver(ministerioFormSchema),
    defaultValues: {
      name: '',
      description: '',
      leader: '',
    },
  });
  
  const { data: ministry, isLoading, error } = useQuery({
    queryKey: ['ministry', id],
    queryFn: async () => {
      if (!id) throw new Error('Ministry ID is required');
      return await HttpClient.get<Ministry>(`/ministry/${id}`);
    },
    enabled: !!id
  });
  
  useEffect(() => {
    if (ministry) {
      form.reset({
        name: ministry.name,
        description: ministry.description,
        leader: ministry.leader || '',
      });
    }
  }, [ministry, form]);

  const onSubmit = async (data: MinisterioFormValues) => {
    if (!id) return;
    
    try {
      await HttpClient.put(`/ministry/${id}`, JSON.stringify(data));
      
      toast({
        title: 'Ministério atualizado',
        description: 'As informações foram atualizadas com sucesso!',
      });
      
      navigate('/dashboard/ministerios');
    } catch (error) {
      console.error('Failed to update ministry:', error);
      
      toast({
        title: 'Erro ao atualizar',
        description: 'Não foi possível atualizar o ministério. Tente novamente.',
        variant: 'destructive',
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-zapPurple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando dados do ministério...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-4">
        <h2 className="text-2xl font-bold text-red-600 mb-2">Erro ao carregar ministério</h2>
        <p className="text-gray-600 mb-4">Não foi possível carregar os dados do ministério.</p>
        <Button onClick={() => navigate('/dashboard/ministerios')}>Voltar para a lista</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Editar Ministério</h1>
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
                    <Input {...field} />
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
              name="leader"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Líder (opcional)</FormLabel>
                  <FormControl>
                    <Input placeholder="Nome do líder" {...field} />
                  </FormControl>
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

export default MinisterioEditar;


import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { HttpClient } from '@/lib/http_client';
import { useToast } from '@/hooks/use-toast';
import { Announcement } from '@/types/announcement';

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowLeft, Save, Trash2, Calendar } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

const announcementFormSchema = z.object({
  title: z.string().min(3, { message: 'O título deve ter pelo menos 3 caracteres' }),
  content: z.string().min(10, { message: 'O conteúdo deve ter pelo menos 10 caracteres' }),
  author: z.string().optional(),
  expires_at: z.date().optional().nullable(),
  priority: z.enum(['low', 'medium', 'high']).default('medium'),
  category: z.string().optional(),
  is_active: z.boolean().default(true),
});

type AnnouncementFormValues = z.infer<typeof announcementFormSchema>;

const AvisoGerenciar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  
  const [announcement, setAnnouncement] = useState<Announcement | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  
  const form = useForm<AnnouncementFormValues>({
    resolver: zodResolver(announcementFormSchema),
    defaultValues: {
      title: '',
      content: '',
      author: '',
      priority: 'medium',
      category: '',
      is_active: true,
    },
  });
  
  // Extract announcement ID from query params
  const searchParams = new URLSearchParams(location.search);
  const announcementId = searchParams.get('id');
  
  useEffect(() => {
    if (!announcementId) {
      toast({
        title: 'Erro',
        description: 'ID do aviso não fornecido.',
        variant: 'destructive',
      });
      navigate('/dashboard/avisos');
      return;
    }
    
    const fetchAnnouncement = async () => {
      try {
        setIsLoading(true);
        // For development, use mock data
        const mockAnnouncement: Announcement = {
          id: announcementId,
          title: 'Culto Especial de Páscoa',
          content: 'Venha participar do nosso culto especial de Páscoa neste domingo às 18h. Teremos louvor, palavra e santa ceia. Não perca esta celebração especial!',
          author: 'Pastor João',
          published_at: new Date().toISOString(),
          expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          is_active: true,
          priority: 'high',
          category: 'eventos',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        
        // Uncomment when backend is ready
        // const data = await HttpClient.get<Announcement>(`/avisos/${announcementId}`);
        // setAnnouncement(data);
        
        setAnnouncement(mockAnnouncement);
        
        // Set form default values
        form.reset({
          title: mockAnnouncement.title,
          content: mockAnnouncement.content,
          author: mockAnnouncement.author,
          expires_at: mockAnnouncement.expires_at ? new Date(mockAnnouncement.expires_at) : undefined,
          priority: mockAnnouncement.priority || 'medium',
          category: mockAnnouncement.category,
          is_active: mockAnnouncement.is_active,
        });
        
      } catch (error) {
        console.error('Failed to fetch announcement:', error);
        
        toast({
          title: 'Erro ao carregar aviso',
          description: 'Não foi possível carregar os detalhes do aviso.',
          variant: 'destructive',
        });
        
        navigate('/dashboard/avisos');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchAnnouncement();
  }, [announcementId, navigate, toast, form]);
  
  const onSubmit = async (data: AnnouncementFormValues) => {
    if (!announcement) return;
    
    try {
      // Uncomment this when backend is ready
      // await HttpClient.patch(`/avisos/${announcement.id}`, JSON.stringify(data));
      
      toast({
        title: 'Aviso atualizado',
        description: 'O aviso foi atualizado com sucesso!',
      });
      
      setIsEditMode(false);
      
      // Update local state
      setAnnouncement({
        ...announcement,
        ...data,
        expires_at: data.expires_at ? data.expires_at.toISOString() : undefined,
      });
    } catch (error) {
      console.error('Failed to update announcement:', error);
      
      toast({
        title: 'Erro ao atualizar aviso',
        description: 'Não foi possível atualizar o aviso. Tente novamente.',
        variant: 'destructive',
      });
    }
  };
  
  const handleDelete = async () => {
    if (!announcement) return;
    
    try {
      // Uncomment when backend is ready
      // await HttpClient.patch(`/avisos/${announcement.id}/delete`, null);
      
      toast({
        title: 'Aviso excluído',
        description: 'O aviso foi excluído com sucesso!',
      });
      
      navigate('/dashboard/avisos');
    } catch (error) {
      console.error('Failed to delete announcement:', error);
      
      toast({
        title: 'Erro ao excluir aviso',
        description: 'Não foi possível excluir o aviso. Tente novamente.',
        variant: 'destructive',
      });
    } finally {
      setDeleteDialogOpen(false);
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-zapPurple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando aviso...</p>
        </div>
      </div>
    );
  }
  
  if (!announcement) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-4">
        <h2 className="text-2xl font-bold text-red-600 mb-2">Aviso não encontrado</h2>
        <p className="text-gray-600 mb-4">O aviso que você está tentando acessar não existe ou foi removido.</p>
        <Button onClick={() => navigate('/dashboard/avisos')}>Voltar para Avisos</Button>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">
          {isEditMode ? 'Editar Aviso' : 'Detalhes do Aviso'}
        </h1>
        <div className="flex gap-2">
          {!isEditMode && (
            <Button
              variant="outline"
              onClick={() => setIsEditMode(true)}
            >
              Editar
            </Button>
          )}
          <Button
            variant="outline"
            onClick={() => navigate('/dashboard/avisos')}
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Voltar
          </Button>
        </div>
      </div>
      
      <div className="rounded-lg border bg-card shadow-sm p-6">
        {isEditMode ? (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Título do Aviso</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Conteúdo</FormLabel>
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
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="author"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Autor (opcional)</FormLabel>
                      <FormControl>
                        <Input {...field} value={field.value || ''} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Categoria (opcional)</FormLabel>
                      <FormControl>
                        <Input {...field} value={field.value || ''} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="priority"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Prioridade</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione uma prioridade" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="low">Baixa</SelectItem>
                          <SelectItem value="medium">Média</SelectItem>
                          <SelectItem value="high">Alta</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="expires_at"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Data de Expiração</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              className={`w-full pl-3 text-left font-normal ${
                                !field.value ? "text-muted-foreground" : ""
                              }`}
                            >
                              {field.value ? (
                                format(field.value, "PPP", { locale: ptBR })
                              ) : (
                                <span>Selecione uma data</span>
                              )}
                              <Calendar className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <CalendarComponent
                            mode="single"
                            selected={field.value || undefined}
                            onSelect={field.onChange}
                            disabled={(date) => date < new Date()}
                            initialFocus
                            locale={ptBR}
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="is_active"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Aviso ativo</FormLabel>
                      <p className="text-sm text-muted-foreground">
                        Este aviso estará visível para todos os membros.
                      </p>
                    </div>
                  </FormItem>
                )}
              />
              
              <div className="flex justify-between">
                <Button
                  type="button"
                  variant="destructive"
                  onClick={() => setDeleteDialogOpen(true)}
                >
                  <Trash2 className="mr-2 h-4 w-4" /> Excluir
                </Button>
                
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setIsEditMode(false);
                      form.reset({
                        title: announcement.title,
                        content: announcement.content,
                        author: announcement.author,
                        expires_at: announcement.expires_at ? new Date(announcement.expires_at) : undefined,
                        priority: announcement.priority || 'medium',
                        category: announcement.category,
                        is_active: announcement.is_active,
                      });
                    }}
                  >
                    Cancelar
                  </Button>
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
              </div>
            </form>
          </Form>
        ) : (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-semibold">{announcement.title}</h2>
              {announcement.author && (
                <p className="text-gray-600 mt-1">Por: {announcement.author}</p>
              )}
            </div>
            
            <div className="flex flex-wrap gap-3">
              {announcement.priority && (
                <div className="inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold bg-gray-100">
                  Prioridade: 
                  <span className={`ml-1 ${
                    announcement.priority === 'high' ? 'text-red-600' :
                    announcement.priority === 'medium' ? 'text-yellow-600' : 'text-green-600'
                  }`}>
                    {announcement.priority === 'high' ? 'Alta' :
                     announcement.priority === 'medium' ? 'Média' : 'Baixa'}
                  </span>
                </div>
              )}
              
              {announcement.category && (
                <div className="inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold bg-gray-100">
                  Categoria: {announcement.category}
                </div>
              )}
              
              <div className="inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold bg-gray-100">
                Status: {announcement.is_active ? (
                  <span className="ml-1 text-green-600">Ativo</span>
                ) : (
                  <span className="ml-1 text-red-600">Inativo</span>
                )}
              </div>
            </div>
            
            <div className="prose max-w-none">
              <p>{announcement.content}</p>
            </div>
            
            <div className="pt-4 border-t border-gray-200 flex justify-between text-sm text-gray-500">
              <div>
                {announcement.created_at && (
                  <p>Criado em: {format(new Date(announcement.created_at), 'PPPp', { locale: ptBR })}</p>
                )}
                {announcement.updated_at && announcement.updated_at !== announcement.created_at && (
                  <p>Atualizado em: {format(new Date(announcement.updated_at), 'PPPp', { locale: ptBR })}</p>
                )}
              </div>
              <div>
                {announcement.expires_at && (
                  <p>Expira em: {format(new Date(announcement.expires_at), 'PPPp', { locale: ptBR })}</p>
                )}
              </div>
            </div>
            
            <div className="flex justify-between pt-4">
              <Button
                variant="destructive"
                onClick={() => setDeleteDialogOpen(true)}
              >
                <Trash2 className="mr-2 h-4 w-4" /> Excluir
              </Button>
              
              <Button
                onClick={() => setIsEditMode(true)}
                className="bg-gradient-to-r from-zapBlue-600 to-zapPurple-600 hover:from-zapBlue-700 hover:to-zapPurple-700"
              >
                Editar
              </Button>
            </div>
          </div>
        )}
      </div>
      
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir aviso</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. Isso excluirá permanentemente o aviso
              <span className="font-semibold"> {announcement.title}</span>.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AvisoGerenciar;

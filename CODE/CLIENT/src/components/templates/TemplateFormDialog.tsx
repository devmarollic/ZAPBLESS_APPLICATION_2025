
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Template, TemplateCategoryId, CreateTemplateRequest, UpdateTemplateRequest } from '@/types/template';
import { TemplateService } from '@/services/templateService';
import { useToast } from '@/hooks/use-toast';

const templateFormSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  categoryId: z.string().min(1, 'Categoria é obrigatória') as z.ZodType<TemplateCategoryId>,
  languageTag: z.string().min(1, 'Idioma é obrigatório'),
  content: z.string().min(1, 'Conteúdo é obrigatório'),
  allowCategoryChange: z.boolean(),
  isActive: z.boolean(),
});

type TemplateFormValues = z.infer<typeof templateFormSchema>;

interface TemplateFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  template?: Template;
  onSuccess: () => void;
}

const TemplateFormDialog = ({ isOpen, onClose, template, onSuccess }: TemplateFormDialogProps) => {
  const { toast } = useToast();

  const form = useForm<TemplateFormValues>({
    resolver: zodResolver(templateFormSchema),
    defaultValues: {
      name: template?.name || '',
      categoryId: template?.categoryId || 'reminder',
      languageTag: template?.languageTag || 'pt-br',
      content: template?.content || '',
      allowCategoryChange: template?.allowCategoryChange || false,
      isActive: template?.isActive ?? true,
    },
  });

  const categoryOptions = [
    { value: 'reminder', label: 'Lembrete' },
    { value: 'notification', label: 'Notificação' },
    { value: 'thank-you', label: 'Agradecimento' },
    { value: 'follow-up', label: 'Acompanhamento' },
    { value: 'announcement', label: 'Anúncio' },
    { value: 'roster', label: 'Escala' },
  ];

  const languageOptions = [
    { value: 'pt-br', label: 'Português (BR)' },
    { value: 'en', label: 'English' },
    { value: 'es', label: 'Español' },
  ];

  const onSubmit = async (data: TemplateFormValues) => {
    try {
      if (template) {
        const updateData: UpdateTemplateRequest = {
          name: data.name,
          categoryId: data.categoryId,
          languageTag: data.languageTag,
          content: data.content,
          allowCategoryChange: data.allowCategoryChange,
          isActive: data.isActive,
        };
        await TemplateService.updateTemplate(template.id, updateData);
        toast({
          title: 'Template atualizado',
          description: 'O template foi atualizado com sucesso!',
        });
      } else {
        const createData: CreateTemplateRequest = {
          name: data.name,
          categoryId: data.categoryId,
          languageTag: data.languageTag,
          content: data.content,
          allowCategoryChange: data.allowCategoryChange,
          isActive: data.isActive,
        };
        await TemplateService.createTemplate(createData);
        toast({
          title: 'Template criado',
          description: 'O template foi criado com sucesso!',
        });
      }
      onSuccess();
      onClose();
      form.reset();
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Não foi possível salvar o template. Tente novamente.',
        variant: 'destructive',
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{template ? 'Editar Template' : 'Novo Template'}</DialogTitle>
          <DialogDescription>
            {template ? 'Edite as informações do template' : 'Crie um novo template de mensagem'}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome</FormLabel>
                  <FormControl>
                    <Input placeholder="Digite o nome do template" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="categoryId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Categoria</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione uma categoria" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categoryOptions.map((category) => (
                          <SelectItem key={category.value} value={category.value}>
                            {category.label}
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
                name="languageTag"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Idioma</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione um idioma" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {languageOptions.map((language) => (
                          <SelectItem key={language.value} value={language.value}>
                            {language.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Conteúdo</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Digite o conteúdo do template..."
                      className="min-h-[120px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex items-center space-x-6">
              <FormField
                control={form.control}
                name="allowCategoryChange"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel>Permitir alteração de categoria</FormLabel>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="isActive"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel>Ativo</FormLabel>
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancelar
              </Button>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? 'Salvando...' : 'Salvar'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default TemplateFormDialog;

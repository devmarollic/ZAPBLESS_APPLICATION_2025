
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { Plus, Edit, Trash2, FileText, Eye, Loader2 } from 'lucide-react';
import { Template } from '@/types/template';
import { TemplateService } from '@/services/templateService';
import TemplateFormDialog from './TemplateFormDialog';
import TemplatePreviewDialog from './TemplatePreviewDialog';
import { useQuery, useQueryClient } from '@tanstack/react-query';

const TemplateManager = () => {
  const { toast } = useToast();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [editingTemplate, setEditingTemplate] = useState<Template | null>(null);
  const queryClient = useQueryClient();

  const { data: templates, isLoading } = useQuery({
    queryKey: ['templates'],
    queryFn: () => TemplateService.getTemplates()
  });

  const handleCreateTemplate = () => {
    setEditingTemplate(null);
    setIsFormOpen(true);
  };

  const handleEditTemplate = (template: Template) => {
    setEditingTemplate(template);
    setIsFormOpen(true);
  };

  const handlePreviewTemplate = (template: Template) => {
    setSelectedTemplate(template);
    setIsPreviewOpen(true);
  };

  const handleDeleteTemplate = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este template?')) return;

    try {
      await TemplateService.deleteTemplate(id);
      queryClient.invalidateQueries({ queryKey: ['templates'] });
      toast({
        title: 'Template excluído',
        description: 'O template foi excluído com sucesso!'
      });
    } catch (error) {
      console.error('Error deleting template:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível excluir o template',
        variant: 'destructive'
      });
    }
  };

  const handleFormSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ['templates'] });
    setIsFormOpen(false);
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">Carregando templates...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-2xl font-bold">Templates de Mensagens</h3>
          <p className="text-muted-foreground">Gerencie os templates para suas mensagens</p>
        </div>
        <Button onClick={handleCreateTemplate}>
          <Plus className="mr-2 h-4 w-4" />
          Novo Template
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <FileText className="mr-2 h-5 w-5" />
            Seus Templates
          </CardTitle>
          <CardDescription>
            Lista de todos os templates disponíveis
          </CardDescription>
        </CardHeader>
        <CardContent>
          {(templates || []).length === 0 ? (
            <div className="text-center py-8">
              <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">Nenhum template encontrado</p>
              <Button onClick={handleCreateTemplate} className="mt-4">
                Criar primeiro template
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Categoria</TableHead>
                  <TableHead>Idioma</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center">
                      <Loader2 className="h-4 w-4 animate-spin" />
                    </TableCell>
                  </TableRow>
                )}
                {!isLoading && Array.isArray( templates ) && templates.map((template) => (
                  <TableRow key={template.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{template.name}</div>
                        <div className="text-sm text-muted-foreground line-clamp-1">
                          {template.content.slice(0, 50)}...
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={template.category.color}>
                        {template.category.name}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className="whitespace-nowrap" variant="outline" title={template.language.name}>
                        {template.language.code.toUpperCase()}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={template.isActive ? 'default' : 'secondary'}>
                        {template.isActive ? 'Ativo' : 'Inativo'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handlePreviewTemplate(template)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEditTemplate(template)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDeleteTemplate(template.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <TemplateFormDialog
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        template={editingTemplate}
        onSuccess={handleFormSuccess}
      />

      <TemplatePreviewDialog
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        template={selectedTemplate}
      />
    </div>
  );
};

export default TemplateManager;

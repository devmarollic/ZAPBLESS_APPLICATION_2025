
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Template, TemplateCategoryId } from '@/types/template';

interface TemplatePreviewDialogProps {
  isOpen: boolean;
  onClose: () => void;
  template: Template | null;
}

const TemplatePreviewDialog = ({ isOpen, onClose, template }: TemplatePreviewDialogProps) => {
  if (!template) return null;

  const categoryLabels: Record<TemplateCategoryId, string> = {
    reminder: 'Lembrete',
    notification: 'Notificação',
    'thank-you': 'Agradecimento',
    'follow-up': 'Acompanhamento',
    announcement: 'Anúncio',
    roster: 'Escala'
  };

  const categoryColors: Record<TemplateCategoryId, string> = {
    reminder: 'bg-blue-100 text-blue-800',
    notification: 'bg-yellow-100 text-yellow-800',
    'thank-you': 'bg-green-100 text-green-800',
    'follow-up': 'bg-purple-100 text-purple-800',
    announcement: 'bg-red-100 text-red-800',
    roster: 'bg-gray-100 text-gray-800'
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {template.name}
            <Badge className={categoryColors[template.categoryId]}>
              {categoryLabels[template.categoryId]}
            </Badge>
          </DialogTitle>
          <DialogDescription>
            Visualização do template de mensagem
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium">Idioma:</span>
              <Badge variant="outline" className="ml-2">
                {template.languageTag.toUpperCase()}
              </Badge>
            </div>
            <div>
              <span className="font-medium">Status:</span>
              <Badge variant={template.isActive ? 'default' : 'secondary'} className="ml-2">
                {template.isActive ? 'Ativo' : 'Inativo'}
              </Badge>
            </div>
            <div>
              <span className="font-medium">Alteração de categoria:</span>
              <span className="ml-2">
                {template.allowCategoryChange ? 'Permitida' : 'Não permitida'}
              </span>
            </div>
            <div>
              <span className="font-medium">Criado em:</span>
              <span className="ml-2">
                {new Date(template.createdAt).toLocaleDateString('pt-BR')}
              </span>
            </div>
          </div>

          <div>
            <h4 className="font-medium mb-2">Conteúdo:</h4>
            <ScrollArea className="h-[300px] w-full border rounded-md p-4">
              <div className="whitespace-pre-wrap text-sm">
                {template.content}
              </div>
            </ScrollArea>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-medium text-blue-800 mb-2">Variáveis disponíveis:</h4>
            <div className="text-sm text-blue-700 space-y-1">
              <div><code>{'{nome}'}</code> - Nome da pessoa</div>
              <div><code>{'{data}'}</code> - Data do evento/lembrete</div>
              <div><code>{'{evento}'}</code> - Nome do evento</div>
              <div><code>{'{local}'}</code> - Local do evento</div>
              <div><code>{'{horario}'}</code> - Horário do evento</div>
              <div><code>{'{igreja}'}</code> - Nome da igreja</div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TemplatePreviewDialog;


import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { Pencil, Trash, Play, Pause, InfoIcon } from 'lucide-react';
import { 
  Card, 
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { RecurringEvent } from '@/types/event';
import { format } from 'date-fns';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose
} from '@/components/ui/dialog';
import RecurringEventDetails from './RecurringEventDetails';

interface RecurringEventsListProps {
  events: RecurringEvent[];
  onDeleteEvent: (eventId: string) => void;
  onTogglePauseEvent: (eventId: string, pause: boolean) => void;
  onEditEvent: (eventId: string) => void;
}

const RecurringEventsList = ({
  events,
  onDeleteEvent,
  onTogglePauseEvent,
  onEditEvent
}: RecurringEventsListProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedEvent, setSelectedEvent] = useState<RecurringEvent | null>(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [dialogAction, setDialogAction] = useState<'delete' | 'pause' | 'resume'>('delete');
  
  // Format the recurrence type to display in a more readable format
  const formatRecurrenceType = (type: string, interval: number) => {
    const types: Record<string, string> = {
      'daily': interval > 1 ? `a cada ${interval} dias` : 'diariamente',
      'weekly': interval > 1 ? `a cada ${interval} semanas` : 'semanalmente',
      'monthly': interval > 1 ? `a cada ${interval} meses` : 'mensalmente',
      'yearly': interval > 1 ? `a cada ${interval} anos` : 'anualmente',
    };
    
    return types[type] || type;
  };
  
  // Execute the action from the confirmation dialog
  const executeDialogAction = () => {
    if (!selectedEvent) return;
    
    switch (dialogAction) {
      case 'delete':
        onDeleteEvent(selectedEvent.id);
        toast({
          title: "Evento excluído",
          description: `O evento recorrente "${selectedEvent.title}" foi excluído com sucesso.`,
        });
        break;
      case 'pause':
        onTogglePauseEvent(selectedEvent.id, true);
        toast({
          title: "Evento pausado",
          description: `O evento recorrente "${selectedEvent.title}" foi pausado. Novas ocorrências não serão geradas.`,
        });
        break;
      case 'resume':
        onTogglePauseEvent(selectedEvent.id, false);
        toast({
          title: "Evento retomado",
          description: `O evento recorrente "${selectedEvent.title}" foi retomado. Novas ocorrências serão geradas.`,
        });
        break;
    }
    
    setShowConfirmDialog(false);
  };
  
  // Open confirmation dialog
  const openConfirmDialog = (event: RecurringEvent, action: 'delete' | 'pause' | 'resume') => {
    setSelectedEvent(event);
    setDialogAction(action);
    setShowConfirmDialog(true);
  };
  
  // Open details dialog
  const openDetailsDialog = (event: RecurringEvent) => {
    setSelectedEvent(event);
    setShowDetailsDialog(true);
  };
  
  // Action button labels and descriptions
  const dialogConfig = {
    delete: {
      title: 'Confirmar exclusão',
      description: 'Esta ação excluirá permanentemente este evento recorrente e todas as suas futuras ocorrências. Esta ação não pode ser desfeita.',
      actionButton: 'Excluir evento',
      actionVariant: 'destructive' as const,
    },
    pause: {
      title: 'Confirmar pausa',
      description: 'Esta ação pausará a geração de novas ocorrências deste evento recorrente. Eventos já agendados não serão afetados.',
      actionButton: 'Pausar evento',
      actionVariant: 'default' as const,
    },
    resume: {
      title: 'Confirmar retomada',
      description: 'Esta ação retomará a geração de novas ocorrências deste evento recorrente conforme a regra de recorrência definida.',
      actionButton: 'Retomar evento',
      actionVariant: 'default' as const,
    },
  };
  
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {events.map((event) => (
          <Card key={event.id}>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{event.title}</CardTitle>
                  <CardDescription>{event.location}</CardDescription>
                </div>
                <Badge 
                  variant={event.recurrence.paused ? "outline" : "default"}
                  className={event.recurrence.paused ? "border-yellow-500 text-yellow-500" : "bg-green-500"}
                >
                  {event.recurrence.paused ? "Pausado" : "Ativo"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="font-medium">Recorrência:</span> {formatRecurrenceType(event.recurrence.type, event.recurrence.interval)}
                </div>
                <div>
                  <span className="font-medium">Próxima ocorrência:</span> {format(new Date(event.next_occurrence), 'dd/MM/yyyy')}
                </div>
                <div>
                  <span className="font-medium">Termina em:</span> {event.recurrence.end_at ? format(new Date(event.recurrence.end_at), 'dd/MM/yyyy') : 'Sem data de término'}
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between pt-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" onClick={() => openDetailsDialog(event)}>
                      <InfoIcon className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Ver detalhes</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              
              <div className="flex space-x-1">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon" onClick={() => onEditEvent(event.id)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Editar</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => openConfirmDialog(event, event.recurrence.paused ? 'resume' : 'pause')}
                      >
                        {event.recurrence.paused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{event.recurrence.paused ? 'Retomar' : 'Pausar'}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon" onClick={() => openConfirmDialog(event, 'delete')}>
                        <Trash className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Excluir</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
      
      {/* Confirmation Dialog */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{dialogConfig[dialogAction].title}</DialogTitle>
            <DialogDescription>
              {dialogConfig[dialogAction].description}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant={dialogConfig[dialogAction].actionVariant}
              onClick={executeDialogAction}
            >
              {dialogConfig[dialogAction].actionButton}
            </Button>
            <DialogClose asChild>
              <Button variant="outline">Cancelar</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Details Dialog */}
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Detalhes do Evento Recorrente</DialogTitle>
          </DialogHeader>
          
          {selectedEvent && <RecurringEventDetails event={selectedEvent} />}
          
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Fechar</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default RecurringEventsList;

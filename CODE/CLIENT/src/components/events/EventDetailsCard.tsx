
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Calendar, Clock, MapPin, Users, Repeat } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";

interface EventDetailsCardProps {
  event: {
    id: number;
    data: Date;
    titulo: string;
    cor: string;
    tipo: string;
    horario?: string;
    local?: string;
    quantidade?: number;
    recurrence?: boolean;
  } | null;
  isOpen: boolean;
  onClose: () => void;
}

const EventDetailsCard = ({ event, isOpen, onClose }: EventDetailsCardProps) => {
  if (!event) return null;

  const getEventTypeLabel = (tipo: string) => {
    const types: Record<string, string> = {
      'culto': 'Culto',
      'reuniao': 'Reunião',
      'grupo': 'Grupo de Estudo',
      'especial': 'Evento Especial'
    };
    return types[tipo] || tipo;
  };

  const getEventTypeColor = (cor: string) => {
    const colors: Record<string, string> = {
      'green': 'bg-green-100 text-green-800',
      'purple': 'bg-purple-100 text-purple-800',
      'blue': 'bg-blue-100 text-blue-800',
      'red': 'bg-red-100 text-red-800',
      'orange': 'bg-orange-100 text-orange-800'
    };
    return colors[cor] || 'bg-gray-100 text-gray-800';
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Detalhes do Evento
          </DialogTitle>
        </DialogHeader>
        
        <Card className="border-0 shadow-none">
          <CardHeader className="px-0 pb-3">
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-lg">{event.titulo}</CardTitle>
                <CardDescription className="mt-1">
                  {format(event.data, "EEEE, d 'de' MMMM 'de' yyyy", { locale: ptBR })}
                </CardDescription>
              </div>
              <div className="flex gap-2">
                <Badge className={getEventTypeColor(event.cor)}>
                  {getEventTypeLabel(event.tipo)}
                </Badge>
                {event.recurrence && (
                  <Badge variant="outline" className="gap-1">
                    <Repeat className="h-3 w-3" />
                    Recorrente
                  </Badge>
                )}
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="px-0 space-y-3">
            {event.horario && (
              <div className="flex items-center gap-3">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{event.horario}</span>
              </div>
            )}
            
            {event.local && (
              <div className="flex items-center gap-3">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{event.local}</span>
              </div>
            )}
            
            {event.quantidade && (
              <div className="flex items-center gap-3">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{event.quantidade} participantes esperados</span>
              </div>
            )}
            
            <div className="pt-2">
              <p className="text-xs text-muted-foreground">
                ID do evento: {event.id}
              </p>
            </div>
          </CardContent>
        </Card>
        
        <div className="flex justify-end gap-2 mt-4">
          <DialogClose asChild>
            <Button variant="outline">Fechar</Button>
          </DialogClose>
          <Button>Editar Evento</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EventDetailsCard;

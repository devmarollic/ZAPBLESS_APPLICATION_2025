
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
import { Event } from "@/types/event";

interface EventDetailsCardProps {
  event: Event | null;
  isOpen: boolean;
  onClose: () => void;
}

const EventDetailsCard = ({ event, isOpen, onClose }: EventDetailsCardProps) => {
  if (!event) return null;

  const getEventTypeColor = (color?: string) => {
    const colors: Record<string, string> = {
      'green': 'bg-green-100 text-green-800',
      'purple': 'bg-purple-100 text-purple-800',
      'blue': 'bg-blue-100 text-blue-800',
      'red': 'bg-red-100 text-red-800',
      'orange': 'bg-orange-100 text-orange-800'
    };
    return colors[color || 'gray'] || 'bg-gray-100 text-gray-800';
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
                <CardTitle className="text-lg">{event.title}</CardTitle>
                <CardDescription className="mt-1">
                  {format(new Date(event.startAtTimestamp), "EEEE, d 'de' MMMM 'de' yyyy", { locale: ptBR })}
                </CardDescription>
              </div>
              <div className="flex gap-2">
                <Badge className={getEventTypeColor(event.ministry?.color)}>
                  {event.eventType?.name || 'Evento'}
                </Badge>
                {event.id?.includes('-') && (
                  <Badge variant="outline" className="gap-1">
                    <Repeat className="h-3 w-3" />
                    Recorrente
                  </Badge>
                )}
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="px-0 space-y-3">
            <div className="flex items-center gap-3">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">
                {format(new Date(event.startAtTimestamp), 'HH:mm')} - {format(new Date(event.endAtTimestamp), 'HH:mm')}
              </span>
            </div>
            
            {event.location && (
              <div className="flex items-center gap-3">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{event.location}</span>
              </div>
            )}

            {event.ministry && (
              <div className="flex items-center gap-3">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{event.ministry.name}</span>
              </div>
            )}

            {event.description && (
              <div className="pt-2">
                <p className="text-sm text-muted-foreground">{event.description}</p>
              </div>
            )}
            
            <div className="pt-2">
              <p className="text-xs text-muted-foreground">
                Status: {event.eventStatus?.name || 'Ativo'}
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

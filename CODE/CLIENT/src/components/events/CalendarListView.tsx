
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Calendar, Clock, MapPin, Repeat } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

interface CalendarListViewProps {
  eventos: any[];
  mesAtual: number;
  anoAtual: number;
  onEventClick?: (event: any) => void;
}

const CalendarListView = ({ eventos, mesAtual, anoAtual, onEventClick }: CalendarListViewProps) => {
  // Filter events for the current month and sort by date
  const eventosMes = eventos
    .filter(evento => {
      const eventoData = new Date(evento.data);
      return eventoData.getMonth() === mesAtual && eventoData.getFullYear() === anoAtual;
    })
    .sort((a, b) => new Date(a.data).getTime() - new Date(b.data).getTime());

  const getEventTypeColor = (cor: string) => {
    const colors: Record<string, string> = {
      'green': 'border-green-300 bg-green-50 text-green-800',
      'purple': 'border-purple-300 bg-purple-50 text-purple-800',
      'blue': 'border-blue-300 bg-blue-50 text-blue-800',
      'red': 'border-red-300 bg-red-50 text-red-800',
      'orange': 'border-orange-300 bg-orange-50 text-orange-800'
    };
    return colors[cor] || 'border-gray-300 bg-gray-50 text-gray-800';
  };

  const getEventTypeLabel = (tipo: string) => {
    const types: Record<string, string> = {
      'culto': 'Culto',
      'reuniao': 'Reunião',
      'grupo': 'Grupo de Estudo',
      'especial': 'Evento Especial'
    };
    return types[tipo] || tipo;
  };

  if (eventosMes.length === 0) {
    return (
      <div className="text-center py-12">
        <Calendar className="mx-auto h-12 w-12 text-muted-foreground" />
        <h3 className="mt-4 text-lg font-medium">Nenhum evento encontrado</h3>
        <p className="text-muted-foreground">
          Não há eventos agendados para {format(new Date(anoAtual, mesAtual), 'MMMM yyyy', { locale: ptBR })}.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {eventosMes.map((evento) => (
        <Card 
          key={evento.id} 
          className="cursor-pointer hover:bg-muted/50 transition-colors"
          onClick={() => onEventClick?.(evento)}
        >
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="font-medium">{evento.titulo}</h3>
                  <Badge variant="outline" className={getEventTypeColor(evento.cor)}>
                    {getEventTypeLabel(evento.tipo)}
                  </Badge>
                  {evento.recurrence && (
                    <Badge variant="outline" className="gap-1">
                      <Repeat className="h-3 w-3" />
                      Recorrente
                    </Badge>
                  )}
                </div>
                
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {format(evento.data, "d 'de' MMMM", { locale: ptBR })}
                  </div>
                  
                  {evento.horario && (
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {evento.horario}
                    </div>
                  )}
                  
                  {evento.local && (
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {evento.local}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default CalendarListView;

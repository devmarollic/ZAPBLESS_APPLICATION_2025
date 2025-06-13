
import { format, isSameDay, startOfWeek, endOfWeek, eachDayOfInterval } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Calendar, Clock, MapPin, Repeat } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface CalendarAgendaViewProps {
  eventos: any[];
  mesAtual: number;
  anoAtual: number;
  onEventClick?: (event: any) => void;
}

const CalendarAgendaView = ({ eventos, mesAtual, anoAtual, onEventClick }: CalendarAgendaViewProps) => {
  // Get current week
  const currentDate = new Date(anoAtual, mesAtual, 15); // Middle of month for reference
  const weekStart = startOfWeek(currentDate, { locale: ptBR });
  const weekEnd = endOfWeek(currentDate, { locale: ptBR });
  const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd });

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

  const getEventsForDay = (day: Date) => {
    return eventos.filter(evento => isSameDay(new Date(evento.data), day));
  };

  return (
    <div className="space-y-4">
      <div className="text-center">
        <h3 className="text-lg font-medium">
          Agenda da Semana - {format(weekStart, 'd', { locale: ptBR })} a {format(weekEnd, "d 'de' MMMM", { locale: ptBR })}
        </h3>
      </div>

      <div className="grid gap-4">
        {weekDays.map((day) => {
          const dayEvents = getEventsForDay(day);
          const isToday = isSameDay(day, new Date());

          return (
            <Card key={day.toISOString()} className={isToday ? "ring-2 ring-primary" : ""}>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  {format(day, "EEEE, d 'de' MMMM", { locale: ptBR })}
                  {isToday && <Badge variant="default">Hoje</Badge>}
                </CardTitle>
              </CardHeader>
              
              <CardContent>
                {dayEvents.length > 0 ? (
                  <div className="space-y-3">
                    {dayEvents.map((evento) => (
                      <div 
                        key={evento.id}
                        className="cursor-pointer p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                        onClick={() => onEventClick?.(evento)}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-medium">{evento.titulo}</h4>
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
                              {evento.horario && (
                                <div className="flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  {evento.horario}
                                </div>
                              )}
                              
                              {evento.local && (
                                <div className="flex items-center gap-1">
                                  <MapPin className="h-3 w-3" />
                                  {evento.local}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-sm">Nenhum evento agendado</p>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default CalendarAgendaView;

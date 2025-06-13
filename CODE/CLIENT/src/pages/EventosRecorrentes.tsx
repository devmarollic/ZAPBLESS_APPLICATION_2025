
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import RecurringEventsList from '@/components/events/RecurringEventsList';
import { RecurringEvent } from '@/types/event';

// Mock data for recurring events
const mockRecurringEvents: RecurringEvent[] = [
  {
    id: '1',
    title: 'Culto de Domingo',
    description: 'Culto de celebração dominical',
    location: 'Templo Principal',
    ministry: 'Adoração',
    next_occurrence: new Date(2025, 4, 18), // 18 de Maio de 2025
    recurrence: {
      id: '101',
      type: 'weekly',
      interval: 1,
      days_of_week: ['sunday'],
      time_of_day: '10:00',
      end_at: null,
    }
  },
  {
    id: '2',
    title: 'Reunião de Oração',
    description: 'Momento de intercessão e oração',
    location: 'Sala 203',
    ministry: 'Intercessão',
    next_occurrence: new Date(2025, 4, 14), // 14 de Maio de 2025
    recurrence: {
      id: '102',
      type: 'weekly',
      interval: 1,
      days_of_week: ['wednesday'],
      time_of_day: '19:30',
      end_at: new Date(2025, 11, 31),
    }
  },
  {
    id: '3',
    title: 'Encontro de Jovens',
    description: 'Reunião semanal do ministério de jovens',
    location: 'Auditório B',
    ministry: 'Jovens',
    next_occurrence: new Date(2025, 4, 17), // 17 de Maio de 2025
    recurrence: {
      id: '103',
      type: 'weekly',
      interval: 1,
      days_of_week: ['saturday'],
      time_of_day: '19:00',
      end_at: null,
      paused: true,
    }
  },
  {
    id: '4',
    title: 'Estudo Bíblico',
    description: 'Estudo temático da Bíblia',
    location: 'Sala 101',
    ministry: 'Educação',
    next_occurrence: new Date(2025, 4, 16), // 16 de Maio de 2025
    recurrence: {
      id: '104',
      type: 'weekly',
      interval: 1,
      days_of_week: ['friday'],
      time_of_day: '20:00',
      end_at: null,
    }
  },
  {
    id: '5',
    title: 'Reunião de Liderança',
    description: 'Reunião mensal com todos os líderes',
    location: 'Sala de Conferência',
    ministry: 'Administração',
    next_occurrence: new Date(2025, 5, 1), // 1 de Junho de 2025
    recurrence: {
      id: '105',
      type: 'monthly',
      interval: 1,
      day_of_month: 1,
      time_of_day: '18:00',
      end_at: null,
    }
  },
  {
    id: '6',
    title: 'Celebração Anual',
    description: 'Celebração de aniversário da igreja',
    location: 'Centro de Eventos',
    ministry: 'Administração',
    next_occurrence: new Date(2026, 2, 15), // 15 de Março de 2026
    recurrence: {
      id: '106',
      type: 'yearly',
      interval: 1,
      time_of_day: '18:00',
      end_at: null,
    }
  }
];

const EventosRecorrentes = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [events, setEvents] = useState<RecurringEvent[]>(mockRecurringEvents);
  
  // Delete event handler
  const handleDeleteEvent = (eventId: string) => {
    setEvents((prevEvents) => prevEvents.filter((event) => event.id !== eventId));
  };
  
  // Toggle pause event handler
  const handleTogglePauseEvent = (eventId: string, pause: boolean) => {
    setEvents((prevEvents) => 
      prevEvents.map((event) => 
        event.id === eventId 
          ? { 
              ...event, 
              recurrence: { 
                ...event.recurrence, 
                paused: pause 
              } 
            } 
          : event
      )
    );
  };
  
  // Edit event handler
  const handleEditEvent = (eventId: string) => {
    // In a real app, navigate to edit page with the event ID
    toast({
      title: "Função não implementada",
      description: "A edição de eventos recorrentes será implementada em breve.",
    });
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight flex items-center">
            <Button variant="ghost" size="icon" asChild className="mr-2">
              <Link to="/dashboard/eventos">
                <ArrowLeft className="h-5 w-5" />
              </Link>
            </Button>
            Eventos Recorrentes
          </h2>
          <p className="text-muted-foreground">
            Gerencie os eventos recorrentes da sua igreja
          </p>
        </div>
        
        <div>
          <Button asChild>
            <Link to="/dashboard/eventos/novo">
              <Plus className="mr-2 h-4 w-4" />
              Criar Evento Recorrente
            </Link>
          </Button>
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Eventos Recorrentes Ativos</CardTitle>
        </CardHeader>
        <CardContent>
          {events.length > 0 ? (
            <RecurringEventsList 
              events={events}
              onDeleteEvent={handleDeleteEvent}
              onTogglePauseEvent={handleTogglePauseEvent}
              onEditEvent={handleEditEvent}
            />
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Nenhum evento recorrente encontrado.</p>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => navigate('/dashboard/eventos/novo')}
              >
                <Plus className="mr-2 h-4 w-4" />
                Criar evento recorrente
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default EventosRecorrentes;

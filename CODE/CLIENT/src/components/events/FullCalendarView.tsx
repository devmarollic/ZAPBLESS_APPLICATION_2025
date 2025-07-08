
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import interactionPlugin from '@fullcalendar/interaction';
import { Event } from "@/types/event";
import { ptBR } from 'date-fns/locale';

interface FullCalendarViewProps {
  eventos: Event[];
  visualizacao: string;
  onEventClick: (event: Event) => void;
  onDateClick?: (date: Date) => void;
}

const FullCalendarView = ({ 
  eventos, 
  visualizacao, 
  onEventClick,
  onDateClick 
}: FullCalendarViewProps) => {
  // Convert events to FullCalendar format
  const calendarEvents = eventos.map(evento => ({
    id: evento.id,
    title: evento.title,
    start: evento.date,
    end: evento.date,
    backgroundColor: getEventColor(evento.ministry?.color),
    borderColor: getEventColor(evento.ministry?.color),
    textColor: '#ffffff',
    extendedProps: {
      originalEvent: evento,
      description: evento.description,
      location: evento.location,
      ministry: evento.ministry?.name
    }
  }));

  function getEventColor(color?: string) {
    const colors: Record<string, string> = {
      'green': '#10b981',
      'blue': '#3b82f6',
      'purple': '#8b5cf6',
      'red': '#ef4444',
      'orange': '#f97316'
    };
    return colors[color || 'blue'] || colors.blue;
  }

  const getCalendarView = () => {
    switch (visualizacao) {
      case 'list':
        return 'listMonth';
      case 'agenda':
        return 'timeGridWeek';
      case 'weekly':
        return 'timeGridWeek';
      case 'monthly':
        return 'dayGridMonth';
      default:
        return 'dayGridMonth';
    }
  };

  const handleEventClick = (clickInfo: any) => {
    const originalEvent = clickInfo.event.extendedProps.originalEvent;
    onEventClick(originalEvent);
  };

  const handleDateClick = (dateClickInfo: any) => {
    if (onDateClick) {
      onDateClick(new Date(dateClickInfo.date));
    }
  };

  return (
    <div className="full-calendar-wrapper">
      <style jsx global>{`
        .fc {
          --fc-border-color: hsl(var(--border));
          --fc-button-text-color: hsl(var(--foreground));
          --fc-button-bg-color: hsl(var(--background));
          --fc-button-border-color: hsl(var(--border));
          --fc-button-hover-bg-color: hsl(var(--muted));
          --fc-button-hover-border-color: hsl(var(--border));
          --fc-button-active-bg-color: hsl(var(--primary));
          --fc-button-active-border-color: hsl(var(--primary));
          --fc-today-bg-color: hsl(var(--accent));
        }
        
        .fc-theme-standard .fc-scrollgrid {
          border-color: hsl(var(--border));
        }
        
        .fc-theme-standard td, 
        .fc-theme-standard th {
          border-color: hsl(var(--border));
        }
        
        .fc-col-header-cell-cushion {
          color: hsl(var(--muted-foreground));
          font-weight: 500;
        }
        
        .fc-daygrid-day-number {
          color: hsl(var(--foreground));
          font-weight: 500;
        }
        
        .fc-event {
          border-radius: 6px;
          border: none !important;
          font-size: 12px;
          font-weight: 500;
          cursor: pointer;
        }
        
        .fc-event:hover {
          opacity: 0.8;
        }
        
        .fc-button {
          border-radius: 6px;
          border: 1px solid hsl(var(--border));
          background: hsl(var(--background));
          color: hsl(var(--foreground));
          font-size: 14px;
          font-weight: 500;
          padding: 8px 16px;
        }
        
        .fc-button:hover {
          background: hsl(var(--muted));
        }
        
        .fc-button-active {
          background: hsl(var(--primary)) !important;
          color: hsl(var(--primary-foreground)) !important;
        }
        
        .fc-toolbar-title {
          color: hsl(var(--foreground));
          font-size: 1.5rem;
          font-weight: 700;
        }
        
        .fc-list-event:hover {
          background: hsl(var(--muted/50));
        }
        
        .fc-list-event-title {
          color: hsl(var(--foreground));
        }
        
        .fc-list-event-time {
          color: hsl(var(--muted-foreground));
        }
      `}</style>
      
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin]}
        initialView={getCalendarView()}
        events={calendarEvents}
        eventClick={handleEventClick}
        dateClick={handleDateClick}
        locale="pt-br"
        height="auto"
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,listMonth'
        }}
        buttonText={{
          today: 'Hoje',
          month: 'Mês',
          week: 'Semana',
          list: 'Lista'
        }}
        dayMaxEvents={3}
        moreLinkText="mais"
        eventDisplay="block"
        displayEventTime={false}
        eventTimeFormat={{
          hour: '2-digit',
          minute: '2-digit',
          hour12: false
        }}
      />
    </div>
  );
};

export default FullCalendarView;

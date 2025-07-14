
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import interactionPlugin from '@fullcalendar/interaction';
import { Event } from "@/types/event";
import { ptBR } from 'date-fns/locale';
import './FullCalendarView.css';

interface FullCalendarViewProps {
  eventos: Event[];
  visualizacao: string;
  onEventClick: (event: Event) => void;
  onDateClick?: (date: Date) => void;
  onRangeChange?: (start: Date, end: Date) => void;
}

const FullCalendarView = ({ 
  eventos, 
  visualizacao, 
  onEventClick,
  onDateClick,
  onRangeChange
}: FullCalendarViewProps) => {
  // Convert events to FullCalendar format
  const calendarEvents = eventos.map(evento => {

    return {
      id: evento.id,
      title: evento.title,
      start: evento.startAtTimestamp, // Use startAtTimestamp instead of date
      end: evento.endAtTimestamp, // Use endAtTimestamp for proper duration
      backgroundColor: getEventColor(evento.ministry?.color),
      borderColor: getEventColor(evento.ministry?.color),
      textColor: '#ffffff',
      extendedProps: {
        originalEvent: evento,
        description: evento.description,
        location: evento.location,
        ministry: evento.ministry?.name
      }
    };
  });

  function getEventColor(color?: string) {
    // If color is a hex code, use it directly
    if (color && color.startsWith('#')) {
      return color;
    }
    
    // Otherwise, map color names to hex codes
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

  // Função para emitir o range visível
  const handleDatesSet = (arg: any) => {
    if (onRangeChange) {
      onRangeChange(new Date(arg.start), new Date(arg.end));
    }
  };


  return (
    <div className="full-calendar-wrapper">
      
      <FullCalendar
        key="main-calendar"
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
        displayEventTime={true}
        eventTimeFormat={{
          hour: '2-digit',
          minute: '2-digit',
          hour12: false
        }}
        datesSet={handleDatesSet}
      />
    </div>
  );
};

export default FullCalendarView;

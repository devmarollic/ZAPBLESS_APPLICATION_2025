import FullCalendarView from "@/components/events/FullCalendarView";
import CalendarListView from "@/components/events/CalendarListView";
import CalendarAgendaView from "@/components/events/CalendarAgendaView";
import { Event } from "@/types/event";

interface CalendarViewRendererProps {
  visualizacao: string;
  eventosFiltrados: Event[];
  mesAtual: number;
  anoAtual: number;
  onEventClick: (event: Event) => void;
  onDateChange?: (date: Date) => void;
  onViewChange?: (view: string) => void;
}

const CalendarViewRenderer = ({ 
  visualizacao, 
  eventosFiltrados, 
  mesAtual, 
  anoAtual, 
  onEventClick,
  onDateChange,
  onViewChange
}: CalendarViewRendererProps) => {
  const dataAtual = new Date(2025, 4, 12); // 12 de Maio de 2025

  // Use FullCalendar for most views
  if (['grid', 'monthly', 'agenda', 'weekly'].includes(visualizacao)) {
    return (
      <FullCalendarView
        eventos={eventosFiltrados}
        visualizacao={visualizacao}
        onEventClick={onEventClick}
        onDateChange={onDateChange}
        onViewChange={onViewChange}
      />
    );
  }

  // Keep existing list view
  if (visualizacao === "list") {
    return (
      <CalendarListView 
        eventos={eventosFiltrados}
        mesAtual={mesAtual}
        anoAtual={anoAtual}
        onEventClick={onEventClick}
      />
    );
  }

  // Default fallback
  return (
    <FullCalendarView
      eventos={eventosFiltrados}
      visualizacao="grid"
      onEventClick={onEventClick}
      onDateChange={onDateChange}
      onViewChange={onViewChange}
    />
  );
};

export default CalendarViewRenderer;

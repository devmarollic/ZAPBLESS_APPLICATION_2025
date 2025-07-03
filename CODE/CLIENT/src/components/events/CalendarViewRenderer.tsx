
import CalendarGrid from "@/components/events/CalendarGrid";
import CalendarListView from "@/components/events/CalendarListView";
import CalendarAgendaView from "@/components/events/CalendarAgendaView";
import { gerarCalendario } from "@/utils/calendarUtils";
import { Event } from "@/types/event";

interface CalendarViewRendererProps {
  visualizacao: string;
  eventosFiltrados: Event[];
  mesAtual: number;
  anoAtual: number;
  onEventClick: (event: Event) => void;
}

const CalendarViewRenderer = ({ 
  visualizacao, 
  eventosFiltrados, 
  mesAtual, 
  anoAtual, 
  onEventClick 
}: CalendarViewRendererProps) => {
  const calendario = gerarCalendario(anoAtual, mesAtual);
  const dataAtual = new Date(2025, 4, 12); // 12 de Maio de 2025

  switch (visualizacao) {
    case "list":
      return (
        <CalendarListView 
          eventos={eventosFiltrados}
          mesAtual={mesAtual}
          anoAtual={anoAtual}
          onEventClick={onEventClick}
        />
      );
    case "agenda":
      return (
        <CalendarAgendaView 
          eventos={eventosFiltrados}
          mesAtual={mesAtual}
          anoAtual={anoAtual}
          onEventClick={onEventClick}
        />
      );
    case "grid":
    default:
      return (
        <CalendarGrid 
          calendario={calendario} 
          eventos={eventosFiltrados}
          mesAtual={mesAtual}
          anoAtual={anoAtual}
          dataAtual={dataAtual}
          onEventClick={onEventClick}
        />
      );
  }
};

export default CalendarViewRenderer;

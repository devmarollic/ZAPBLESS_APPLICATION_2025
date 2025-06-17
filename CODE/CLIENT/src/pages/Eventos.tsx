
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Repeat, Settings } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Link } from "react-router-dom";
import CalendarHeader from "@/components/events/CalendarHeader";
import CalendarViewSelector from "@/components/events/CalendarViewSelector";
import CalendarGrid from "@/components/events/CalendarGrid";
import CalendarListView from "@/components/events/CalendarListView";
import CalendarAgendaView from "@/components/events/CalendarAgendaView";
import EventDetailsCard from "@/components/events/EventDetailsCard";
import { gerarCalendario, aplicarFiltros } from "@/utils/calendarUtils";
import { useIsMobile } from "@/hooks/use-mobile";
import { HttpClient } from "@/lib/http_client";
import { Event } from "@/types/event";

const Eventos = () => {
  const [anoAtual, setAnoAtual] = useState(2025);
  const [mesAtual, setMesAtual] = useState(4); // Maio (0-indexed)
  const [visualizacao, setVisualizacao] = useState("grid");
  const [selectedCategories, setSelectedCategories] = useState<string[]>(['todas']);
  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({
    from: undefined,
    to: undefined
  });
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<typeof events[0] | null>(null);
  const [isEventDetailsOpen, setIsEventDetailsOpen] = useState(false);
  
  const calendario = gerarCalendario(anoAtual, mesAtual);
  const dataAtual = new Date(2025, 4, 12); // 12 de Maio de 2025
  const isMobile = useIsMobile();
  
  // Apply filters to get filtered events
  const eventosFiltrados = aplicarFiltros(
    events,
    selectedCategories,
    dateRange.from,
    dateRange.to,
    mesAtual,
    anoAtual
  );
  
  const handleDateChange = (date: Date) => {
    setMesAtual(date.getMonth());
    setAnoAtual(date.getFullYear());
  };

  const handleViewChange = (view: string) => {
    setVisualizacao(view);
  };

  const handleRangeChange = (range: { from: Date | undefined; to: Date | undefined }) => {
    // Update the calendar view based on the selected date range
    setDateRange(range);
    if (range.from) {
      setMesAtual(range.from.getMonth());
      setAnoAtual(range.from.getFullYear());
    }
  };

  const handleCategoriesChange = (categories: string[]) => {
    setSelectedCategories(categories);
  };

  const handleEventClick = (event: typeof events[0]) => {
    setSelectedEvent(event);
    setIsEventDetailsOpen(true);
  };

  const handleCloseEventDetails = () => {
    setIsEventDetailsOpen(false);
    setSelectedEvent(null);
  };

  // Render the appropriate view based on visualizacao state
  const renderCalendarView = () => {
    switch (visualizacao) {
      case "list":
        return (
          <CalendarListView 
            eventos={eventosFiltrados}
            mesAtual={mesAtual}
            anoAtual={anoAtual}
            onEventClick={handleEventClick}
          />
        );
      case "agenda":
        return (
          <CalendarAgendaView 
            eventos={eventosFiltrados}
            mesAtual={mesAtual}
            anoAtual={anoAtual}
            onEventClick={handleEventClick}
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
            onEventClick={handleEventClick}
          />
        );
    }
  };

  useEffect(() => {
    const fetchEvents = async () => {
      const response = await HttpClient.get<Event[]>('/event/list');
      if (response) {
        setEvents(response);
      }
    }
    fetchEvents();
  }, []);

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Eventos</h2>
          <p className="text-muted-foreground">Gerencie os eventos da sua igreja</p>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="icon" className="h-9 w-9">
            <Settings className="h-4 w-4" />
          </Button>
          <Button variant="outline" asChild className="gap-2">
            <Link to="/dashboard/eventos/recorrentes">
              <Repeat className="h-4 w-4" /> {isMobile ? "" : "Recorrentes"}
            </Link>
          </Button>
          <Button asChild>
            <Link to="/dashboard/eventos/novo">
              <Plus className="mr-2 h-4 w-4" /> {isMobile ? "Adicionar" : "Adicionar evento"}
            </Link>
          </Button>
        </div>
      </div>
      
      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <CalendarHeader 
              selectedDate={new Date(anoAtual, mesAtual, 1)}
              onDateChange={handleDateChange}
              onRangeChange={handleRangeChange}
              totalEvents={eventosFiltrados.length}
            />
            
            <CalendarViewSelector
              activeView={visualizacao}
              onViewChange={handleViewChange}
              selectedCategories={selectedCategories}
              onCategoriesChange={handleCategoriesChange}
            />
          </div>
        </CardHeader>
        <CardContent>
          {renderCalendarView()}
        </CardContent>
      </Card>

      <EventDetailsCard 
        event={selectedEvent}
        isOpen={isEventDetailsOpen}
        onClose={handleCloseEventDetails}
      />
    </div>
  );
};

export default Eventos;

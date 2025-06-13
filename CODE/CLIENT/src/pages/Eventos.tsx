
import { useState } from "react";
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

// Mock de eventos com mais detalhes para as novas visualizações
const eventos = [
  { id: 1, data: new Date(2025, 4, 1), titulo: "Culto Especial", cor: "green", tipo: "culto", horario: "19:00", local: "Templo Principal" },
  { id: 2, data: new Date(2025, 4, 5), titulo: "Reunião de Liderança", quantidade: 3, cor: "purple", tipo: "reuniao", horario: "20:00", local: "Sala de Reuniões" },
  { id: 3, data: new Date(2025, 4, 8), titulo: "Celebração", cor: "blue", tipo: "culto", horario: "18:30", local: "Templo Principal" },
  { id: 4, data: new Date(2025, 4, 11), titulo: "Reunião de Jovens", cor: "red", tipo: "reuniao", recurrence: true, horario: "20:00", local: "Anexo" },
  { id: 5, data: new Date(2025, 4, 13), titulo: "Grupo de Estudo", quantidade: 3, cor: "purple", tipo: "grupo", horario: "19:30", local: "Sala 3" },
  { id: 6, data: new Date(2025, 4, 15), titulo: "Evento Especial", quantidade: 2, cor: "orange", tipo: "especial", recurrence: true, horario: "14:00", local: "Centro Comunitário" },
  { id: 7, data: new Date(2025, 4, 20), titulo: "Culto Dominical", cor: "green", tipo: "culto", recurrence: true, horario: "10:00", local: "Templo Principal" },
];

const Eventos = () => {
  const [anoAtual, setAnoAtual] = useState(2025);
  const [mesAtual, setMesAtual] = useState(4); // Maio (0-indexed)
  const [visualizacao, setVisualizacao] = useState("grid");
  const [selectedCategories, setSelectedCategories] = useState<string[]>(['todas']);
  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({
    from: undefined,
    to: undefined
  });
  const [selectedEvent, setSelectedEvent] = useState<typeof eventos[0] | null>(null);
  const [isEventDetailsOpen, setIsEventDetailsOpen] = useState(false);
  
  const calendario = gerarCalendario(anoAtual, mesAtual);
  const dataAtual = new Date(2025, 4, 12); // 12 de Maio de 2025
  const isMobile = useIsMobile();
  
  // Apply filters to get filtered events
  const eventosFiltrados = aplicarFiltros(
    eventos,
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

  const handleEventClick = (event: typeof eventos[0]) => {
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

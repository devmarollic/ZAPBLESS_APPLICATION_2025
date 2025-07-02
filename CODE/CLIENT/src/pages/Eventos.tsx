
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
import { EventService } from "@/services/eventService";
import { Event } from "@/types/event";
import { startOfMonth, endOfMonth, startOfWeek, endOfWeek, format } from "date-fns";

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
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
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
    setDateRange(range);
    if (range.from) {
      setMesAtual(range.from.getMonth());
      setAnoAtual(range.from.getFullYear());
    }
  };

  const handleCategoriesChange = (categories: string[]) => {
    setSelectedCategories(categories);
  };

  const handleEventClick = (event: Event) => {
    setSelectedEvent(event);
    setIsEventDetailsOpen(true);
  };

  const handleCloseEventDetails = () => {
    setIsEventDetailsOpen(false);
    setSelectedEvent(null);
  };

  // Get date range based on current view
  const getDateRangeForView = () => {
    const currentDate = new Date(anoAtual, mesAtual, 1);
    
    switch (visualizacao) {
      case "monthly":
      case "grid":
      case "list":
        return {
          from: startOfMonth(currentDate),
          to: endOfMonth(currentDate)
        };
      case "weekly":
      case "agenda":
        const weekStart = startOfWeek(currentDate);
        const weekEnd = endOfWeek(currentDate);
        return {
          from: weekStart,
          to: weekEnd
        };
      default:
        return {
          from: startOfMonth(currentDate),
          to: endOfMonth(currentDate)
        };
    }
  };

  // Convert API response to Event type
  const convertApiEventToEvent = (apiEvent: any): Event => {
    return {
      id: apiEvent.id,
      title: apiEvent.title,
      description: apiEvent.description,
      churchId: apiEvent.churchId,
      location: apiEvent.location,
      date: new Date(apiEvent.startAtTimestamp),
      startAtTimestamp: apiEvent.startAtTimestamp,
      endAtTimestamp: apiEvent.endAtTimestamp,
      ministryId: apiEvent.ministryId,
      isPublic: apiEvent.isPublic,
      statusId: apiEvent.statusId,
      typeId: apiEvent.typeId,
      // Add legacy fields for compatibility with existing components
      titulo: apiEvent.title,
      data: new Date(apiEvent.startAtTimestamp),
      horario: format(new Date(apiEvent.startAtTimestamp), 'HH:mm'),
      local: apiEvent.location,
      tipo: apiEvent.typeId,
      cor: getEventColor(apiEvent.typeId),
    };
  };

  // Get event color based on type
  const getEventColor = (typeId: string) => {
    const colorMap: Record<string, string> = {
      'worship': 'purple',
      'meeting': 'blue',
      'special': 'red',
      'group': 'green',
      'other': 'orange'
    };
    return colorMap[typeId] || 'gray';
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

  // Fetch events with date range filter
  const fetchEvents = async () => {
    try {
      const dateRange = getDateRangeForView();
      
      // Build query parameters
      const params = new URLSearchParams();
      params.append('statusId', 'is-coming');
      
      if (dateRange.from) {
        params.append('startDate', format(dateRange.from, 'yyyy-MM-dd'));
      }
      if (dateRange.to) {
        params.append('endDate', format(dateRange.to, 'yyyy-MM-dd'));
      }

      const response = await EventService.getEvents('is-coming');
      if (response) {
        const convertedEvents = response.map(convertApiEventToEvent);
        setEvents(convertedEvents);
      }
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  // Fetch events when view or date changes
  useEffect(() => {
    fetchEvents();
  }, [visualizacao, mesAtual, anoAtual]);

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


import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import CalendarHeader from "@/components/events/CalendarHeader";
import CalendarViewSelector from "@/components/events/CalendarViewSelector";
import EventDetailsCard from "@/components/events/EventDetailsCard";
import EventsHeader from "@/components/events/EventsHeader";
import CalendarViewRenderer from "@/components/events/CalendarViewRenderer";
import { useEventCalendar } from "@/hooks/useEventCalendar";

const Eventos = () => {
  const {
    anoAtual,
    mesAtual,
    visualizacao,
    selectedCategories,
    eventosFiltrados,
    selectedEvent,
    isEventDetailsOpen,
    isLoading,
    error,
    handleDateChange,
    handleViewChange,
    handleRangeChange,
    handleCategoriesChange,
    handleEventClick,
    handleCloseEventDetails,
    handleCalendarDateChange,
    handleCalendarViewChange
  } = useEventCalendar();

  console.log('Eventos component - eventosFiltrados:', eventosFiltrados);
  console.log('Eventos component - isLoading:', isLoading);
  console.log('Eventos component - error:', error);

  return (
    <div className="space-y-4 md:space-y-6">
      <EventsHeader />
      
      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            {/* <CalendarHeader 
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
            /> */}
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              <span className="ml-2 text-muted-foreground">Carregando eventos...</span>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-destructive">Erro ao carregar eventos. Tente novamente.</p>
              <p className="text-sm text-muted-foreground mt-2">{error.message}</p>
            </div>
          ) : (
            <CalendarViewRenderer
              visualizacao={visualizacao}
              eventosFiltrados={eventosFiltrados}
              mesAtual={mesAtual}
              anoAtual={anoAtual}
              onEventClick={handleEventClick}
              onDateChange={handleCalendarDateChange}
              onViewChange={handleCalendarViewChange}
            />
          )}
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

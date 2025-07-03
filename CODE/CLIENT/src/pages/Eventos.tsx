
import { Card, CardContent, CardHeader } from "@/components/ui/card";
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
    handleDateChange,
    handleViewChange,
    handleRangeChange,
    handleCategoriesChange,
    handleEventClick,
    handleCloseEventDetails
  } = useEventCalendar();

  return (
    <div className="space-y-4 md:space-y-6">
      <EventsHeader />
      
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
          <CalendarViewRenderer
            visualizacao={visualizacao}
            eventosFiltrados={eventosFiltrados}
            mesAtual={mesAtual}
            anoAtual={anoAtual}
            onEventClick={handleEventClick}
          />
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

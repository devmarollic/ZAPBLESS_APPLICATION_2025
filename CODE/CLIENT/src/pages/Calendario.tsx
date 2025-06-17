
import { useEffect, useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Event } from "@/types/event";
import { HttpClient } from "@/lib/http_client";


const Calendario = () => {
  const [date, setDate] = useState<Date | undefined>(new Date(2025, 5, 4)); // 4 de junho de 2025
  const [currentMonth, setCurrentMonth] = useState(new Date(2025, 5, 1)); // junho de 2025
  const [events, setEvents] = useState<Event[]>([]);
  
  const eventosDodia = date 
    ? events.filter(
        (event) => 
          new Date(event.startAtTimestamp).getDate() === date.getDate() && 
          new Date(event.startAtTimestamp).getMonth() === date.getMonth() && 
          new Date(event.startAtTimestamp).getFullYear() === date.getFullYear()
      )
    : [];

  const formatarHora = (date: Date) => {
    return date.toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatarDataCompleta = (date: Date) => {
    return date.toLocaleDateString("pt-BR", { 
      day: "numeric", 
      month: "long", 
      year: "numeric" 
    });
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newMonth = new Date(currentMonth);
    if (direction === 'prev') {
      newMonth.setMonth(newMonth.getMonth() - 1);
    } else {
      newMonth.setMonth(newMonth.getMonth() + 1);
    }
    setCurrentMonth(newMonth);
  };

  const monthYear = currentMonth.toLocaleDateString("pt-BR", { 
    month: "long", 
    year: "numeric" 
  });

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
    <div className="space-y-6 max-w-7xl mx-auto md:p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold text-blue-600 mb-2">Calendário</h1>
          <p className="text-gray-600 text-lg">Gerencie os eventos da sua igreja</p>
        </div>
        <Button className="bg-black hover:bg-gray-800 text-white px-6 py-3 rounded-lg">
          <Plus className="mr-2 h-5 w-5" /> 
          Novo Evento
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="shadow-lg">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-bold">Calendário de Eventos</CardTitle>
            <CardDescription className="text-gray-600">
              Selecione uma data para ver os eventos
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Custom month navigation */}
              <div className="flex items-center justify-between mb-4">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => navigateMonth('prev')}
                  className="h-8 w-8"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <h3 className="font-semibold text-lg capitalize">{monthYear}</h3>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => navigateMonth('next')}
                  className="h-8 w-8"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>

              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                month={currentMonth}
                onMonthChange={setCurrentMonth}
                className="rounded-md border w-full"
                showOutsideDays={true}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-bold">
              {date ? formatarDataCompleta(date) : "Selecione uma data"}
            </CardTitle>
            <CardDescription className="text-gray-600">
              {eventosDodia.length} evento(s) neste dia
            </CardDescription>
          </CardHeader>
          <CardContent className="min-h-[300px]">
            {eventosDodia.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">Nenhum evento para este dia</p>
              </div>
            ) : (
              <div className="space-y-4">
                {eventosDodia.map((evento) => (
                  <div key={evento.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-lg">{evento.title}</h3>
                      <span className="text-blue-600 font-semibold">
                        {formatarHora(new Date(evento.startAtTimestamp))}
                      </span>
                    </div>
                    <p className="text-gray-600 mb-3">{evento.description}</p>
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="sm" className="text-gray-600 hover:text-gray-800">
                        Editar
                      </Button>
                      <Button variant="outline" size="sm" className="text-red-500 hover:text-red-700 hover:bg-red-50">
                        Cancelar
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
          <div className="border-t p-4">
            <div className="flex justify-between gap-4">
              <Button variant="outline" className="flex-1">
                Ver todos os eventos
              </Button>
              <Button asChild className="flex-1 bg-black hover:bg-gray-800">
                <Link to="/dashboard/eventos/novo">Novo Evento</Link>
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Calendario;

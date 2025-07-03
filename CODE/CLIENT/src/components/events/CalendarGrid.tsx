
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface CalendarGridProps {
  calendario: Date[][];
  eventos: any[];
  mesAtual: number;
  anoAtual: number;
  dataAtual: Date;
  onEventClick?: (event: any) => void;
}

const CalendarGrid = ({ 
  calendario, 
  eventos, 
  mesAtual, 
  anoAtual, 
  dataAtual,
  onEventClick 
}: CalendarGridProps) => {
  const diasSemana = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
  const nomeMes = new Date(anoAtual, mesAtual).toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });

  const obterEventosDoDia = (data: Date) => {
    return eventos.filter(evento => {
      const eventoData = new Date(evento.date);
      return eventoData.toDateString() === data.toDateString();
    });
  };

  const isToday = (data: Date) => {
    return data.toDateString() === dataAtual.toDateString();
  };

  const isCurrentMonth = (data: Date) => {
    return data.getMonth() === mesAtual;
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-7 gap-1 text-center text-sm font-medium text-muted-foreground">
        {diasSemana.map(dia => (
          <div key={dia} className="p-2">
            {dia}
          </div>
        ))}
      </div>
      
      <div className="grid grid-cols-7 gap-1">
        {calendario.flat().map((data, index) => {
          const eventosDoDia = obterEventosDoDia(data);
          const isHoje = isToday(data);
          const isMesAtual = isCurrentMonth(data);
          
          return (
            <div
              key={index}
              className={`
                md:min-h-[60px] lg:min-h-[100px] p-2 border rounded-lg transition-colors hover:bg-muted/50
                ${isMesAtual ? 'bg-background' : 'bg-muted/20 text-muted-foreground'}
                ${isHoje ? 'ring-2 ring-primary' : ''}
              `}
            >
              <div className={`text-sm font-medium mb-2 ${isHoje ? 'text-primary' : ''}`}>
                {data.getDate()}
              </div>
              
              <div className="space-y-1">
                {eventosDoDia.slice(0, 3).map((evento, idx) => (
                  <div
                    key={idx}
                    className="cursor-pointer"
                    onClick={() => onEventClick?.(evento)}
                  >
                    <Badge
                      variant="outline"
                      className={`
                        text-xs p-1 w-full justify-start truncate
                        ${evento.ministry?.color === 'green' ? 'border-green-300 bg-green-50 text-green-800' : ''}
                        ${evento.ministry?.color === 'blue' ? 'border-blue-300 bg-blue-50 text-blue-800' : ''}
                        ${evento.ministry?.color === 'purple' ? 'border-purple-300 bg-purple-50 text-purple-800' : ''}
                        ${evento.ministry?.color === 'red' ? 'border-red-300 bg-red-50 text-red-800' : ''}
                        ${evento.ministry?.color === 'orange' ? 'border-orange-300 bg-orange-50 text-orange-800' : ''}
                        hover:opacity-80 transition-opacity
                      `}
                    >
                      {evento.title}
                    </Badge>
                  </div>
                ))}
                
                {eventosDoDia.length > 3 && (
                  <div className="text-xs text-muted-foreground">
                    +{eventosDoDia.length - 3} mais
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CalendarGrid;

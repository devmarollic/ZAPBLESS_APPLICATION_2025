
import { addDays, addWeeks, addMonths, addYears, isAfter, isBefore, isSameDay, format } from 'date-fns';
import { EventResponse } from '@/services/eventService';

export interface CalculatedEventOccurrence {
  id: string;
  originalId: string;
  title: string;
  description: string;
  location: string;
  statusId: string;
  typeId: string;
  startAtTimestamp: string;
  endAtTimestamp: string;
  ministry?: { name: string; color: string } | null;
  eventType: { name: string };
  eventStatus: { name: string };
  isRecurring: boolean;
  occurrenceDate: Date;
}

export const calculateRecurrentEventOccurrences = (
  events: EventResponse[],
  startDate: Date,
  endDate: Date
): CalculatedEventOccurrence[] => {
  const occurrences: CalculatedEventOccurrence[] = [];

  events.forEach(event => {
    console.log('Processing event:', event.title, 'recurrenceTypeId:', event.recurrenceTypeId);
    
    if (!event.recurrenceTypeId || event.recurrenceTypeId === 'none' || !event.recurrence) {
      // Evento não recorrente
      const eventDate = new Date(event.startAtTimestamp);
      if (eventDate >= startDate && eventDate <= endDate) {
        occurrences.push({
          id: `${event.id}-${eventDate.getTime()}`,
          originalId: event.id,
          title: event.title,
          description: event.description,
          location: event.location,
          statusId: event.statusId,
          typeId: event.typeId,
          startAtTimestamp: event.startAtTimestamp,
          endAtTimestamp: event.endAtTimestamp,
          ministry: event.ministry?.name ? {
            name: event.ministry.name,
            color: getEventTypeColor(event.typeId)
          } : null,
          eventType: event.eventType,
          eventStatus: event.eventStatus,
          isRecurring: false,
          occurrenceDate: eventDate
        });
      }
      return;
    }

    const recurrenceRule = event.recurrence;
    const originalStartDate = new Date(event.startAtTimestamp);
    const originalEndDate = new Date(event.endAtTimestamp);
    const recurrenceEndDate = new Date(recurrenceRule.endAtTimestamp);
    
    // Calcular a duração do evento
    const eventDuration = originalEndDate.getTime() - originalStartDate.getTime();

    // Para eventos recorrentes, se a data de fim da recorrência for muito próxima do início,
    // usar um período mais longo baseado no tipo de recorrência
    let effectiveRecurrenceEndDate = recurrenceEndDate;
    const daysDifference = Math.abs(recurrenceEndDate.getTime() - originalStartDate.getTime()) / (1000 * 60 * 60 * 24);
    
    if (daysDifference < 7) { // Se a diferença for menor que uma semana
      switch (event.recurrenceTypeId) {
        case 'daily':
          effectiveRecurrenceEndDate = addMonths(originalStartDate, 3); // 3 meses para diário
          break;
        case 'weekly':
          effectiveRecurrenceEndDate = addMonths(originalStartDate, 6); // 6 meses para semanal
          break;
        case 'monthly':
          effectiveRecurrenceEndDate = addYears(originalStartDate, 1); // 1 ano para mensal
          break;
        case 'yearly':
          effectiveRecurrenceEndDate = addYears(originalStartDate, 5); // 5 anos para anual
          break;
      }
    }

    let currentDate = new Date(originalStartDate);
    
    // Garantir que não passamos do limite de recorrência nem do período solicitado
    const maxEndDate = isBefore(effectiveRecurrenceEndDate, endDate) ? effectiveRecurrenceEndDate : endDate;

    console.log('Processing recurrent event:', {
      title: event.title,
      recurrenceTypeId: event.recurrenceTypeId,
      interval: recurrenceRule.interval,
      dayOfWeekArray: recurrenceRule.dayOfWeekArray,
      dayOfMonthArray: recurrenceRule.dayOfMonthArray,
      originalStartDate,
      recurrenceEndDate,
      effectiveRecurrenceEndDate,
      maxEndDate: format(maxEndDate, 'yyyy-MM-dd')
    });

    let iterationCount = 0;
    const maxIterations = 1000; // Proteção contra loop infinito

    while ((isBefore(currentDate, maxEndDate) || isSameDay(currentDate, maxEndDate)) && iterationCount < maxIterations) {
      iterationCount++;
      
      // Verificar se a data atual está dentro do range solicitado
      if ((isAfter(currentDate, startDate) || isSameDay(currentDate, startDate)) && 
          (isBefore(currentDate, endDate) || isSameDay(currentDate, endDate))) {
        
        let shouldInclude = false;

        switch (event.recurrenceTypeId) {
          case 'daily':
            shouldInclude = true;
            break;
          case 'weekly':
            if (recurrenceRule.dayOfWeekArray?.length === 0) {
              // Se não há dias específicos, usar o dia da semana original
              shouldInclude = currentDate.getDay() === originalStartDate.getDay();
            } else {
              shouldInclude = recurrenceRule.dayOfWeekArray?.includes(currentDate.getDay());
            }
            break;
          case 'monthly':
            if (recurrenceRule.dayOfMonthArray.length === 0) {
              // Se não há dias específicos, usar o dia do mês original
              shouldInclude = currentDate.getDate() === originalStartDate.getDate();
            } else {
              shouldInclude = recurrenceRule.dayOfMonthArray.includes(currentDate.getDate());
            }
            break;
          case 'yearly':
            shouldInclude = currentDate.getMonth() === originalStartDate.getMonth() && 
                           currentDate.getDate() === originalStartDate.getDate();
            break;
        }

        if (shouldInclude) {
          const occurrenceEndDate = new Date(currentDate.getTime() + eventDuration);
          
          console.log(`Adding occurrence for ${event.title} on ${format(currentDate, 'yyyy-MM-dd')}`);
          
          occurrences.push({
            id: `${event.id}-${currentDate.getTime()}`,
            originalId: event.id,
            title: event.title,
            description: event.description,
            location: event.location,
            statusId: event.statusId,
            typeId: event.typeId,
            startAtTimestamp: currentDate.toISOString(),
            endAtTimestamp: occurrenceEndDate.toISOString(),
            ministry: event.ministry?.name ? {
              name: event.ministry.name,
              color: getEventTypeColor(event.typeId)
            } : null,
            eventType: event.eventType,
            eventStatus: event.eventStatus,
            isRecurring: true,
            occurrenceDate: currentDate
          });
        }
      }

      // Avançar para a próxima data baseada no tipo de recorrência
      switch (event.recurrenceTypeId) {
        case 'daily':
          currentDate = addDays(currentDate, recurrenceRule.interval);
          break;
        case 'weekly':
          if (recurrenceRule.dayOfWeekArray?.length > 0) {
            // Para eventos semanais com dias específicos, encontrar o próximo dia da semana
            let nextDay = new Date(currentDate);
            let found = false;
            
            for (let i = 1; i <= 7; i++) {
              nextDay = addDays(currentDate, i);
              if (recurrenceRule.dayOfWeekArray?.includes(nextDay.getDay())) {
                currentDate = nextDay;
                found = true;
                break;
              }
            }
            
            if (!found) {
              currentDate = addWeeks(currentDate, recurrenceRule.interval);
            }
          } else {
            currentDate = addWeeks(currentDate, recurrenceRule.interval);
          }
          break;
        case 'monthly':
          currentDate = addMonths(currentDate, recurrenceRule.interval);
          break;
        case 'yearly':
          currentDate = addYears(currentDate, recurrenceRule.interval);
          break;
        default:
          // Fallback para evitar loop infinito
          currentDate = addDays(currentDate, 1);
      }

      // Proteção adicional contra loop infinito
      if (currentDate > new Date('2030-12-31')) {
        break;
      }
    }

    if (iterationCount >= maxIterations) {
      console.warn(`Maximum iterations reached for event: ${event.title}`);
    }
  });

  console.log('Final calculated occurrences:', occurrences.length);
  return occurrences.sort((a, b) => a.occurrenceDate.getTime() - b.occurrenceDate.getTime());
};

const getEventTypeColor = (typeId: string): string => {
  const colorMap: Record<string, string> = {
    'worship': 'purple',
    'meeting': 'blue',
    'special': 'red',
    'group': 'green',
    'other': 'orange'
  };
  return colorMap[typeId] || 'gray';
};

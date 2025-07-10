
import { addDays, addWeeks, addMonths, addYears, isAfter, isBefore, isSameDay, format, isValid } from 'date-fns';
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

  console.log('Starting recurrence calculation for date range:', {
    startDate: format(startDate, 'yyyy-MM-dd'),
    endDate: format(endDate, 'yyyy-MM-dd'),
    totalEvents: events.length
  });

  events.forEach(event => {
    console.log('Processing event:', {
      id: event.id,
      title: event.title,
      startAtTimestamp: event.startAtTimestamp,
      endAtTimestamp: event.endAtTimestamp,
      recurrenceTypeId: event.recurrenceTypeId,
      recurrence: event.recurrence
    });
    console.log('Processing event:', {
      title: event.title,
      recurrenceTypeId: event.recurrenceTypeId,
      startAtTimestamp: event.startAtTimestamp,
      hasRecurrence: !!event.recurrence
    });
    
    // Validar se o evento tem dados de recorrência válidos
    if (!event.recurrenceTypeId || event.recurrenceTypeId === 'none' || !event.recurrence) {
      // Evento não recorrente
      let eventDate: Date;
      try {
        eventDate = new Date(event.startAtTimestamp);
        if (isNaN(eventDate.getTime())) {
          console.warn(`Invalid start date for event ${event.title}: ${event.startAtTimestamp}`);
          return; // Pular este evento se a data for inválida
        }
      } catch (error) {
        console.warn(`Error parsing start date for event ${event.title}: ${event.startAtTimestamp}`);
        return; // Pular este evento se houver erro
      }
      
      if (eventDate >= startDate && eventDate <= endDate) {
        console.log('Adding non-recurring event:', event.title, 'on', format(eventDate, 'yyyy-MM-dd'));
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
    
    // Validar se os dados de recorrência são válidos
    if (!recurrenceRule || typeof recurrenceRule !== 'object') {
      console.warn(`Invalid recurrence data for event ${event.title}:`, recurrenceRule);
      return; // Pular este evento se os dados de recorrência forem inválidos
    }
    
    // Validar se o interval é válido
    if (!recurrenceRule.interval || typeof recurrenceRule.interval !== 'number' || recurrenceRule.interval <= 0) {
      console.warn(`Invalid recurrence interval for event ${event.title}:`, recurrenceRule.interval);
      return; // Pular este evento se o interval for inválido
    }
    
    // Validar datas de início e fim do evento
    let originalStartDate: Date;
    let originalEndDate: Date;
    
    try {
      originalStartDate = new Date(event.startAtTimestamp);
      if (isNaN(originalStartDate.getTime())) {
        console.warn(`Invalid start date for event ${event.title}: ${event.startAtTimestamp}`);
        return; // Pular este evento se a data for inválida
      }
    } catch (error) {
      console.warn(`Error parsing start date for event ${event.title}: ${event.startAtTimestamp}`);
      return; // Pular este evento se houver erro
    }
    
    try {
      originalEndDate = new Date(event.endAtTimestamp);
      if (isNaN(originalEndDate.getTime())) {
        console.warn(`Invalid end date for event ${event.title}: ${event.endAtTimestamp}`);
        return; // Pular este evento se a data for inválida
      }
    } catch (error) {
      console.warn(`Error parsing end date for event ${event.title}: ${event.endAtTimestamp}`);
      return; // Pular este evento se houver erro
    }
    
    // Validar se a data de fim da recorrência é válida
    let recurrenceEndDate: Date;
    try {
      recurrenceEndDate = new Date(recurrenceRule.endAtTimestamp);
      if (isNaN(recurrenceEndDate.getTime())) {
        console.warn(`Invalid recurrence end date for event ${event.title}: ${recurrenceRule.endAtTimestamp}`);
        // Usar uma data padrão se a data for inválida
        recurrenceEndDate = addMonths(originalStartDate, 6); // 6 meses como padrão
      }
    } catch (error) {
      console.warn(`Error parsing recurrence end date for event ${event.title}: ${recurrenceRule.endAtTimestamp}`);
      // Usar uma data padrão se houver erro
      recurrenceEndDate = addMonths(originalStartDate, 6); // 6 meses como padrão
    }
    
    // Calcular a duração do evento
    const eventDuration = originalEndDate.getTime() - originalStartDate.getTime();

    console.log('Recurrence details:', {
      title: event.title,
      recurrenceTypeId: event.recurrenceTypeId,
      interval: recurrenceRule.interval,
      dayOfWeekArray: recurrenceRule.dayOfWeekArray,
      dayOfMonthArray: recurrenceRule.dayOfMonthArray,
      originalStartDate: format(originalStartDate, 'yyyy-MM-dd'),
      originalStartDayOfWeek: originalStartDate.getDay(),
      recurrenceEndDate: format(recurrenceEndDate, 'yyyy-MM-dd'),
      eventDuration: `${eventDuration / (1000 * 60 * 60)} hours`
    });

    // Para eventos recorrentes, se a data de fim da recorrência for muito próxima do início,
    // usar um período mais longo baseado no tipo de recorrência
    let effectiveRecurrenceEndDate = recurrenceEndDate;
    const daysDifference = Math.abs(recurrenceEndDate.getTime() - originalStartDate.getTime()) / (1000 * 60 * 60 * 24);
    
    // Se a data de fim da recorrência é válida e está no futuro, usar ela
    if (isValid(recurrenceEndDate) && isAfter(recurrenceEndDate, originalStartDate)) {
      // Ajustar para o final do dia se a hora for muito cedo (antes das 6h)
      if (recurrenceEndDate.getHours() < 6) {
        effectiveRecurrenceEndDate = new Date(recurrenceEndDate);
        effectiveRecurrenceEndDate.setHours(23, 59, 59, 999);
        console.log('Adjusted recurrence end date to end of day:', format(effectiveRecurrenceEndDate, 'yyyy-MM-dd HH:mm:ss'));
      } else {
        effectiveRecurrenceEndDate = recurrenceEndDate;
        console.log('Using provided recurrence end date:', format(effectiveRecurrenceEndDate, 'yyyy-MM-dd'));
      }
    } else if (isValid(recurrenceEndDate)) {
      // Se a data é válida mas não está no futuro, pode ser que seja o mesmo dia
      effectiveRecurrenceEndDate = recurrenceEndDate;
      console.log('Using recurrence end date (same day):', format(effectiveRecurrenceEndDate, 'yyyy-MM-dd'));
    } else {
      // Caso contrário, usar um período padrão baseado no tipo de recorrência
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
      console.log('Using default recurrence end date:', format(effectiveRecurrenceEndDate, 'yyyy-MM-dd'));
    }

    let currentDate = new Date(originalStartDate);
    
    // Validar se currentDate é válido
    if (isNaN(currentDate.getTime())) {
      console.warn(`Invalid current date for event ${event.title}`);
      return; // Pular este evento se a data for inválida
    }
    
    // Garantir que não passamos do limite de recorrência nem do período solicitado
    const maxEndDate = isBefore(effectiveRecurrenceEndDate, endDate) ? effectiveRecurrenceEndDate : endDate;

    console.log('Processing recurrent event:', {
      title: event.title,
      recurrenceTypeId: event.recurrenceTypeId,
      interval: recurrenceRule.interval,
      dayOfWeekArray: recurrenceRule.dayOfWeekArray,
      dayOfMonthArray: recurrenceRule.dayOfMonthArray,
      originalStartDate: format(originalStartDate, 'yyyy-MM-dd'),
      originalStartDayOfWeek: originalStartDate.getDay(),
      recurrenceEndDate: format(recurrenceEndDate, 'yyyy-MM-dd'),
      effectiveRecurrenceEndDate: format(effectiveRecurrenceEndDate, 'yyyy-MM-dd'),
      maxEndDate: format(maxEndDate, 'yyyy-MM-dd'),
      requestedStartDate: format(startDate, 'yyyy-MM-dd'),
      requestedEndDate: format(endDate, 'yyyy-MM-dd')
    });

    let iterationCount = 0;
    const maxIterations = 1000; // Proteção contra loop infinito
    let occurrencesAdded = 0;

    while ((isBefore(currentDate, maxEndDate) || isSameDay(currentDate, maxEndDate)) && iterationCount < maxIterations) {
      iterationCount++;
      
      console.log(`Iteration ${iterationCount}: Checking date ${format(currentDate, 'yyyy-MM-dd')} (day ${currentDate.getDay()})`);
      
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
              console.log(`Weekly check (no specific days): current day ${currentDate.getDay()} vs original day ${originalStartDate.getDay()} = ${shouldInclude}`);
            } else {
              // Verificar se a data atual é um dos dias da semana especificados
              shouldInclude = recurrenceRule.dayOfWeekArray?.includes(currentDate.getDay());
              console.log(`Weekly check (specific days): current day ${currentDate.getDay()} in ${recurrenceRule.dayOfWeekArray} = ${shouldInclude}`);
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
          
          // Validar se as datas são válidas antes de adicionar
          if (isNaN(currentDate.getTime()) || isNaN(occurrenceEndDate.getTime())) {
            console.warn(`Invalid date calculated for event ${event.title}: currentDate=${currentDate}, occurrenceEndDate=${occurrenceEndDate}`);
            continue; // Pular esta ocorrência se as datas forem inválidas
          }
          
          console.log(`✓ Adding occurrence for ${event.title} on ${format(currentDate, 'yyyy-MM-dd')}`);
          occurrencesAdded++;
          
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
        } else {
          console.log(`✗ Skipping ${format(currentDate, 'yyyy-MM-dd')} - not a matching day of week`);
        }
      } else {
        console.log(`✗ Skipping ${format(currentDate, 'yyyy-MM-dd')} - outside requested range`);
      }

      // Avançar para a próxima data baseada no tipo de recorrência
      let nextDate: Date;
      switch (event.recurrenceTypeId) {
        case 'daily':
          nextDate = addDays(currentDate, recurrenceRule.interval);
          break;
        case 'weekly':
          if (recurrenceRule.dayOfWeekArray?.length > 0) {
            // Para eventos semanais com dias específicos, avançar uma semana
            nextDate = addWeeks(currentDate, recurrenceRule.interval);
          } else {
            // Se não há dias específicos, avançar uma semana
            nextDate = addWeeks(currentDate, recurrenceRule.interval);
          }
          break;
        case 'monthly':
          nextDate = addMonths(currentDate, recurrenceRule.interval);
          break;
        case 'yearly':
          nextDate = addYears(currentDate, recurrenceRule.interval);
          break;
        default:
          // Fallback para evitar loop infinito
          nextDate = addDays(currentDate, 1);
      }
      
      // Validar se a próxima data é válida
      if (isNaN(nextDate.getTime())) {
        console.warn(`Invalid next date calculated for event ${event.title}: ${nextDate}`);
        break; // Sair do loop se a data for inválida
      }
      
      currentDate = nextDate;

      // Proteção adicional contra loop infinito
      if (currentDate > new Date('2030-12-31')) {
        break;
      }
    }

    console.log(`Finished processing ${event.title}: ${occurrencesAdded} occurrences added, ${iterationCount} iterations`);
    
    if (iterationCount >= maxIterations) {
      console.warn(`Maximum iterations reached for event: ${event.title}`);
    }
  });

  console.log('Final calculated occurrences:', occurrences.length);
  return occurrences.sort((a, b) => a.occurrenceDate.getTime() - b.occurrenceDate.getTime());
};

const getEventTypeColor = (typeId: string): string => {
  const colorMap: Record<string, string> = {
    'worship': '#10b981', // green
    'meeting': '#3b82f6', // blue
    'special': '#8b5cf6', // purple
    'group': '#f97316', // orange
    'other': '#ef4444' // red
  };
  return colorMap[typeId] || '#3b82f6'; // default blue
};

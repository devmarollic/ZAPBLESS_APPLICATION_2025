
import { useState, useCallback, useRef } from "react";
import { format } from "date-fns";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { EventService, EventResponse } from "@/services/eventService";
import { Event } from "@/types/event";
import { aplicarFiltros } from "@/utils/calendarUtils";
import { calculateRecurrentEventOccurrences, CalculatedEventOccurrence } from "@/utils/recurrenceUtils";

// -- CONSTANTS

const EVENTS_QUERY_KEY = "events";

const EVENT_TYPE_COLORS: Record<string, string> = {
    'worship': '#10b981',
    'meeting': '#3b82f6',
    'special': '#8b5cf6',
    'group': '#f97316',
    'other': '#ef4444'
};

const DEFAULT_EVENT_COLOR = '#3b82f6';

// -- TYPES

interface DateRange {
    from: Date;
    to: Date;
}

// -- FUNCTIONS

export const useEventCalendar = () => {
    // -- VARIABLES
    
    const [selectedCategories, setSelectedCategories] = useState<string[]>(['todas']);
    const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
    const [isEventDetailsOpen, setIsEventDetailsOpen] = useState(false);
    const [fullCalendarDateRange, setFullCalendarDateRange] = useState<DateRange>(() => {
        const now = new Date();
        return {
            from: new Date(now.getFullYear(), now.getMonth(), 1),
            to: new Date(now.getFullYear(), now.getMonth() + 1, 0)
        };
    });

    // Ref para evitar re-renders desnecessários
    const dateRangeRef = useRef<DateRange>(fullCalendarDateRange);
    dateRangeRef.current = fullCalendarDateRange;

    const queryClient = useQueryClient();

    // ~~

    const getEventTypeColor = useCallback((typeId: string): string => {
        return EVENT_TYPE_COLORS[typeId] || DEFAULT_EVENT_COLOR;
    }, []);

    // ~~

    const convertApiEventToEvent = useCallback((apiEvent: EventResponse): Event => {
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
            ministry: apiEvent.ministry?.name ? {
                id: apiEvent.ministryId || '',
                name: apiEvent.ministry.name,
                color: getEventTypeColor(apiEvent.typeId)
            } : undefined,
            eventStatus: {
                id: apiEvent.statusId,
                name: apiEvent.eventStatus.name
            },
            eventType: {
                id: apiEvent.typeId,
                name: apiEvent.eventType.name
            }
        };
    }, [getEventTypeColor]);

    // ~~

    const convertOccurrenceToEvent = useCallback((occurrence: CalculatedEventOccurrence): Event => {
        return {
            id: occurrence.id,
            title: occurrence.title,
            description: occurrence.description,
            churchId: '',
            location: occurrence.location,
            date: occurrence.occurrenceDate,
            startAtTimestamp: occurrence.startAtTimestamp,
            endAtTimestamp: occurrence.endAtTimestamp,
            ministryId: undefined,
            isPublic: true,
            statusId: occurrence.statusId,
            typeId: occurrence.typeId,
            ministry: occurrence.ministry ? {
                id: '',
                name: occurrence.ministry.name,
                color: occurrence.ministry.color
            } : undefined,
            eventStatus: {
                id: occurrence.statusId,
                name: occurrence.eventStatus.name
            },
            eventType: {
                id: occurrence.typeId,
                name: occurrence.eventType.name
            }
        };
    }, []);

    // ~~

    // Usar uma data fixa baseada no mês atual para evitar conflitos
    const currentMonth = new Date();
    const monthStart = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
    const monthEnd = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);

    const { data: rawEvents = [], isLoading, error, refetch } = useQuery({
        queryKey: [EVENTS_QUERY_KEY, monthStart, monthEnd],
        queryFn: async () => {
            const response = await EventService.getEvents(
                'is-coming',
                format(monthStart, 'yyyy-MM-dd'),
                format(monthEnd, 'yyyy-MM-dd')
            );

            return response || [];
        },
        staleTime: 0,
        gcTime: 10 * 60 * 1000,
    });

    // ~~

    const processedEvents = useCallback(() => {
        if (!rawEvents || rawEvents.length === 0) {
            return [];
        }

        // Separar eventos recorrentes dos não recorrentes
        const recurringEvents = rawEvents.filter(event => 
            event.recurrenceTypeId && 
            event.recurrenceTypeId !== 'none' && 
            event.recurrence
        );
        
        const nonRecurringEvents = rawEvents.filter(event => 
            !event.recurrenceTypeId || 
            event.recurrenceTypeId === 'none' || 
            !event.recurrence
        );

        // Converter eventos não recorrentes
        const convertedEvents = nonRecurringEvents.map(convertApiEventToEvent);

        // Calcular ocorrências apenas para eventos recorrentes
        const occurrences = calculateRecurrentEventOccurrences(
            recurringEvents,
            monthStart,
            monthEnd
        );

        const occurrenceEvents = occurrences.map(convertOccurrenceToEvent);

        // Combinar eventos sem duplicação
        const allEvents = [...convertedEvents, ...occurrenceEvents];

        return allEvents;
    }, [rawEvents, monthStart, monthEnd, convertApiEventToEvent, convertOccurrenceToEvent]);

    // ~~

    const eventosFiltrados = aplicarFiltros(
        processedEvents(),
        selectedCategories,
        undefined,
        undefined,
        monthStart.getMonth(),
        monthStart.getFullYear()
    );

    // ~~

    const handleCategoriesChange = useCallback((categories: string[]) => {
        setSelectedCategories(categories);
    }, []);

    // ~~

    const handleEventClick = useCallback((event: Event) => {
        setSelectedEvent(event);
        setIsEventDetailsOpen(true);
    }, []);

    // ~~

    const handleCloseEventDetails = useCallback(() => {
        setIsEventDetailsOpen(false);
        setSelectedEvent(null);
    }, []);



    return {
        selectedCategories,
        eventosFiltrados,
        selectedEvent,
        isEventDetailsOpen,
        isLoading,
        error,
        handleCategoriesChange,
        handleEventClick,
        handleCloseEventDetails,
        refetch
    };
};

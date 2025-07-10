
import { useState, useCallback } from "react";
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

    const { data: rawEvents = [], isLoading, error, refetch } = useQuery({
        queryKey: [EVENTS_QUERY_KEY, fullCalendarDateRange.from, fullCalendarDateRange.to],
        queryFn: async () => {
            const response = await EventService.getEvents(
                'is-coming',
                format(fullCalendarDateRange.from, 'yyyy-MM-dd'),
                format(fullCalendarDateRange.to, 'yyyy-MM-dd')
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
            fullCalendarDateRange.from,
            fullCalendarDateRange.to
        );

        const occurrenceEvents = occurrences.map(convertOccurrenceToEvent);

        // Combinar eventos sem duplicação
        const allEvents = [...convertedEvents, ...occurrenceEvents];

        return allEvents;
    }, [rawEvents, fullCalendarDateRange, convertApiEventToEvent, convertOccurrenceToEvent]);

    // ~~

    const eventosFiltrados = aplicarFiltros(
        processedEvents(),
        selectedCategories,
        undefined,
        undefined,
        fullCalendarDateRange.from.getMonth(),
        fullCalendarDateRange.from.getFullYear()
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

    // ~~

    const handleCalendarDateChange = useCallback((start: Date, end: Date) => {
        const startDate = new Date(start);
        const endDate = new Date(end);
        
        setFullCalendarDateRange({
            from: startDate,
            to: endDate
        });

        queryClient.invalidateQueries({ 
            queryKey: [EVENTS_QUERY_KEY, startDate, endDate] 
        });
    }, [queryClient]);

    // ~~

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
        handleCalendarDateChange,
        refetch
    };
};

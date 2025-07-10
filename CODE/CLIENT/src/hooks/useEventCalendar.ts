
import { useState, useCallback } from "react";
import { startOfMonth, endOfMonth, startOfWeek, endOfWeek, format } from "date-fns";
import { useQuery } from "@tanstack/react-query";
import { EventService, EventResponse } from "@/services/eventService";
import { Event } from "@/types/event";
import { aplicarFiltros } from "@/utils/calendarUtils";
import { calculateRecurrentEventOccurrences, CalculatedEventOccurrence } from "@/utils/recurrenceUtils";

// -- CONSTANTS

const EVENTS_QUERY_KEY = "events";

// -- TYPES

interface DateRange {
    from: Date;
    to: Date;
}

// -- FUNCTIONS

export const useEventCalendar = () => {
    const [anoAtual, setAnoAtual] = useState(2025);
    const [mesAtual, setMesAtual] = useState(6); // Julho (0-indexed) - baseado nos dados da API
    const [visualizacao, setVisualizacao] = useState("monthly");
    const [selectedCategories, setSelectedCategories] = useState<string[]>(['todas']);
    const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({
        from: undefined,
        to: undefined
    });
    const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
    const [isEventDetailsOpen, setIsEventDetailsOpen] = useState(false);

    // Get date range based on current view and selected month/year
    const getDateRangeForView = useCallback(() => {
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
    }, [anoAtual, mesAtual, visualizacao]);

    // Get color based on event type
    const getEventTypeColor = useCallback((typeId: string): string => {
        const colors: Record<string, string> = {
            'worship': '#10b981', // green
            'meeting': '#3b82f6', // blue
            'special': '#8b5cf6', // purple
            'group': '#f97316', // orange
            'other': '#ef4444' // red
        };
        return colors[typeId] || '#3b82f6'; // default blue
    }, []);

    // Convert API response to Event type
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

    // Convert calculated occurrence to Event type
    const convertOccurrenceToEvent = useCallback((occurrence: CalculatedEventOccurrence): Event => {
        return {
            id: occurrence.id,
            title: occurrence.title,
            description: occurrence.description,
            churchId: '', // Will be filled by API
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

    // Fetch events using React Query
    const currentDateRange = getDateRangeForView();

    const { data: rawEvents = [], isLoading, error, refetch } = useQuery({
        queryKey: [EVENTS_QUERY_KEY, visualizacao, anoAtual, mesAtual, currentDateRange.from, currentDateRange.to],
        queryFn: async () => {
            const response = await EventService.getEvents(
                'is-coming',
                format(currentDateRange.from, 'yyyy-MM-dd'),
                format(currentDateRange.to, 'yyyy-MM-dd')
            );

            return response || [];
        },
        staleTime: 0, // Always refetch when query key changes
        gcTime: 10 * 60 * 1000, // 10 minutes
    });

    // Process events: convert API events and calculate recurrences
    const processedEvents = useCallback(() => {
        if (!rawEvents || rawEvents.length === 0) {
            
            // Test with mock data to verify processing works
            const mockEvent: EventResponse = {
                id: "test-123",
                churchId: "Q3dmp5fTjBJcvr63HaBHkg",
                ministryId: "VN--VCoDqbSlfmuRC_B5jw",
                title: "Test Event",
                description: "Test Description",
                location: "Test Location",
                statusId: "is-coming",
                typeId: "worship",
                otherTypeReason: "",
                startAtTimestamp: "2025-07-12T12:59:08",
                endAtTimestamp: "2025-07-12T14:59:08",
                isPublic: true,
                recurrenceTypeId: "none",
                creationTimestamp: "2025-07-10T15:59:58.707754",
                updateTimestamp: "2025-07-10T15:59:58.707754",
                church: { name: "Test Church" },
                ministry: { name: "Test Ministry" },
                eventStatus: { name: "Está por vir" },
                eventType: { name: "Adoração" },
                recurrenceType: { name: "Nenhuma" },
                recurrence: undefined
            };
            
            const testEvent = convertApiEventToEvent(mockEvent);
            
            return [testEvent];
        }

        // First, convert API events to our Event type
        const convertedEvents = rawEvents.map(convertApiEventToEvent);

        // Then calculate recurrent events
        const occurrences = calculateRecurrentEventOccurrences(
            rawEvents,
            currentDateRange.from,
            currentDateRange.to
        );

        // Convert occurrences to Event type
        const occurrenceEvents = occurrences.map(convertOccurrenceToEvent);

        // Combine regular events and occurrence events
        const allEvents = [...convertedEvents, ...occurrenceEvents];

        return allEvents;
    }, [rawEvents, currentDateRange, convertApiEventToEvent, convertOccurrenceToEvent]);

    // Apply filters to get filtered events
    const eventosFiltrados = aplicarFiltros(
        processedEvents(),
        selectedCategories,
        dateRange.from,
        dateRange.to,
        mesAtual,
        anoAtual
    );

    // Event handlers
    const handleDateChange = useCallback((date: Date) => {
        const newMonth = date.getMonth();
        const newYear = date.getFullYear();

        setMesAtual(newMonth);
        setAnoAtual(newYear);
    }, [mesAtual, anoAtual]);

    const handleViewChange = useCallback((view: string) => {
        setVisualizacao(view);
    }, [visualizacao]);

    const handleRangeChange = useCallback((range: { from: Date | undefined; to: Date | undefined }) => {
        setDateRange(range);
        if (range.from) {
            setMesAtual(range.from.getMonth());
            setAnoAtual(range.from.getFullYear());
        }
    }, []);

    const handleCategoriesChange = useCallback((categories: string[]) => {
        setSelectedCategories(categories);
    }, []);

    const handleEventClick = useCallback((event: Event) => {
        setSelectedEvent(event);
        setIsEventDetailsOpen(true);
    }, []);

    const handleCloseEventDetails = useCallback(() => {
        setIsEventDetailsOpen(false);
        setSelectedEvent(null);
    }, []);

    // FullCalendar navigation handlers
    const handleCalendarDateChange = useCallback((date: Date) => {
        const newMonth = date.getMonth();
        const newYear = date.getFullYear();
        
        setMesAtual(newMonth);
        setAnoAtual(newYear);
    }, [mesAtual, anoAtual]);

    const handleCalendarViewChange = useCallback((view: string) => {
        // Map FullCalendar view types to our internal view types
        let mappedView = view;
        switch (view) {
            case 'dayGridMonth':
                mappedView = 'monthly';
                break;
            case 'timeGridWeek':
                mappedView = 'weekly';
                break;
            case 'listMonth':
                mappedView = 'list';
                break;
            default:
                mappedView = 'monthly';
        }
        
        setVisualizacao(mappedView);
    }, [visualizacao]);

    return {
        anoAtual,
        mesAtual,
        visualizacao,
        selectedCategories,
        dateRange,
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
        handleCalendarViewChange,
        refetch
    };
};

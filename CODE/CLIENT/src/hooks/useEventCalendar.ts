
import { useState, useEffect } from "react";
import { startOfMonth, endOfMonth, startOfWeek, endOfWeek, format } from "date-fns";
import { EventService, EventResponse } from "@/services/eventService";
import { Event } from "@/types/event";
import { aplicarFiltros } from "@/utils/calendarUtils";
import { calculateRecurrentEventOccurrences, CalculatedEventOccurrence } from "@/utils/recurrenceUtils";

export const useEventCalendar = () => {
    const [anoAtual, setAnoAtual] = useState(2025);
    const [mesAtual, setMesAtual] = useState(4); // Maio (0-indexed)
    const [visualizacao, setVisualizacao] = useState("grid");
    const [selectedCategories, setSelectedCategories] = useState<string[]>(['todas']);
    const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({
        from: undefined,
        to: undefined
    });
    const [rawEvents, setRawEvents] = useState<EventResponse[]>([]);
    const [calculatedEvents, setCalculatedEvents] = useState<Event[]>([]);
    const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
    const [isEventDetailsOpen, setIsEventDetailsOpen] = useState(false);

    // Apply filters to get filtered events
    const eventosFiltrados = aplicarFiltros(
        calculatedEvents,
        selectedCategories,
        dateRange.from,
        dateRange.to,
        mesAtual,
        anoAtual
    );

    // Get date range based on current view and selected month/year
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

    // Convert calculated occurrence to Event type
    const convertOccurrenceToEvent = (occurrence: CalculatedEventOccurrence): Event => {
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
    };

    // Fetch events and calculate recurrences
    const fetchEvents = async () => {
        try {
            const currentDateRange = getDateRangeForView();

            console.log('Fetching events for date range:', {
                from: currentDateRange.from,
                to: currentDateRange.to,
                month: mesAtual,
                year: anoAtual
            });

            const response = await EventService.getEvents(
                'is-coming',
                currentDateRange.from ? format(currentDateRange.from, 'yyyy-MM-dd') : undefined,
                currentDateRange.to ? format(currentDateRange.to, 'yyyy-MM-dd') : undefined
            );

            if (response) {
                console.log('Raw events from API:', response);
                setRawEvents(response);

                // Calcular ocorrências de eventos recorrentes para o mês atual
                const occurrences = calculateRecurrentEventOccurrences(
                    response,
                    currentDateRange.from!,
                    currentDateRange.to!
                );

                console.log('Calculated occurrences for month:', occurrences.length);

                // Converter para o tipo Event
                const convertedEvents = occurrences.map(convertOccurrenceToEvent);
                setCalculatedEvents(convertedEvents);
            }
        } catch (error) {
            console.error('Error fetching events:', error);
        }
    };

    // Event handlers
    const handleDateChange = (date: Date) => {
        const newMonth = date.getMonth();
        const newYear = date.getFullYear();

        console.log('Date changed:', { newMonth, newYear, oldMonth: mesAtual, oldYear: anoAtual });

        setMesAtual(newMonth);
        setAnoAtual(newYear);
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

    // Fetch events when view, month, or year changes
    useEffect(() => {
        console.log('useEffect triggered - fetching events for:', { visualizacao, mesAtual, anoAtual });
        fetchEvents();
    }, [visualizacao, mesAtual, anoAtual]);

    return {
        anoAtual,
        mesAtual,
        visualizacao,
        selectedCategories,
        dateRange,
        eventosFiltrados,
        selectedEvent,
        isEventDetailsOpen,
        handleDateChange,
        handleViewChange,
        handleRangeChange,
        handleCategoriesChange,
        handleEventClick,
        handleCloseEventDetails
    };
};

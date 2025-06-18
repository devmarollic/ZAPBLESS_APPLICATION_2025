import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { EventFormValues, RecurrenceType } from '@/types/event';
import { EventService } from '@/services/eventService';
import { MinistryService, Ministry, MinistryListResponse } from '@/services/ministryService';
import EventBasicInfoForm from '@/components/events/EventBasicInfoForm';
import EventDateTimeForm from '@/components/events/EventDateTimeForm';
import EventLocationForm from '@/components/events/EventLocationForm';
import EventRecurrenceForm from '@/components/events/EventRecurrenceForm';
import EventVisibilityForm from '@/components/events/EventVisibilityForm';
import EventFormActions from '@/components/events/EventFormActions';
import { EventType, EventTypeListResponse, EventTypeService } from '@/services/eventTypeService';

const eventFormSchema = z.object({
  title: z.string().min(3, "O título deve ter pelo menos 3 caracteres"),
  description: z.string().min(10, "A descrição deve ter pelo menos 10 caracteres"),
  date: z.date({
    required_error: "A data é obrigatória.",
  }),
  startTime: z.string().min(1, "Hora de início é obrigatória"),
  endTime: z.string().min(1, "Hora de término é obrigatória"),
  location: z.string().min(3, "O local deve ter pelo menos 3 caracteres"),
  ministry: z.string().optional(),
  isPublic: z.boolean().default(true),
  
  // Recurrence fields
  recurrence_type: z.enum(['none', 'daily', 'weekly', 'monthly', 'yearly']).default('none'),
  recurrence_interval: z.number().min(1).default(1),
  recurrence_days_of_week: z.array(z.string()).optional(),
  recurrence_day_of_month: z.union([z.number(), z.literal('last')]).optional(),
  recurrence_end_date: z.date().nullable().optional(),

  // Other fields
  otherTypeReason: z.string().optional(),
});

const EventoNovo = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [ministries, setMinistries] = useState<Ministry[]>([]);
  const [eventTypes, setEventTypes] = useState<EventType[]>([]);
  const [loadingMinistries, setLoadingMinistries] = useState(true);
  const [loadingEventTypes, setLoadingEventTypes] = useState(true);

  const form = useForm<EventFormValues>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: {
      title: '',
      description: '',
      date: new Date(),
      startTime: '19:00',
      endTime: '21:00',
      location: '',
      ministry: undefined,
      typeId: 'worship',
      otherTypeReason: '',
      isPublic: true,
      recurrence_type: 'none',
      recurrence_interval: 1,
      recurrence_days_of_week: [],
      recurrence_end_date: null,
    },
  });

  // Fetch ministries on component mount
  useEffect(() => {
    const fetchMinistries = async () => {
      try {
        setLoadingMinistries(true);
        const response = await MinistryService.getMinistries();
        if (response) {
          setMinistries(response as Ministry[]);
        } else {
          toast({
            title: "Erro ao carregar ministérios",
            description: (response as MinistryListResponse).message || "Não foi possível carregar a lista de ministérios.",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error("Error fetching ministries:", error);
        toast({
          title: "Erro ao carregar ministérios",
          description: "Não foi possível carregar a lista de ministérios.",
          variant: "destructive",
        });
      } finally {
        setLoadingMinistries(false);
      }
    };

    const fetchEventTypes = async () => {
        try {
          setLoadingEventTypes(true);
          const response = await EventTypeService.getEventTypes();
          if (response) {
            setEventTypes(response as EventType[]);
          } else {
            toast({
              title: "Erro ao carregar tipos de eventos",
              description: (response as EventTypeListResponse).message || "Não foi possível carregar a lista de tipos de eventos.",
              variant: "destructive",
            });
          }
        } catch (error) {
          console.error("Error fetching event types:", error);
          toast({
            title: "Erro ao carregar tipos de eventos",
            description: "Não foi possível carregar a lista de tipos de eventos.",
            variant: "destructive",
          });
        } finally {
          setLoadingEventTypes(false);
        }
      };

    fetchMinistries();
    fetchEventTypes();
  }, [toast]);

  // Handle day of week selection
  const toggleDaySelection = (day: string) => {
    setSelectedDays(current => 
      current.includes(day) 
        ? current.filter(d => d !== day) 
        : [...current, day]
    );
  };

  const onSubmit = async (data: EventFormValues) => {
    try {
      setIsLoading(true);
      
      // Combine date and time to create timestamps
      const startDateTime = new Date(data.date);
      const [startHours, startMinutes] = data.startTime.split(':');
      startDateTime.setHours(parseInt(startHours), parseInt(startMinutes), 0, 0);
      
      const endDateTime = new Date(data.date);
      const [endHours, endMinutes] = data.endTime.split(':');
      endDateTime.setHours(parseInt(endHours), parseInt(endMinutes), 0, 0);
      
      // Prepare event data for API
      const eventData = {
        churchId: "sample-church-id", // This should come from user context
        ministryId: data.ministry || "",
        title: data.title,
        description: data.description,
        location: {
          type: "Point" as const,
          coordinates: [0, 0] as [number, number] // This should be geocoded from the location string
        },
        typeId: "worship", // Default status
        statusId: "is-coming", // Default type or should be selected in form
        startAtTimestamp: startDateTime.toISOString(),
        endAtTimestamp: endDateTime.toISOString()
      };
      
      console.log("Event data to save:", eventData);
      
      // Call the event service
      const response = await EventService.createEvent(eventData);
      
      toast({
        title: "Evento criado",
        description: response.message || "O evento foi criado com sucesso!",
      });

      navigate('/dashboard/eventos');
    } catch (error) {
      console.error("Error creating event:", error);
      toast({
        title: "Erro ao criar evento",
        description: "Não foi possível criar o evento. Tente novamente mais tarde.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="md:container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl md:text-3xl font-bold">Novo Evento</h1>
        <Button variant="outline" onClick={() => navigate('/dashboard/eventos')}>
          Voltar para Eventos
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Informações do Evento</CardTitle>
          <CardDescription>
            Preencha todos os dados para criar um novo evento
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <EventBasicInfoForm 
                control={form.control} 
                ministries={ministries}
                eventTypes={eventTypes}
                loadingMinistries={loadingMinistries}
                loadingEventType={loadingEventTypes}
              />
              <EventDateTimeForm control={form.control} />
              <EventLocationForm control={form.control} />
              <EventRecurrenceForm 
                control={form.control} 
                watch={form.watch}
                selectedDays={selectedDays}
                toggleDaySelection={toggleDaySelection}
              />
              <EventVisibilityForm control={form.control} />
              <EventFormActions isLoading={isLoading} />
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default EventoNovo;

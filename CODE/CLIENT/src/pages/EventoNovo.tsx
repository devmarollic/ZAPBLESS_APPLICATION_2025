import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
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
import { Plus, X, Bell, Users, UserCog, Crown } from 'lucide-react';
import EventLeadersForm from '@/components/events/EventLeadersForm';

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
  recurrence_day_of_month: z.union([z.number(), z.literal('last'), z.literal('week-pattern')]).optional(),
  recurrence_end_date: z.date().nullable().optional(),
  
  // Novos campos para configurações avançadas
  recurrence_daily_times: z.array(z.string()).optional(),
  recurrence_week_of_month: z.number().optional(),
  recurrence_day_of_week: z.string().optional(),
  recurrence_yearly_pattern: z.enum(['date', 'week-pattern']).optional(),
  recurrence_month: z.number().optional(),

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
  
  // New states for advanced features
  const [enableReminders, setEnableReminders] = useState(false);
  const [selectedReminderGroups, setSelectedReminderGroups] = useState<string[]>([]);
  const [reminderText, setReminderText] = useState('');
  const [multipleEvents, setMultipleEvents] = useState([
    { date: new Date(), startTime: '19:00', endTime: '21:00' }
  ]);
  const [enableMultipleCreation, setEnableMultipleCreation] = useState(false);

  const reminderGroups = [
    { id: 'leaders', label: 'Líderes', icon: Crown },
    { id: 'vice-leaders', label: 'Vice-líderes', icon: UserCog },
    { id: 'volunteers', label: 'Voluntários', icon: Users },
    { id: 'members', label: 'Membros', icon: Users }
  ];

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
      // Novos campos
      recurrence_daily_times: [],
      recurrence_week_of_month: undefined,
      recurrence_day_of_week: undefined,
      recurrence_yearly_pattern: 'date',
      recurrence_month: undefined,
    },
  });

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

  const addEventDateTime = () => {
    setMultipleEvents([...multipleEvents, { date: new Date(), startTime: '19:00', endTime: '21:00' }]);
  };

  const removeEventDateTime = (index: number) => {
    if (multipleEvents.length > 1) {
      setMultipleEvents(multipleEvents.filter((_, i) => i !== index));
    }
  };

  const updateEventDateTime = (index: number, field: string, value: any) => {
    const updated = [...multipleEvents];
    updated[index] = { ...updated[index], [field]: value };
    setMultipleEvents(updated);
  };

  const toggleReminderGroup = (groupId: string) => {
    setSelectedReminderGroups(prev => 
      prev.includes(groupId) 
        ? prev.filter(id => id !== groupId)
        : [...prev, groupId]
    );
  };

  const generateReminderPreview = () => {
    if (!enableReminders || selectedReminderGroups.length === 0) return null;
    
    const groupLabels = selectedReminderGroups.map(id => 
      reminderGroups.find(g => g.id === id)?.label
    ).join(', ');
    
    return `Lembretes serão enviados para: ${groupLabels}`;
  };

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
      
      if (enableMultipleCreation) {
        // Create multiple events
        for (const eventItem of multipleEvents) {
          const startDateTime = new Date(eventItem.date);
          const [startHours, startMinutes] = eventItem.startTime.split(':');
          startDateTime.setHours(parseInt(startHours), parseInt(startMinutes), 0, 0);
          
          const endDateTime = new Date(eventItem.date);
          const [endHours, endMinutes] = eventItem.endTime.split(':');
          endDateTime.setHours(parseInt(endHours), parseInt(endMinutes), 0, 0);
          
          const eventData = {
            churchId: "sample-church-id", // This should come from user context
            ministryId: data.ministry || "",
            title: data.title,
            description: data.description,
            location: {
              type: "Point" as const,
              coordinates: [0, 0] as [number, number] // This should be geocoded from the location string
            },
            typeId: data.typeId || "worship",
            statusId: "is-coming", // Default status or should be selected in form
            startAtTimestamp: startDateTime.toISOString(),
            endAtTimestamp: endDateTime.toISOString(),
            isPublic: data.isPublic,
            recurrence_type: data.recurrence_type,
            recurrence_interval: data.recurrence_interval,
            recurrence_days_of_week: data.recurrence_days_of_week,
            recurrence_day_of_month: data.recurrence_day_of_month,
            recurrence_end_date: data.recurrence_end_date,
            // Novos campos de recorrência
            recurrence_daily_times: data.recurrence_daily_times,
            recurrence_week_of_month: data.recurrence_week_of_month,
            recurrence_day_of_week: data.recurrence_day_of_week,
            recurrence_yearly_pattern: data.recurrence_yearly_pattern,
            recurrence_month: data.recurrence_month,
            otherTypeReason: data.otherTypeReason,
            remindersEnabled: enableReminders,
            reminderGroups: selectedReminderGroups,
            reminderText: reminderText,
          };
          
          await EventService.createEvent(eventData);
        }
      } else {
        // Single event creation
        const startDateTime = new Date(data.date);
        const [startHours, startMinutes] = data.startTime.split(':');
        startDateTime.setHours(parseInt(startHours), parseInt(startMinutes), 0, 0);
        
        const endDateTime = new Date(data.date);
        const [endHours, endMinutes] = data.endTime.split(':');
        endDateTime.setHours(parseInt(endHours), parseInt(endMinutes), 0, 0);
        
        const eventData = {
          churchId: "sample-church-id", // This should come from user context
          ministryId: data.ministry || "",
          title: data.title,
          description: data.description,
          location: {
            type: "Point" as const,
            coordinates: [0, 0] as [number, number] // This should be geocoded from the location string
          },
          typeId: data.typeId || "worship",
          statusId: "is-coming", // Default status or should be selected in form
          startAtTimestamp: startDateTime.toISOString(),
          endAtTimestamp: endDateTime.toISOString(),
          isPublic: data.isPublic,
          recurrence_type: data.recurrence_type,
          recurrence_interval: data.recurrence_interval,
          recurrence_days_of_week: data.recurrence_days_of_week,
          recurrence_day_of_month: data.recurrence_day_of_month,
          recurrence_end_date: data.recurrence_end_date,
          // Novos campos de recorrência
          recurrence_daily_times: data.recurrence_daily_times,
          recurrence_week_of_month: data.recurrence_week_of_month,
          recurrence_day_of_week: data.recurrence_day_of_week,
          recurrence_yearly_pattern: data.recurrence_yearly_pattern,
          recurrence_month: data.recurrence_month,
          otherTypeReason: data.otherTypeReason,
          remindersEnabled: enableReminders,
          reminderGroups: selectedReminderGroups,
          reminderText: reminderText,
        };
        
        await EventService.createEvent(eventData);
      }
      
      toast({
        title: "Evento criado",
        description: "O evento foi criado com sucesso!",
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
      
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Form */}
        <div className="lg:col-span-2">
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
                  
                  {/* Multiple Events Creation */}
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="multiple-events"
                        checked={enableMultipleCreation}
                        onCheckedChange={setEnableMultipleCreation}
                      />
                      <Label htmlFor="multiple-events">Criar múltiplos eventos</Label>
                    </div>
                    
                    {enableMultipleCreation ? (
                      <div className="space-y-4 border rounded-lg p-4">
                        <div className="flex justify-between items-center">
                          <h4 className="font-medium">Datas e Horários</h4>
                          <Button
                            type="button"
                            size="sm"
                            onClick={addEventDateTime}
                            className="text-xs"
                          >
                            <Plus className="h-3 w-3 mr-1" />
                            Adicionar
                          </Button>
                        </div>
                        
                        {multipleEvents.map((event, index) => (
                          <div key={index} className="flex gap-2 items-center">
                            <input
                              type="date"
                              value={event.date.toISOString().split('T')[0]}
                              onChange={(e) => updateEventDateTime(index, 'date', new Date(e.target.value))}
                              className="flex-1 px-3 py-2 border rounded-md"
                            />
                            <input
                              type="time"
                              value={event.startTime}
                              onChange={(e) => updateEventDateTime(index, 'startTime', e.target.value)}
                              className="px-3 py-2 border rounded-md"
                            />
                            <span className="text-sm text-gray-500">às</span>
                            <input
                              type="time"
                              value={event.endTime}
                              onChange={(e) => updateEventDateTime(index, 'endTime', e.target.value)}
                              className="px-3 py-2 border rounded-md"
                            />
                            {multipleEvents.length > 1 && (
                              <Button
                                type="button"
                                size="sm"
                                variant="outline"
                                onClick={() => removeEventDateTime(index)}
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <>
                        <EventDateTimeForm control={form.control} />
                        <EventRecurrenceForm 
                          control={form.control} 
                          watch={form.watch}
                          selectedDays={selectedDays}
                          toggleDaySelection={toggleDaySelection}
                        />
                      </>
                    )}
                  </div>
                  
                  <EventLocationForm control={form.control} />
                  <EventLeadersForm control={form.control} ministries={ministries} />
                  <EventVisibilityForm control={form.control} />
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Reminders Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Bell className="mr-2 h-5 w-5" />
                Lembretes
              </CardTitle>
              <CardDescription>
                Configure lembretes automáticos para o evento
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="enable-reminders"
                  checked={enableReminders}
                  onCheckedChange={setEnableReminders}
                />
                <Label htmlFor="enable-reminders">Ativar lembretes</Label>
              </div>

              {enableReminders && (
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium mb-2 block">Enviar para:</Label>
                    <div className="space-y-2">
                      {reminderGroups.map((group) => {
                        const Icon = group.icon;
                        return (
                          <div key={group.id} className="flex items-center space-x-2">
                            <Checkbox
                              id={group.id}
                              checked={selectedReminderGroups.includes(group.id)}
                              onCheckedChange={() => toggleReminderGroup(group.id)}
                            />
                            <Label htmlFor={group.id} className="flex items-center text-sm">
                              <Icon className="h-4 w-4 mr-1" />
                              {group.label}
                            </Label>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="reminder-text" className="text-sm font-medium">
                      Texto personalizado (opcional)
                    </Label>
                    <Textarea
                      id="reminder-text"
                      placeholder="Adicione uma mensagem personalizada ao lembrete..."
                      value={reminderText}
                      onChange={(e) => setReminderText(e.target.value)}
                      className="mt-1"
                    />
                  </div>

                  {generateReminderPreview() && (
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <p className="text-sm text-blue-800">{generateReminderPreview()}</p>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Selected Ministry Info */}
          {form.watch('ministry') && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Ministério Selecionado</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-sm text-gray-600">
                    Os responsáveis pelo ministério serão automaticamente incluídos nos lembretes.
                  </p>
                  <div className="flex gap-2">
                    <Badge variant="secondary">Auto: Líderes</Badge>
                    <Badge variant="secondary">Auto: Vice-líderes</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Action Buttons */}
          <div className="space-y-2">
            <Button
              onClick={form.handleSubmit(onSubmit)}
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-zapBlue-600 to-zapPurple-600 hover:from-zapBlue-700 hover:to-zapPurple-700"
            >
              {isLoading ? "Criando..." : "Criar Evento"}
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate('/dashboard/eventos')}
              className="w-full"
            >
              Cancelar
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventoNovo;


import { useState } from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon, Repeat, Plus, X } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Control, UseFormWatch } from "react-hook-form";
import { cn } from "@/lib/utils";
import { EventFormValues, RecurrenceType } from "@/types/event";

interface EventRecurrenceFormProps {
  control: Control<EventFormValues>;
  watch: UseFormWatch<EventFormValues>;
  selectedDays: string[];
  toggleDaySelection: (day: string) => void;
}

const daysOfWeek = [
  { value: 'sunday', label: 'Domingo' },
  { value: 'monday', label: 'Segunda' },
  { value: 'tuesday', label: 'Terça' },
  { value: 'wednesday', label: 'Quarta' },
  { value: 'thursday', label: 'Quinta' },
  { value: 'friday', label: 'Sexta' },
  { value: 'saturday', label: 'Sábado' },
];

const weekNumbers = [
  { value: 1, label: '1ª semana' },
  { value: 2, label: '2ª semana' },
  { value: 3, label: '3ª semana' },
  { value: 4, label: '4ª semana' },
  { value: -1, label: 'Última semana' },
];

const months = [
  { value: 1, label: 'Janeiro' },
  { value: 2, label: 'Fevereiro' },
  { value: 3, label: 'Março' },
  { value: 4, label: 'Abril' },
  { value: 5, label: 'Maio' },
  { value: 6, label: 'Junho' },
  { value: 7, label: 'Julho' },
  { value: 8, label: 'Agosto' },
  { value: 9, label: 'Setembro' },
  { value: 10, label: 'Outubro' },
  { value: 11, label: 'Novembro' },
  { value: 12, label: 'Dezembro' },
];

const EventRecurrenceForm = ({ control, watch, selectedDays, toggleDaySelection }: EventRecurrenceFormProps) => {
  const watchRecurrenceType = watch("recurrence_type");
  const [dailyTimes, setDailyTimes] = useState<string[]>(['09:00']);
  const [yearlyDate, setYearlyDate] = useState<Date>();
  
  const addDailyTime = () => {
    setDailyTimes([...dailyTimes, '09:00']);
  };

  const removeDailyTime = (index: number) => {
    if (dailyTimes.length > 1) {
      setDailyTimes(dailyTimes.filter((_, i) => i !== index));
    }
  };

  const updateDailyTime = (index: number, time: string) => {
    const updated = [...dailyTimes];
    updated[index] = time;
    setDailyTimes(updated);
  };
  
  return (
    <div className="border-t pt-4 mt-4">
      <div className="flex items-center mb-4">
        <Repeat className="h-5 w-5 mr-2" />
        <h3 className="text-lg font-medium">Configuração de Recorrência</h3>
      </div>

      <FormField
        control={control}
        name="recurrence_type"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Tipo de Recorrência</FormLabel>
            <Select 
              onValueChange={(value: RecurrenceType) => {
                field.onChange(value);
              }} 
              value={field.value}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo de recorrência" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="none">Sem recorrência</SelectItem>
                <SelectItem value="daily">Diário</SelectItem>
                <SelectItem value="weekly">Semanal</SelectItem>
                <SelectItem value="monthly">Mensal</SelectItem>
                <SelectItem value="yearly">Anual</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      {watchRecurrenceType !== 'none' && (
        <div className="space-y-4 mt-4">
          <FormField
            control={control}
            name="recurrence_interval"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Intervalo</FormLabel>
                <div className="flex items-center gap-2">
                  <FormControl>
                    <Input 
                      type="number" 
                      min={1} 
                      max={365}
                      className="w-24" 
                      {...field} 
                      onChange={e => field.onChange(parseInt(e.target.value) || 1)}
                    />
                  </FormControl>
                  <span>
                    {watchRecurrenceType === 'daily' && "dias"}
                    {watchRecurrenceType === 'weekly' && "semanas"}
                    {watchRecurrenceType === 'monthly' && "meses"}
                    {watchRecurrenceType === 'yearly' && "anos"}
                  </span>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          {watchRecurrenceType === 'daily' && (
            <FormItem>
              <FormLabel>Horários do Dia</FormLabel>
              <div className="space-y-2">
                {dailyTimes.map((time, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Input
                      type="time"
                      value={time}
                      onChange={(e) => updateDailyTime(index, e.target.value)}
                      className="w-32"
                    />
                    {dailyTimes.length > 1 && (
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={() => removeDailyTime(index)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={addDailyTime}
                  className="mt-2"
                >
                  <Plus className="h-3 w-3 mr-1" />
                  Adicionar horário
                </Button>
              </div>
            </FormItem>
          )}

          {watchRecurrenceType === 'weekly' && (
            <FormItem>
              <FormLabel>Dias da Semana</FormLabel>
              <div className="flex flex-wrap gap-2">
                {daysOfWeek.map((day) => (
                  <div 
                    key={day.value} 
                    className={`border rounded-md p-2 cursor-pointer ${
                      selectedDays.includes(day.value) ? 'bg-black text-white' : 'bg-white'
                    }`}
                    onClick={() => toggleDaySelection(day.value)}
                  >
                    {day.label.substring(0, 2)}
                  </div>
                ))}
              </div>
            </FormItem>
          )}

          {watchRecurrenceType === 'monthly' && (
            <div className="space-y-4">
              <FormField
                control={control}
                name="recurrence_day_of_month"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Configuração Mensal</FormLabel>
                    <Select 
                      onValueChange={(value) => {
                        if (value === 'week-pattern') {
                          field.onChange('week-pattern');
                        } else if (value === 'last') {
                          field.onChange('last');
                        } else {
                          field.onChange(parseInt(value));
                        }
                      }} 
                      value={field.value?.toString() || '1'}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o padrão" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="week-pattern">Por semana específica</SelectItem>
                        {[...Array(31)].map((_, i) => (
                          <SelectItem key={i + 1} value={(i + 1).toString()}>
                            Dia {i + 1}
                          </SelectItem>
                        ))}
                        <SelectItem value="last">Último dia</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {watch("recurrence_day_of_month") === 'week-pattern' && (
                <div className="grid grid-cols-2 gap-4 p-4 border rounded-lg bg-gray-50">
                  <FormField
                    control={control}
                    name="recurrence_week_of_month"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Semana do Mês</FormLabel>
                        <Select 
                          onValueChange={(value) => field.onChange(parseInt(value))} 
                          value={field.value?.toString()}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione a semana" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {weekNumbers.map((week) => (
                              <SelectItem key={week.value} value={week.value.toString()}>
                                {week.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={control}
                    name="recurrence_day_of_week"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Dia da Semana</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione o dia" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {daysOfWeek.map((day) => (
                              <SelectItem key={day.value} value={day.value}>
                                {day.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}
            </div>
          )}

          {watchRecurrenceType === 'yearly' && (
            <div className="space-y-4">
              <FormField
                control={control}
                name="recurrence_yearly_pattern"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Configuração Anual</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      value={field.value || 'date'}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o padrão" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="date">Por data específica</SelectItem>
                        <SelectItem value="week-pattern">Por semana específica</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {watch("recurrence_yearly_pattern") === 'date' && (
                <div className="p-4 border rounded-lg bg-gray-50">
                  <FormLabel className="text-sm font-medium mb-2 block">Data Específica</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "justify-start text-left font-normal",
                          !yearlyDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {yearlyDate ? format(yearlyDate, "dd/MM") : "Selecione dia e mês"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={yearlyDate}
                        onSelect={setYearlyDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              )}

              {watch("recurrence_yearly_pattern") === 'week-pattern' && (
                <div className="grid grid-cols-3 gap-4 p-4 border rounded-lg bg-gray-50">
                  <FormField
                    control={control}
                    name="recurrence_week_of_month"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Semana</FormLabel>
                        <Select 
                          onValueChange={(value) => field.onChange(parseInt(value))} 
                          value={field.value?.toString()}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Semana" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {weekNumbers.map((week) => (
                              <SelectItem key={week.value} value={week.value.toString()}>
                                {week.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={control}
                    name="recurrence_day_of_week"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Dia da Semana</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Dia" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {daysOfWeek.map((day) => (
                              <SelectItem key={day.value} value={day.value}>
                                {day.label.substring(0, 3)}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={control}
                    name="recurrence_month"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Mês</FormLabel>
                        <Select 
                          onValueChange={(value) => field.onChange(parseInt(value))} 
                          value={field.value?.toString()}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Mês" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {months.map((month) => (
                              <SelectItem key={month.value} value={month.value.toString()}>
                                {month.label.substring(0, 3)}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}
            </div>
          )}

          <FormField
            control={control}
            name="recurrence_end_date"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Data de término (opcional)</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })
                        ) : (
                          <span>Recorrência sem fim</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value || undefined}
                      onSelect={field.onChange}
                      initialFocus
                      disabled={(date) => date < new Date()}
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      )}
    </div>
  );
};

export default EventRecurrenceForm;

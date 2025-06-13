
import { useState } from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon, Repeat } from "lucide-react";
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

const EventRecurrenceForm = ({ control, watch, selectedDays, toggleDaySelection }: EventRecurrenceFormProps) => {
  const watchRecurrenceType = watch("recurrence_type");
  
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
            <FormField
              control={control}
              name="recurrence_day_of_month"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Dia do Mês</FormLabel>
                  <Select 
                    onValueChange={(value) => {
                      if (value === 'last') {
                        field.onChange('last');
                      } else {
                        field.onChange(parseInt(value));
                      }
                    }} 
                    value={field.value?.toString() || '1'}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o dia do mês" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
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

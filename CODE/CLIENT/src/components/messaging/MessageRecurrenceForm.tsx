
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Clock, Repeat } from 'lucide-react';
import { Control } from 'react-hook-form';

interface MessageRecurrenceFormProps {
  control: Control<any>;
  isRecurring: boolean;
  recurrenceType: string;
}

const MessageRecurrenceForm = ({ control, isRecurring, recurrenceType }: MessageRecurrenceFormProps) => {
  const daysOfWeek = [
    { id: 'sunday', label: 'Domingo' },
    { id: 'monday', label: 'Segunda' },
    { id: 'tuesday', label: 'Terça' },
    { id: 'wednesday', label: 'Quarta' },
    { id: 'thursday', label: 'Quinta' },
    { id: 'friday', label: 'Sexta' },
    { id: 'saturday', label: 'Sábado' },
  ];

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center">
          <Repeat className="mr-2 h-4 w-4" />
          Recorrência da Mensagem
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <FormField
          control={control}
          name="isRecurring"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
              <div className="space-y-0.5">
                <FormLabel>Mensagem recorrente</FormLabel>
                <div className="text-sm text-muted-foreground">
                  Enviar esta mensagem automaticamente em intervalos regulares
                </div>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />

        {isRecurring && (
          <>
            <FormField
              control={control}
              name="recurrenceType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo de Recorrência</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o tipo de recorrência" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="daily">Diariamente</SelectItem>
                      <SelectItem value="weekly">Semanalmente</SelectItem>
                      <SelectItem value="monthly">Mensalmente</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={control}
                name="recurrenceInterval"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Intervalo (a cada {recurrenceType === 'daily' ? 'X dias' : recurrenceType === 'weekly' ? 'X semanas' : 'X meses'})
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="1"
                        max="30"
                        placeholder="1"
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name="recurrenceTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center">
                      <Clock className="mr-1 h-4 w-4" />
                      Horário de Envio
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="time"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {recurrenceType === 'weekly' && (
              <FormField
                control={control}
                name="recurrenceDaysOfWeek"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Dias da Semana</FormLabel>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {daysOfWeek.map((day) => (
                        <FormField
                          key={day.id}
                          control={control}
                          name="recurrenceDaysOfWeek"
                          render={({ field: checkboxField }) => (
                            <FormItem
                              key={day.id}
                              className="flex flex-row items-start space-x-3 space-y-0"
                            >
                              <FormControl>
                                <Checkbox
                                  checked={checkboxField.value?.includes(day.id) || false}
                                  onCheckedChange={(checked) => {
                                    const currentValue = checkboxField.value || [];
                                    if (checked) {
                                      checkboxField.onChange([...currentValue, day.id]);
                                    } else {
                                      checkboxField.onChange(
                                        currentValue.filter((value: string) => value !== day.id)
                                      );
                                    }
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="text-sm font-normal">
                                {day.label}
                              </FormLabel>
                            </FormItem>
                          )}
                        />
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {recurrenceType === 'monthly' && (
              <FormField
                control={control}
                name="recurrenceDayOfMonth"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Dia do Mês</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="1"
                        max="31"
                        placeholder="1"
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                      />
                    </FormControl>
                    <div className="text-sm text-muted-foreground">
                      Digite o dia do mês (1-31) em que a mensagem deve ser enviada
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <FormField
              control={control}
              name="recurrenceEndDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center">
                    <Calendar className="mr-1 h-4 w-4" />
                    Data Final (opcional)
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="date"
                      min={new Date().toISOString().split('T')[0]}
                      {...field}
                    />
                  </FormControl>
                  <div className="text-sm text-muted-foreground">
                    Deixe em branco para recorrência sem fim
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default MessageRecurrenceForm;

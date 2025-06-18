import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Control, useWatch } from "react-hook-form";
import { EventFormValues } from "@/types/event";

interface Ministry {
  id: string;
  name: string;
}

interface EventType {
  id: string;
  name: string;
}

interface EventBasicInfoFormProps {
  control: Control<EventFormValues>;
  ministries: Ministry[];
  eventTypes: EventType[];
  loadingMinistries?: boolean;
  loadingEventType?: boolean;
}

const EventBasicInfoForm = ({ control, ministries, eventTypes, loadingMinistries = false, loadingEventType = false }: EventBasicInfoFormProps) => {
  const selectedTypeId = useWatch({ control, name: "typeId" });

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Título do Evento</FormLabel>
              <FormControl>
                <Input placeholder="Digite o título do evento" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={control}
          name="ministry"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ministério (opcional)</FormLabel>
              <Select 
                onValueChange={field.onChange} 
                defaultValue={field.value}
                disabled={loadingMinistries}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder={loadingMinistries ? "Carregando..." : "Selecione um ministério"} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {ministries.map((ministry) => (
                    <SelectItem key={ministry.id} value={ministry.id}>
                      {ministry.name}
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
          name="typeId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tipo de evento</FormLabel>
              <Select 
                onValueChange={field.onChange} 
                defaultValue={field.value}
                disabled={loadingEventType}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder={loadingEventType ? "Carregando..." : "Selecione um ministério"} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {eventTypes.map((eventType) => (
                    <SelectItem key={eventType.id} value={eventType.id}>
                      {eventType.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {selectedTypeId === "other" && (
          <FormField
            control={control}
            name="otherTypeReason"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Digite o tipo de evento</FormLabel>
                <FormControl>
                  <Input placeholder="Digite o tipo de evento" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
      </div>

      <FormField
        control={control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Descrição</FormLabel>
            <FormControl>
              <Textarea 
                placeholder="Descreva os detalhes do evento" 
                className="min-h-[120px]" 
                {...field} 
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};

export default EventBasicInfoForm;

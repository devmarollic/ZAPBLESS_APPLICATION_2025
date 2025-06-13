
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Control } from "react-hook-form";
import { EventFormValues } from "@/types/event";

interface Ministry {
  id: string;
  name: string;
}

interface EventBasicInfoFormProps {
  control: Control<EventFormValues>;
  ministries: Ministry[];
  loadingMinistries?: boolean;
}

const EventBasicInfoForm = ({ control, ministries, loadingMinistries = false }: EventBasicInfoFormProps) => {
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

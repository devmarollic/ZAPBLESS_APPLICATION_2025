
import { FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { Control } from "react-hook-form";
import { EventFormValues } from "@/types/event";

interface EventVisibilityFormProps {
  control: Control<EventFormValues>;
}

const EventVisibilityForm = ({ control }: EventVisibilityFormProps) => {
  return (
    <FormField
      control={control}
      name="isPublic"
      render={({ field }) => (
        <FormItem className="flex flex-row items-start space-x-3 space-y-0 pt-4">
          <FormControl>
            <Checkbox
              checked={field.value}
              onCheckedChange={field.onChange}
            />
          </FormControl>
          <div className="space-y-1 leading-none">
            <FormLabel>Evento público (visível para todos os membros)</FormLabel>
          </div>
        </FormItem>
      )}
    />
  );
};

export default EventVisibilityForm;

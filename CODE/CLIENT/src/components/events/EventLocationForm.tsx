
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { MapPin } from "lucide-react";
import { Control } from "react-hook-form";
import { EventFormValues } from "@/types/event";

interface EventLocationFormProps {
  control: Control<EventFormValues>;
}

const EventLocationForm = ({ control }: EventLocationFormProps) => {
  return (
    <FormField
      control={control}
      name="location"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Local</FormLabel>
          <div className="flex items-center">
            <MapPin className="mr-2 h-4 w-4 text-muted-foreground" />
            <FormControl>
              <Input placeholder="Digite o local do evento" {...field} />
            </FormControl>
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default EventLocationForm;

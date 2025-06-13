
import { useState } from "react";
import { 
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerFooter,
  DrawerClose
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

export interface EventFilters {
  eventTypes: string[];
  statuses: string[];
  ministries: string[];
  notificationChannels: string[];
}

interface EventFilterDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  filters: EventFilters;
  onFiltersChange: (filters: EventFilters) => void;
}

const EventFilterDrawer = ({
  open,
  onOpenChange,
  filters,
  onFiltersChange
}: EventFilterDrawerProps) => {
  const [localFilters, setLocalFilters] = useState<EventFilters>(filters);
  
  const handleCheckboxChange = (
    category: keyof EventFilters,
    value: string,
    checked: boolean
  ) => {
    setLocalFilters(prev => {
      const categoryFilters = [...prev[category]];
      
      if (checked) {
        if (!categoryFilters.includes(value)) {
          categoryFilters.push(value);
        }
      } else {
        const index = categoryFilters.indexOf(value);
        if (index !== -1) {
          categoryFilters.splice(index, 1);
        }
      }
      
      return {
        ...prev,
        [category]: categoryFilters
      };
    });
  };

  const handleApplyFilters = () => {
    onFiltersChange(localFilters);
    onOpenChange(false);
  };
  
  const handleClearFilters = () => {
    const emptyFilters: EventFilters = {
      eventTypes: [],
      statuses: [],
      ministries: [],
      notificationChannels: []
    };
    setLocalFilters(emptyFilters);
    onFiltersChange(emptyFilters);
    onOpenChange(false);
  };
  
  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Filtros de Eventos</DrawerTitle>
        </DrawerHeader>
        
        <div className="px-4 py-2">
          <h3 className="text-sm font-medium mb-2">Tipo de Evento</h3>
          <div className="grid grid-cols-2 gap-2">
            {["culto", "reunião", "retiro", "estudo", "celebração"].map((type) => (
              <div key={`type-${type}`} className="flex items-center space-x-2">
                <Checkbox
                  id={`type-${type}`}
                  checked={localFilters.eventTypes.includes(type)}
                  onCheckedChange={(checked) => 
                    handleCheckboxChange("eventTypes", type, checked as boolean)
                  }
                />
                <Label htmlFor={`type-${type}`}>{type.charAt(0).toUpperCase() + type.slice(1)}</Label>
              </div>
            ))}
          </div>
          
          <Separator className="my-4" />
          
          <h3 className="text-sm font-medium mb-2">Status</h3>
          <div className="grid grid-cols-2 gap-2">
            {["ativo", "cancelado", "adiado"].map((status) => (
              <div key={`status-${status}`} className="flex items-center space-x-2">
                <Checkbox
                  id={`status-${status}`}
                  checked={localFilters.statuses.includes(status)}
                  onCheckedChange={(checked) => 
                    handleCheckboxChange("statuses", status, checked as boolean)
                  }
                />
                <Label htmlFor={`status-${status}`}>{status.charAt(0).toUpperCase() + status.slice(1)}</Label>
              </div>
            ))}
          </div>
          
          <Separator className="my-4" />
          
          <h3 className="text-sm font-medium mb-2">Ministério</h3>
          <div className="grid grid-cols-2 gap-2">
            {["jovens", "crianças", "louvor", "missões", "mulheres", "homens"].map((ministry) => (
              <div key={`ministry-${ministry}`} className="flex items-center space-x-2">
                <Checkbox
                  id={`ministry-${ministry}`}
                  checked={localFilters.ministries.includes(ministry)}
                  onCheckedChange={(checked) => 
                    handleCheckboxChange("ministries", ministry, checked as boolean)
                  }
                />
                <Label htmlFor={`ministry-${ministry}`}>{ministry.charAt(0).toUpperCase() + ministry.slice(1)}</Label>
              </div>
            ))}
          </div>
          
          <Separator className="my-4" />
          
          <h3 className="text-sm font-medium mb-2">Canal de Notificação</h3>
          <div className="grid grid-cols-2 gap-2">
            {["whatsapp", "email", "sms", "app"].map((channel) => (
              <div key={`channel-${channel}`} className="flex items-center space-x-2">
                <Checkbox
                  id={`channel-${channel}`}
                  checked={localFilters.notificationChannels.includes(channel)}
                  onCheckedChange={(checked) => 
                    handleCheckboxChange("notificationChannels", channel, checked as boolean)
                  }
                />
                <Label htmlFor={`channel-${channel}`}>{channel.toUpperCase()}</Label>
              </div>
            ))}
          </div>
        </div>
        
        <DrawerFooter>
          <Button onClick={handleApplyFilters}>Aplicar Filtros</Button>
          <Button variant="outline" onClick={handleClearFilters}>Limpar Filtros</Button>
          <DrawerClose asChild>
            <Button variant="ghost">Cancelar</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default EventFilterDrawer;

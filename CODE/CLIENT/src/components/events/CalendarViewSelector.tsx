
import { Calendar, CalendarDays, Filter, Grid, List } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { Badge } from "@/components/ui/badge";
import { useIsMobile, useIsTablet } from "@/hooks/use-mobile";
import EventCategoryFilter from "./EventCategoryFilter";

interface CalendarViewSelectorProps {
  activeView: string;
  onViewChange: (view: string) => void;
  selectedCategories: string[];
  onCategoriesChange: (categories: string[]) => void;
}

const CalendarViewSelector = ({
  activeView,
  onViewChange,
  selectedCategories,
  onCategoriesChange,
}: CalendarViewSelectorProps) => {
  const isMobile = useIsMobile();
  const isTablet = useIsTablet();

  return (
    <div className="flex flex-wrap gap-3 items-center">
      <div className="flex gap-2">
        <Button
          variant={activeView === "grid" ? "default" : "outline"}
          size="sm"
          onClick={() => onViewChange("grid")}
          className="gap-2"
        >
          <Grid className="h-4 w-4" />
          {!isMobile && "Mês"}
        </Button>
        
        <Button
          variant={activeView === "weekly" ? "default" : "outline"}
          size="sm"
          onClick={() => onViewChange("weekly")}
          className="gap-2"
        >
          <Calendar className="h-4 w-4" />
          {!isMobile && "Semana"}
        </Button>
        
        <Button
          variant={activeView === "list" ? "default" : "outline"}
          size="sm"
          onClick={() => onViewChange("list")}
          className="gap-2"
        >
          <List className="h-4 w-4" />
          {!isMobile && "Lista"}
        </Button>
      </div>

      {!isMobile ? (
        <EventCategoryFilter 
          selectedCategories={selectedCategories}
          onCategoriesChange={onCategoriesChange}
        />
      ) : (
        <Drawer>
          <DrawerTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2">
              <Filter className="h-4 w-4" />
              Filtros
            </Button>
          </DrawerTrigger>
          <DrawerContent>
            <div className="p-4 space-y-4">
              <h3 className="text-lg font-medium">Filtrar por categoria</h3>
              <div className="flex flex-wrap gap-2">
                {['Cultos', 'Reuniões', 'Eventos Especiais', 'Grupos'].map(categoria => (
                  <Badge 
                    key={categoria}
                    variant={selectedCategories.includes(categoria) ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => {
                      if (selectedCategories.includes(categoria)) {
                        onCategoriesChange(selectedCategories.filter(c => c !== categoria));
                      } else {
                        onCategoriesChange([...selectedCategories.filter(c => c !== 'todas'), categoria]);
                      }
                    }}
                  >
                    {categoria}
                  </Badge>
                ))}
              </div>
            </div>
          </DrawerContent>
        </Drawer>
      )}
    </div>
  );
};

export default CalendarViewSelector;

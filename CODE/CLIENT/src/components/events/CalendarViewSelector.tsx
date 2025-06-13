
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
      <div className="border rounded-md">
        <Tabs
          defaultValue={activeView}
          value={activeView}
          onValueChange={onViewChange}
          className="w-fit"
        >
          <TabsList className="grid grid-cols-5">
            <TabsTrigger value="filter" className="px-2 py-1.5">
              <Filter className="h-4 w-4" />
            </TabsTrigger>
            <TabsTrigger value="grid-large" className="px-2 py-1.5">
              <Grid className="h-4 w-4" />
            </TabsTrigger>
            <TabsTrigger value="list" className="px-2 py-1.5">
              <List className="h-4 w-4" />
            </TabsTrigger>
            <TabsTrigger value="week" className="px-2 py-1.5">
              <Calendar className="h-4 w-4" />
            </TabsTrigger>
            <TabsTrigger value="grid" className="px-2 py-1.5">
              <CalendarDays className="h-4 w-4" />
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {!isMobile ? (
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            className={`h-8 ${
              activeView === "monthly" ? "bg-black text-white" : ""
            }`}
            onClick={() => onViewChange("monthly")}
          >
            M
          </Button>
          <Button
            variant="outline"
            className={`h-8 ${
              activeView === "agenda" ? "bg-black text-white" : ""
            }`}
            onClick={() => onViewChange("agenda")}
          >
            A
          </Button>
          <Button
            variant="outline"
            className={`h-8 ${
              activeView === "weekly" ? "bg-black text-white" : ""
            }`}
            onClick={() => onViewChange("weekly")}
          >
            S
          </Button>
          
          {/* Replace the Drawer with our EventCategoryFilter component */}
          <EventCategoryFilter 
            selectedCategories={selectedCategories}
            onCategoriesChange={onCategoriesChange}
          />
        </div>
      ) : (
        <Drawer>
          <DrawerTrigger asChild>
            <Button variant="outline" className="h-8">
              Filtros <Filter className="h-4 w-4 ml-1" />
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

              <div className="pt-2">
                <h4 className="font-medium mb-2">Período</h4>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onViewChange("monthly")}
                    className={activeView === "monthly" ? "bg-black text-white" : ""}
                  >
                    M
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onViewChange("agenda")}
                    className={activeView === "agenda" ? "bg-black text-white" : ""}
                  >
                    A
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onViewChange("weekly")}
                    className={activeView === "weekly" ? "bg-black text-white" : ""}
                  >
                    S
                  </Button>
                </div>
              </div>
            </div>
          </DrawerContent>
        </Drawer>
      )}
    </div>
  );
};

export default CalendarViewSelector;

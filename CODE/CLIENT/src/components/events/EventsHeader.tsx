
import { Button } from "@/components/ui/button";
import { Plus, Repeat, Settings } from "lucide-react";
import { Link } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";

const EventsHeader = () => {
  const isMobile = useIsMobile();

  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
      <div>
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Eventos</h2>
        <p className="text-muted-foreground">Gerencie os eventos da sua igreja</p>
      </div>
      
      <div className="flex flex-wrap gap-2">
        <Button variant="outline" size="icon" className="h-9 w-9">
          <Settings className="h-4 w-4" />
        </Button>
        <Button variant="outline" asChild className="gap-2">
          <Link to="/dashboard/eventos/recorrentes">
            <Repeat className="h-4 w-4" /> {isMobile ? "" : "Recorrentes"}
          </Link>
        </Button>
        <Button asChild>
          <Link to="/dashboard/eventos/novo">
            <Plus className="mr-2 h-4 w-4" /> {isMobile ? "Adicionar" : "Adicionar evento"}
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default EventsHeader;

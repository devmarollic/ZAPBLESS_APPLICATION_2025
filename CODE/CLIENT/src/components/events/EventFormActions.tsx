
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface EventFormActionsProps {
  isLoading: boolean;
  isEditing?: boolean;
}

const EventFormActions = ({ isLoading, isEditing = false }: EventFormActionsProps) => {
  const navigate = useNavigate();
  
  return (
    <div className="flex justify-end gap-4 pt-4">
      <Button type="button" variant="outline" onClick={() => navigate('/dashboard/eventos')}>
        Cancelar
      </Button>
      <Button type="submit" disabled={isLoading}>
        {isLoading ? (
          <>Salvando...</>
        ) : (
          <>
            <Save className="mr-2 h-4 w-4" />
            {isEditing ? 'Atualizar Evento' : 'Criar Evento'}
          </>
        )}
      </Button>
    </div>
  );
};

export default EventFormActions;

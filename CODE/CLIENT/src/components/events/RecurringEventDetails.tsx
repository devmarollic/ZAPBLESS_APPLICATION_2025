
import { RecurringEvent } from '@/types/event';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface RecurringEventDetailsProps {
  event: RecurringEvent;
}

const RecurringEventDetails = ({ event }: RecurringEventDetailsProps) => {
  const formatRecurrenceDetails = (event: RecurringEvent) => {
    const { recurrence } = event;
    let details = '';
    
    switch (recurrence.type) {
      case 'daily':
        details = recurrence.interval > 1 
          ? `A cada ${recurrence.interval} dias` 
          : 'Todos os dias';
        break;
      case 'weekly':
        details = recurrence.interval > 1 
          ? `A cada ${recurrence.interval} semanas` 
          : 'Todas as semanas';
        
        if (recurrence.days_of_week && recurrence.days_of_week.length > 0) {
          const dayNames = {
            'sunday': 'domingo',
            'monday': 'segunda',
            'tuesday': 'terça',
            'wednesday': 'quarta',
            'thursday': 'quinta',
            'friday': 'sexta',
            'saturday': 'sábado'
          };
          
          const days = recurrence.days_of_week
            .map(day => dayNames[day as keyof typeof dayNames])
            .map(day => day.charAt(0).toUpperCase() + day.slice(1))
            .join(', ');
            
          details += ` nas ${days}`;
        }
        break;
      case 'monthly':
        details = recurrence.interval > 1 
          ? `A cada ${recurrence.interval} meses` 
          : 'Todos os meses';
        
        if (recurrence.day_of_month) {
          if (recurrence.day_of_month === 'last') {
            details += ' no último dia';
          } else {
            details += ` no dia ${recurrence.day_of_month}`;
          }
        }
        break;
      case 'yearly':
        details = recurrence.interval > 1 
          ? `A cada ${recurrence.interval} anos` 
          : 'Todos os anos';
        break;
    }
    
    details += ` às ${recurrence.time_of_day}`;
    
    if (recurrence.end_at) {
      details += `, até ${format(new Date(recurrence.end_at), 'dd/MM/yyyy')}`;
    }
    
    return details;
  };
  
  return (
    <div className="space-y-3 py-2">
      <div>
        <h3 className="font-medium text-sm">Nome do evento</h3>
        <p>{event.title}</p>
      </div>
      
      <div>
        <h3 className="font-medium text-sm">Descrição</h3>
        <p className="text-sm text-gray-500">{event.description}</p>
      </div>
      
      <div>
        <h3 className="font-medium text-sm">Local</h3>
        <p>{event.location}</p>
      </div>
      
      {event.ministry && (
        <div>
          <h3 className="font-medium text-sm">Ministério</h3>
          <p>{event.ministry}</p>
        </div>
      )}
      
      <div>
        <h3 className="font-medium text-sm">Recorrência</h3>
        <p>{formatRecurrenceDetails(event)}</p>
      </div>
      
      <div>
        <h3 className="font-medium text-sm">Status</h3>
        <p>{event.recurrence.paused ? 'Pausado' : 'Ativo'}</p>
      </div>
      
      <div>
        <h3 className="font-medium text-sm">Próxima ocorrência</h3>
        <p>{format(new Date(event.next_occurrence), "d 'de' MMMM 'de' yyyy", { locale: ptBR })}</p>
      </div>
    </div>
  );
};

export default RecurringEventDetails;


import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Control, useWatch } from "react-hook-form";
import { EventFormValues } from "@/types/event";
import { Plus, X, Crown, UserCog } from 'lucide-react';

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  roleSlug: string;
}

interface Ministry {
  id: string;
  name: string;
  leaders?: User[];
  viceLeaders?: User[];
}

interface EventLeadersFormProps {
  control: Control<EventFormValues>;
  ministries: Ministry[];
  leaders: string[];
  viceLeaders: string[];
  onLeadersChange: (leaders: string[]) => void;
  onViceLeadersChange: (viceLeaders: string[]) => void;
}

const EventLeadersForm = ({ 
  control, 
  ministries, 
  leaders, 
  viceLeaders, 
  onLeadersChange, 
  onViceLeadersChange 
}: EventLeadersFormProps) => {
  const selectedMinistry = useWatch({ control, name: "ministry" });
  const [availableUsers, setAvailableUsers] = useState<User[]>([]);

  // Mock users data - in real app, this would come from an API
  useEffect(() => {
    const mockUsers: User[] = [
      {
        id: '1',
        firstName: 'João',
        lastName: 'Silva',
        email: 'joao.silva@example.com',
        roleSlug: 'leader'
      },
      {
        id: '2',
        firstName: 'Maria',
        lastName: 'Santos',
        email: 'maria.santos@example.com',
        roleSlug: 'leader'
      },
      {
        id: '3',
        firstName: 'Carlos',
        lastName: 'Oliveira',
        email: 'carlos.oliveira@example.com',
        roleSlug: 'vice-leader'
      },
      {
        id: '4',
        firstName: 'Ana',
        lastName: 'Costa',
        email: 'ana.costa@example.com',
        roleSlug: 'vice-leader'
      }
    ];
    setAvailableUsers(mockUsers);
  }, []);

  // Auto-load leaders when ministry is selected
  useEffect(() => {
    if (selectedMinistry) {
      const ministry = ministries.find(m => m.id === selectedMinistry);
      if (ministry) {
        // Mock ministry leaders - in real app, this would come from the ministry data
        const ministryLeaders = availableUsers.filter(user => 
          user.roleSlug === 'leader' && Math.random() > 0.5
        );
        const ministryViceLeaders = availableUsers.filter(user => 
          user.roleSlug === 'vice-leader' && Math.random() > 0.5
        );
        
        onLeadersChange(ministryLeaders.map(l => l.id));
        onViceLeadersChange(ministryViceLeaders.map(l => l.id));
      }
    } else {
      onLeadersChange([]);
      onViceLeadersChange([]);
    }
  }, [selectedMinistry, ministries, availableUsers, onLeadersChange, onViceLeadersChange]);

  const addLeader = (userId: string) => {
    const user = availableUsers.find(u => u.id === userId);
    if (user && !leaders.includes(userId)) {
      onLeadersChange([...leaders, userId]);
    }
  };

  const removeLeader = (userId: string) => {
    onLeadersChange(leaders.filter(l => l !== userId));
  };

  const addViceLeader = (userId: string) => {
    const user = availableUsers.find(u => u.id === userId);
    if (user && !viceLeaders.includes(userId)) {
      onViceLeadersChange([...viceLeaders, userId]);
    }
  };

  const removeViceLeader = (userId: string) => {
    onViceLeadersChange(viceLeaders.filter(l => l !== userId));
  };

  const getAvailableLeaders = () => {
    return availableUsers.filter(user => 
      user.roleSlug === 'leader' && !leaders.includes(user.id)
    );
  };

  const getAvailableViceLeaders = () => {
    return availableUsers.filter(user => 
      user.roleSlug === 'vice-leader' && !viceLeaders.includes(user.id)
    );
  };

  const getLeaderById = (id: string) => {
    return availableUsers.find(user => user.id === id);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div>
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-medium flex items-center">
              <Crown className="h-4 w-4 mr-2 text-yellow-600" />
              Líderes do Evento
            </h4>
            <Select onValueChange={addLeader}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Adicionar líder" />
              </SelectTrigger>
              <SelectContent>
                {getAvailableLeaders().map((user) => (
                  <SelectItem key={user.id} value={user.id}>
                    {user.firstName} {user.lastName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {leaders.map((leaderId) => {
              const leader = getLeaderById(leaderId);
              if (!leader) return null;
              
              return (
                <Badge key={leaderId} variant="secondary" className="flex items-center gap-1">
                  <Crown className="h-3 w-3" />
                  {leader.firstName} {leader.lastName}
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-4 w-4 p-0 ml-1"
                    onClick={() => removeLeader(leaderId)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              );
            })}
            {leaders.length === 0 && (
              <p className="text-sm text-muted-foreground">Nenhum líder selecionado</p>
            )}
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-medium flex items-center">
              <UserCog className="h-4 w-4 mr-2 text-blue-600" />
              Vice-Líderes do Evento
            </h4>
            <Select onValueChange={addViceLeader}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Adicionar vice-líder" />
              </SelectTrigger>
              <SelectContent>
                {getAvailableViceLeaders().map((user) => (
                  <SelectItem key={user.id} value={user.id}>
                    {user.firstName} {user.lastName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {viceLeaders.map((viceLeaderId) => {
              const viceLeader = getLeaderById(viceLeaderId);
              if (!viceLeader) return null;
              
              return (
                <Badge key={viceLeaderId} variant="outline" className="flex items-center gap-1">
                  <UserCog className="h-3 w-3" />
                  {viceLeader.firstName} {viceLeader.lastName}
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-4 w-4 p-0 ml-1"
                    onClick={() => removeViceLeader(viceLeaderId)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              );
            })}
            {viceLeaders.length === 0 && (
              <p className="text-sm text-muted-foreground">Nenhum vice-líder selecionado</p>
            )}
          </div>
        </div>
      </div>

      {selectedMinistry && (
        <div className="p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>Ministério selecionado:</strong> Os líderes e vice-líderes foram carregados automaticamente. 
            Você pode adicionar ou remover conforme necessário para este evento específico.
          </p>
        </div>
      )}
    </div>
  );
};

export default EventLeadersForm;

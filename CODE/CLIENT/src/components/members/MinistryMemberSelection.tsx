
import { FormLabel } from '@/components/ui/form';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { X, Plus, Users, UserCheck } from 'lucide-react';

interface Member {
  id: string;
  legalName: string;
  email: string;
  phoneNumber: string;
}

interface MemberMembership {
  memberId: string;
  role: string;
}

const memberRoles = [
  { value: "member", label: "Membro", icon: Users },
  { value: "volunteer", label: "Voluntário", icon: UserCheck },
];

interface MinistryMemberSelectionProps {
  members: Member[] | undefined;
  isLoadingMembers: boolean;
  memberMemberships: MemberMembership[];
  onMemberToggle: (memberId: string, checked: boolean, role: string) => void;
  onUpdateMembership: (memberId: string, field: 'role', value: string) => void;
}

const MinistryMemberSelection = ({
  members,
  isLoadingMembers,
  memberMemberships,
  onMemberToggle,
  onUpdateMembership
}: MinistryMemberSelectionProps) => {
  const getAvailableMembers = () => {
    return (members ?? []).filter(
      member => !memberMemberships.some(m => m.memberId === member.id)
    );
  };

  const handleAddMember = (memberId: string, role: string) => {
    onMemberToggle(memberId, true, role);
  };

  const handleRemoveMember = (memberId: string) => {
    onMemberToggle(memberId, false, 'member');
  };

  const getMembersByRole = (role: string) => {
    return memberMemberships.filter(m => m.role === role);
  };

  if (isLoadingMembers) {
    return (
      <div>
        <FormLabel>Membros do Ministério</FormLabel>
        <p className="text-sm text-muted-foreground mt-2">Carregando membros...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <FormLabel>Membros do Ministério</FormLabel>
      
      {memberRoles.map((roleConfig) => {
        const roleMembers = getMembersByRole(roleConfig.value);
        const IconComponent = roleConfig.icon;
        
        return (
          <div key={roleConfig.value} className="border rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium flex items-center gap-2">
                <IconComponent className="h-4 w-4" />
                {roleConfig.label}s ({roleMembers.length})
              </h4>
              <Select onValueChange={(memberId) => handleAddMember(memberId, roleConfig.value)}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder={`Adicionar ${roleConfig.label.toLowerCase()}`} />
                </SelectTrigger>
                <SelectContent>
                  {getAvailableMembers().map((member) => (
                    <SelectItem key={member.id} value={member.id}>
                      <div className="flex items-center gap-2">
                        <Plus className="h-3 w-3" />
                        {member.legalName}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {roleMembers.map((membership) => {
                const member = members?.find(m => m.id === membership.memberId);
                if (!member) return null;
                
                return (
                  <Badge key={membership.memberId} variant="secondary" className="flex items-center gap-1">
                    <IconComponent className="h-3 w-3" />
                    {member.legalName}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveMember(membership.memberId)}
                      className="h-4 w-4 p-0 ml-1 hover:bg-destructive hover:text-destructive-foreground"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                );
              })}
              {roleMembers.length === 0 && (
                <p className="text-xs text-muted-foreground">
                  Nenhum {roleConfig.label.toLowerCase()} selecionado
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default MinistryMemberSelection;

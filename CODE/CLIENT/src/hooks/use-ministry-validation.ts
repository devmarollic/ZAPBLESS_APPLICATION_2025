import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

interface MemberMembership {
  memberId: string;
  role: string;
}

interface UseMinistryValidationProps {
  memberMemberships: MemberMembership[];
  contacts: any[] | undefined;
}

export const useMinistryValidation = ({ memberMemberships, contacts }: UseMinistryValidationProps) => {
  const { toast } = useToast();
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  const validateMemberAddition = (memberId: string, role: string): boolean => {
    // Check if member is already in the ministry
    const isAlreadyMember = memberMemberships.some(m => m.memberId === memberId);
    
    if (isAlreadyMember) {
      const existingMembership = memberMemberships.find(m => m.memberId === memberId);
      const contact = contacts?.find(c => c.id === memberId);
      const roleLabel = existingMembership?.role === 'member' ? 'Membro' : 'Voluntário';
      
      const errorMessage = `O contato "${contact?.name}" já é membro deste ministério com o papel de "${roleLabel}".`;
      
      toast({
        title: "Contato já é membro",
        description: errorMessage,
        variant: "destructive",
      });
      
      setValidationErrors(prev => [...prev, errorMessage]);
      return false;
    }
    
    return true;
  };

  const validateMinistryData = (data: any): boolean => {
    const errors: string[] = [];
    
    // Check for duplicate members
    const memberIds = memberMemberships.map(m => m.memberId);
    const duplicateIds = memberIds.filter((id, index) => memberIds.indexOf(id) !== index);
    
    if (duplicateIds.length > 0) {
      const duplicateContacts = duplicateIds.map(id => {
        const contact = contacts?.find(c => c.id === id);
        return contact?.name || id;
      });
      
      errors.push(`Contatos duplicados encontrados: ${duplicateContacts.join(', ')}`);
    }
    
    // Check if leader and vice leader are the same person
    if (data.leaderId && data.viceLeaderId && data.leaderId === data.viceLeaderId && data.leaderId !== 'none') {
      const contact = contacts?.find(c => c.id === data.leaderId);
      errors.push(`Líder e vice-líder não podem ser a mesma pessoa: ${contact?.name}`);
    }
    
    // Check if leader or vice leader are also members
    if (data.leaderId && data.leaderId !== 'none') {
      const isLeaderAlsoMember = memberMemberships.some(m => m.memberId === data.leaderId);
      if (!isLeaderAlsoMember) {
        const contact = contacts?.find(c => c.id === data.leaderId);
        errors.push(`O líder "${contact?.name}" deve ser adicionado como membro do ministério`);
      }
    }
    
    if (data.viceLeaderId && data.viceLeaderId !== 'none') {
      const isViceLeaderAlsoMember = memberMemberships.some(m => m.memberId === data.viceLeaderId);
      if (!isViceLeaderAlsoMember) {
        const contact = contacts?.find(c => c.id === data.viceLeaderId);
        errors.push(`O vice-líder "${contact?.name}" deve ser adicionado como membro do ministério`);
      }
    }
    
    if (errors.length > 0) {
      setValidationErrors(errors);
      errors.forEach(error => {
        toast({
          title: "Erro de validação",
          description: error,
          variant: "destructive",
        });
      });
      return false;
    }
    
    setValidationErrors([]);
    return true;
  };

  const clearValidationErrors = () => {
    setValidationErrors([]);
  };

  return {
    validateMemberAddition,
    validateMinistryData,
    validationErrors,
    clearValidationErrors,
  };
}; 
import { useState, useMemo } from 'react';
import { FormLabel } from '@/components/ui/form';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { X, Plus, Users, UserCheck, Search } from 'lucide-react';
import { Contact } from '@/services/contactService';
import ContactDetails from './ContactDetails';
import VirtualizedSelect from '@/components/ui/virtualized-select';
import LoadingSpinner from '@/components/ui/loading-spinner';

interface MemberMembership {
    memberId: string;
    role: string;
}

const memberRoles = [
    { value: "leader", label: "Líder", icon: Users, variant: "default" as const },
    { value: "vice-leader", label: "Vice-Líder", icon: UserCheck, variant: "secondary" as const },
    { value: "member", label: "Membro", icon: Users, variant: "outline" as const },
    { value: "volunteer", label: "Voluntário", icon: UserCheck, variant: "outline" as const },
];

interface ContactSelectionProps {
    contacts: Contact[] | undefined;
    isLoadingContacts: boolean;
    memberMemberships: MemberMembership[];
    onMemberToggle: (memberId: string, checked: boolean, role: string) => void;
    onUpdateMembership: (memberId: string, field: 'role', value: string) => void;
}

const ContactSelection = ({
    contacts,
    isLoadingContacts,
    memberMemberships,
    onMemberToggle,
    onUpdateMembership
}: ContactSelectionProps) => {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredContacts = useMemo(() => {
        if (!contacts) return [];

        return contacts.filter(contact =>
            contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            contact.notify.toLowerCase().includes(searchTerm.toLowerCase()) ||
            contact.verifiedName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            contact.number.includes(searchTerm) ||
            (contact.ecclesiasticalTitle && contact.ecclesiasticalTitle.toLowerCase().includes(searchTerm.toLowerCase()))
        );
    }, [contacts, searchTerm]);

      const getAvailableContacts = () => {
    return filteredContacts.filter(
      contact => !memberMemberships.some(m => m.memberId === contact.id)
    );
  };

    const getContactRoleLabel = (role: string) => {
        const roleConfig = memberRoles.find(r => r.value === role);
        return roleConfig ? roleConfig.label : 'Membro';
    };

    const handleAddContact = (contactId: string, role: string) => {
        onMemberToggle(contactId, true, role);
    };

    const handleRemoveContact = (contactId: string) => {
        // Don't allow removing leaders or vice-leaders directly from the member list
        // They should be removed by changing the leader/vice-leader selection
        const membership = memberMemberships.find(m => m.memberId === contactId);
        if (membership?.role === 'leader' || membership?.role === 'vice-leader') {
            return;
        }
        
        onMemberToggle(contactId, false, 'member');
    };

    const getContactsByRole = (role: string) => {
        return memberMemberships.filter(m => m.role === role);
    };

    if (isLoadingContacts) {
        return (
            <div>
                <FormLabel>Contatos do Ministério</FormLabel>
                <div className="mt-4">
                    <LoadingSpinner text="Carregando contatos..." />
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <FormLabel>Contatos do Ministério</FormLabel>

            <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                    placeholder="Buscar contatos por nome, telefone ou título..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                />
            </div>

            {memberRoles.map((roleConfig) => {
                const roleContacts = getContactsByRole(roleConfig.value);
                const IconComponent = roleConfig.icon;

                return (
                    <div key={roleConfig.value} className="border rounded-lg p-4 space-y-3">
                        <div className="flex items-center justify-between">
                            <h4 className="text-sm font-medium flex items-center gap-2">
                                <IconComponent className="h-4 w-4" />
                                {roleConfig.label}s ({roleContacts.length})
                            </h4>
                            {getAvailableContacts().length > 0 ? (
                                <VirtualizedSelect
                                    value=""
                                    onValueChange={(contactId) => handleAddContact(contactId, roleConfig.value)}
                                    placeholder={`Adicionar ${roleConfig.label.toLowerCase()}`}
                                    options={getAvailableContacts().map((contact) => ({
                                        value: contact.id,
                                        label: contact.name || '',
                                        subtitle: contact.ecclesiasticalTitle
                                    }))}
                                    searchPlaceholder={`Buscar ${roleConfig.label.toLowerCase()}...`}
                                />
                                          ) : (
                <div className="text-sm text-muted-foreground px-3 py-2">
                  Todos os contatos já são membros
                </div>
              )}
                        </div>

                        <div className="flex flex-wrap gap-2">
                            {roleContacts.map((membership) => {
                                const contact = contacts?.find(c => c.id === membership.memberId);
                                if (!contact) return null;

                                const isLeaderOrViceLeader = membership.role === 'leader' || membership.role === 'vice-leader';
                                
                                return (
                                    <Badge key={membership.memberId} variant={roleConfig.variant} className="flex items-center gap-1">
                                        <IconComponent className="h-3 w-3" />
                                        <ContactDetails contact={contact} />
                                        {!isLeaderOrViceLeader && (
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleRemoveContact(membership.memberId)}
                                                className="h-4 w-4 p-0 ml-1 hover:bg-destructive hover:text-destructive-foreground"
                                            >
                                                <X className="h-3 w-3" />
                                            </Button>
                                        )}
                                    </Badge>
                                );
                            })}
                            {roleContacts.length === 0 && (
                                <p className="text-xs text-muted-foreground">
                                    Nenhum {roleConfig.label.toLowerCase()} selecionado
                                </p>
                            )}
                            {(roleConfig.value === 'leader' || roleConfig.value === 'vice-leader') && roleContacts.length > 0 && (
                                <p className="text-xs text-muted-foreground">
                                    {roleConfig.label}s são gerenciados através da seleção acima
                                </p>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default ContactSelection; 
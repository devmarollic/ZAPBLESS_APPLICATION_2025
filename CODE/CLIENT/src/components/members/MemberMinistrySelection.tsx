
import { FormLabel } from '@/components/ui/form';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { X, Plus } from 'lucide-react';
import { Ministry } from '@/services/ministryService';

const ministryRoles = [
    { value: "member", label: "Membro" },
    { value: "leader", label: "Líder" },
    { value: "vice-leader", label: "Vice-líder" },
    { value: "volunteer", label: "Voluntário" },
];

interface MinistryMembership {
    ministryId: string;
    role: string;
}

interface MemberMinistrySelectionProps {
    ministries: Ministry[] | undefined;
    isLoadingMinistries: boolean;
    ministryMemberships: MinistryMembership[];
    onMinistryToggle: ( ministryId: string, checked: boolean ) => void;
    onUpdateMembership: ( ministryId: string, field: 'role', value: string ) => void;
}

const MemberMinistrySelection = (
    {
        ministries,
        isLoadingMinistries,
        ministryMemberships,
        onMinistryToggle,
        onUpdateMembership
    }: MemberMinistrySelectionProps
) => {
    const availableMinistries = ( ministries ?? [] ).filter(
        ministry => !ministryMemberships.some( m => m.ministryId === ministry.id )
    );

    const handleAddMinistry = ( ministryId: string ) => {
        onMinistryToggle( ministryId, true );
    };

    const handleRemoveMinistry = ( ministryId: string ) => {
        onMinistryToggle( ministryId, false );
    };

    return (
        <div>
            <FormLabel>Ministérios</FormLabel>
            <div className="mt-2 space-y-4">
                {/* Selected Ministries */}
                {ministryMemberships.length > 0 && (
                    <div className="space-y-2">
                        <h4 className="text-sm font-medium text-muted-foreground">Ministérios Selecionados</h4>
                        <div className="space-y-2">
                            {ministryMemberships.map( ( membership ) => {
                                const ministry = ministries?.find( m => m.id === membership.ministryId );
                                if ( !ministry ) return null;
                                
                                return (
                                    <div key={ministry.id} className="flex items-center gap-2 p-2 border rounded-lg bg-muted/30">
                                        <Badge variant="secondary" className="flex-1">
                                            {ministry.name}
                                        </Badge>
                                        <Select
                                            value={membership.role || "member"}
                                            onValueChange={( value ) => onUpdateMembership( ministry.id, 'role', value )}
                                        >
                                            <SelectTrigger className="w-32 h-7">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {ministryRoles.map( ( role ) => (
                                                    <SelectItem key={role.value} value={role.value}>
                                                        {role.label}
                                                    </SelectItem>
                                                ) )}
                                            </SelectContent>
                                        </Select>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handleRemoveMinistry( ministry.id )}
                                            className="h-7 w-7 p-0"
                                        >
                                            <X className="h-3 w-3" />
                                        </Button>
                                    </div>
                                );
                            } )}
                        </div>
                    </div>
                )}

                {/* Add Ministry */}
                {isLoadingMinistries ? (
                    <p className="text-sm text-muted-foreground">Carregando ministérios...</p>
                ) : availableMinistries.length > 0 ? (
                    <div className="space-y-2">
                        <h4 className="text-sm font-medium text-muted-foreground">Adicionar Ministério</h4>
                        <Select onValueChange={handleAddMinistry}>
                            <SelectTrigger>
                                <SelectValue placeholder="Selecione um ministério para adicionar" />
                            </SelectTrigger>
                            <SelectContent>
                                {availableMinistries.map( ( ministry ) => (
                                    <SelectItem key={ministry.id} value={ministry.id}>
                                        <div className="flex items-center gap-2">
                                            <Plus className="h-4 w-4" />
                                            {ministry.name}
                                        </div>
                                    </SelectItem>
                                ) )}
                            </SelectContent>
                        </Select>
                    </div>
                ) : (
                    ministryMemberships.length > 0 && (
                        <p className="text-sm text-muted-foreground">
                            Todos os ministérios disponíveis foram selecionados.
                        </p>
                    )
                )}
            </div>
        </div>
    );
};

export default MemberMinistrySelection;

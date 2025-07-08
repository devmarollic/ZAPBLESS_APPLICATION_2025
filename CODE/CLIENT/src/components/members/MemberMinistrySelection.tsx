
import { FormLabel } from '@/components/ui/form';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { X, Plus, Trash2 } from 'lucide-react';
import { Ministry } from '@/services/ministryService';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';

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
    onRemoveMinistry: ( ministryId: string ) => Promise<void>;
    onUpdateRole: ( ministryId: string, role: string ) => Promise<void>;
}

const MemberMinistrySelection = (
    {
        ministries,
        isLoadingMinistries,
        ministryMemberships,
        onMinistryToggle,
        onUpdateMembership,
        onRemoveMinistry,
        onUpdateRole
    }: MemberMinistrySelectionProps
) => {
    const { toast } = useToast();
    const [isRemovingMinistry, setIsRemovingMinistry] = useState( false );
    const [ministryToRemove, setMinistryToRemove] = useState<{ id: string; name: string } | null>( null );
    const [updatingRoles, setUpdatingRoles] = useState<{ [ministryId: string]: boolean }>( {} );

    const availableMinistries = ( ministries ?? [] ).filter(
        ministry => !ministryMemberships.some( m => m.ministryId === ministry.id )
    );

    const handleAddMinistry = ( ministryId: string ) => {
        // Additional validation to prevent adding duplicate ministries
        const isAlreadyMember = ministryMemberships.some( m => m.ministryId === ministryId );
        if ( isAlreadyMember )
        {
            toast(
                {
                    title: "Aviso",
                    description: "Este membro já faz parte deste ministério.",
                    variant: "destructive",
                }
                );
            return;
        }
        
        onMinistryToggle( ministryId, true );
    };

    const handleRemoveMinistry = ( ministryId: string ) => {
        onMinistryToggle( ministryId, false );
    };

    const handleConfirmRemoveMinistry = async () => {
        if ( !ministryToRemove ) return;

        try
        {
            setIsRemovingMinistry( true );
            await onRemoveMinistry( ministryToRemove.id );
            setMinistryToRemove( null );
        }
        catch ( error )
        {
            console.error( 'Erro ao remover ministério:', error );
        }
        finally
        {
            setIsRemovingMinistry( false );
        }
    };

    const handleRoleChange = async ( ministryId: string, newRole: string ) => {
        try
        {
            setUpdatingRoles( prev => ( { ...prev, [ministryId]: true } ) );
            await onUpdateRole( ministryId, newRole );
            
            // Update local state
            onUpdateMembership( ministryId, 'role', newRole );
            
            toast(
                {
                    title: "Sucesso",
                    description: "Função atualizada com sucesso!",
                }
                );
        }
        catch ( error )
        {
            console.error( 'Erro ao atualizar função:', error );
            toast(
                {
                    title: "Erro",
                    description: "Não foi possível atualizar a função. Tente novamente.",
                    variant: "destructive",
                }
                );
        }
        finally
        {
            setUpdatingRoles( prev => ( { ...prev, [ministryId]: false } ) );
        }
    };

    const openRemoveDialog = ( ministry: Ministry ) => {
        setMinistryToRemove( { id: ministry.id, name: ministry.name } );
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
                                
                                const isUpdatingRole = updatingRoles[ministry.id];
                                
                                return (
                                    <div key={ministry.id} className="flex items-center gap-2 p-2 border rounded-lg bg-muted/30">
                                        <Badge variant="secondary" className="flex-1">
                                            {ministry.name}
                                        </Badge>
                                        <Select
                                            value={membership.role || "member"}
                                            onValueChange={( value ) => handleRoleChange( ministry.id, value )}
                                            disabled={isUpdatingRole}
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
                                        
                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => openRemoveDialog( ministry )}
                                                    className="h-7 w-7 p-0 text-destructive hover:text-destructive"
                                                    disabled={isUpdatingRole}
                                                >
                                                    <Trash2 className="h-3 w-3" />
                                                </Button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent>
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle>Remover do Ministério</AlertDialogTitle>
                                                    <AlertDialogDescription>
                                                        Tem certeza que deseja remover este membro do ministério <strong>{ministry.name}</strong>?
                                                        <br />
                                                        <br />
                                                        Esta ação não pode ser desfeita.
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                                    <AlertDialogAction
                                                        onClick={handleConfirmRemoveMinistry}
                                                        disabled={isRemovingMinistry}
                                                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                                    >
                                                        {isRemovingMinistry ? "Removendo..." : "Remover"}
                                                    </AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
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
                    <div className="space-y-2">
                        <h4 className="text-sm font-medium text-muted-foreground">Adicionar Ministério</h4>
                        <p className="text-sm text-muted-foreground">
                            {ministryMemberships.length > 0 
                                ? "Todos os ministérios disponíveis foram selecionados."
                                : "Nenhum ministério disponível para adicionar."
                            }
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MemberMinistrySelection;

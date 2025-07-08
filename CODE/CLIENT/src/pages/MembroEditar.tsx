
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { ContactService, Contact, UpdateContactRequest } from "@/services/contactService";
import { MinistryService, Ministry } from "@/services/ministryService";
import MemberDeleteDialog from "@/components/members/MemberDeleteDialog";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import MemberMinistrySelection from "@/components/members/MemberMinistrySelection";
import { AuthenticationService } from "@/lib/authentication_service";
import { useQuery } from "@tanstack/react-query";

const memberSchema = z.object(
    {
        name: z.string().min( 3, "O nome deve ter pelo menos 3 caracteres" ),
        number: z.string().min( 10, "O telefone deve ter pelo menos 10 dígitos" ),
        ecclesiasticalTitle: z.string().optional(),
    }
    );

type MemberFormValues = z.infer<typeof memberSchema>;

const ecclesiasticalTitles = [
    { value: null, label: "Nenhum" },
    { value: "pastor", label: "Pastor" },
    { value: "reverend", label: "Reverendo" },
    { value: "elder", label: "Presbítero" },
    { value: "deacon", label: "Diácono" },
    { value: "missionary", label: "Missionário" },
    { value: "evangelist", label: "Evangelista" },
];

const MembroEditar = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState( false );
    const [isDeleting, setIsDeleting] = useState( false );
    const [loading, setLoading] = useState( true );
    const [contact, setContact] = useState<Contact | null>( null );
    const [currentMinistryMemberships, setCurrentMinistryMemberships] = useState<Array<{ ministryId: string; role: string }>>( [] );
    const [updatedMinistryMemberships, setUpdatedMinistryMemberships] = useState<Array<{ ministryId: string; role: string }>>( [] );

    const churchId = AuthenticationService.getChurchId();

    const { data: ministries, isLoading: isLoadingMinistries } = useQuery(
        {
            queryKey: ['ministries', churchId],
            queryFn: async () => {
                if ( !churchId ) throw new Error( "Church ID not found" );
                return await MinistryService.getMinistriesByChurch( churchId );
            },
            enabled: !!churchId
        }
        );

    const form = useForm<MemberFormValues>(
        {
            resolver: zodResolver( memberSchema ),
            defaultValues: {
                name: "",
                number: "",
                ecclesiasticalTitle: "",
            },
        }
        );

    useEffect(
        () => {
            if ( id )
            {
                loadContact();
            }
        },
        [id]
        );

    const loadContact = async () => {
        if ( !id ) return;

        try
        {
            setLoading( true );
            const contactData = await ContactService.getContactById( id );
            setContact( contactData );

            // Preencher o formulário com os dados do contato
            form.reset(
                {
                    name: contactData.name,
                    number: contactData.number,
                    ecclesiasticalTitle: contactData.ecclesiasticalTitle || "",
                }
                );

            // Carregar ministérios atuais do membro
            const contactMinistries = await ContactService.getContactMinistries( id );
            const currentMemberships = contactMinistries.map( ministry => ( {
                ministryId: ministry.id,
                role: ministry.roleSlug
            } ) );
            setCurrentMinistryMemberships( currentMemberships );
            setUpdatedMinistryMemberships( currentMemberships );
        }
        catch ( error )
        {
            console.error( 'Erro ao carregar contato:', error );
            toast(
                {
                    title: "Erro",
                    description: "Não foi possível carregar o contato.",
                    variant: "destructive",
                }
                );
            navigate( "/dashboard/membros" );
        }
        finally
        {
            setLoading( false );
        }
    };

    const onSubmit = async ( data: MemberFormValues ) => {
        if ( !id ) return;

        try
        {
            setIsSubmitting( true );

            const updateData: UpdateContactRequest = {
                name: data.name,
                number: data.number,
                ecclesiasticalTitle: data.ecclesiasticalTitle || undefined,
            };

            await ContactService.updateContact( id, updateData );

            // Atualizar associações de ministério
            await updateMinistryMemberships();

            toast(
                {
                    title: "Sucesso",
                    description: "Membro atualizado com sucesso!",
                }
                );

            navigate( "/dashboard/membros" );
        }
        catch ( error )
        {
            console.error( 'Erro ao atualizar membro:', error );
            toast(
                {
                    title: "Erro",
                    description: "Não foi possível atualizar o membro. Tente novamente.",
                    variant: "destructive",
                }
                );
        }
        finally
        {
            setIsSubmitting( false );
        }
    };

    const updateMinistryMemberships = async () => {
        if ( !id ) return;

        // Remover membros de ministérios que não estão mais na lista atualizada
        for ( const currentMembership of currentMinistryMemberships )
        {
            const isStillMember = updatedMinistryMemberships.some(
                membership => membership.ministryId === currentMembership.ministryId
            );
            
            if ( !isStillMember )
            {
                await MinistryService.removeMemberFromMinistry( currentMembership.ministryId, id );
            }
        }

        // Adicionar novos membros e atualizar roles existentes
        for ( const updatedMembership of updatedMinistryMemberships )
        {
            const existingMembership = currentMinistryMemberships.find(
                membership => membership.ministryId === updatedMembership.ministryId
            );

            if ( !existingMembership )
            {
                // Novo membro
                await MinistryService.addMemberToMinistry( updatedMembership.ministryId, {
                    contactId: id,
                    roleSlug: updatedMembership.role
                } );
            }
            else if ( existingMembership.role !== updatedMembership.role )
            {
                // Role alterada - remover e adicionar novamente
                await MinistryService.removeMemberFromMinistry( updatedMembership.ministryId, id );
                await MinistryService.addMemberToMinistry( updatedMembership.ministryId, {
                    contactId: id,
                    roleSlug: updatedMembership.role
                } );
            }
        }
    };

    const handleDelete = async () => {
        if ( !id ) return;

        try
        {
            setIsDeleting( true );
            await ContactService.deleteContact( id );

            toast(
                {
                    title: "Sucesso",
                    description: "Membro excluído com sucesso!",
                }
                );

            navigate( "/dashboard/membros" );
        }
        catch ( error )
        {
            console.error( 'Erro ao excluir membro:', error );
            toast(
                {
                    title: "Erro",
                    description: "Não foi possível excluir o membro. Tente novamente.",
                    variant: "destructive",
                }
                );
        }
        finally
        {
            setIsDeleting( false );
        }
    };

    if ( loading )
    {
        return (
            <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin" />
                <span className="ml-2">Carregando membro...</span>
            </div>
            );
    }

    if ( !contact )
    {
        return (
            <div className="text-center py-8">
                <p className="text-muted-foreground">Membro não encontrado.</p>
                <Button onClick={() => navigate( "/dashboard/membros" )} className="mt-4">
                    Voltar para Membros
                </Button>
            </div>
            );
    }

    const handleMinistryToggle = ( ministryId: string, checked: boolean ) => {
        if ( checked )
        {
            setUpdatedMinistryMemberships( current => [
                ...current,
                { ministryId, role: "member" }
            ] );
        }
        else
        {
            setUpdatedMinistryMemberships( current =>
                current.filter( membership => membership.ministryId !== ministryId )
            );
        }
    };

    const updateMinistryMembership = ( ministryId: string, field: 'role', value: string ) => {
        setUpdatedMinistryMemberships( current =>
            current.map( membership =>
                membership.ministryId === ministryId
                    ? { ...membership, [field]: value }
                    : membership
            )
        );
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => navigate( "/dashboard/membros" )}
                >
                    <ArrowLeft className="h-4 w-4" />
                </Button>
                <div>
                    <h2 className="text-3xl font-bold tracking-tight gradientText">Editar Membro</h2>
                    <p className="text-muted-foreground">Edite as informações do membro</p>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Informações do Membro</CardTitle>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit( onSubmit )} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Nome completo*</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Digite o nome completo" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="number"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Telefone / WhatsApp*</FormLabel>
                                            <FormControl>
                                                <Input placeholder="(00) 00000-0000" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <FormField
                                control={form.control}
                                name="ecclesiasticalTitle"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Título Eclesiástico</FormLabel>
                                        <Select onValueChange={field.onChange} value={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Selecione um título" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {ecclesiasticalTitles.map( ( title ) => (
                                                    <SelectItem key={title.value} value={title.value}>
                                                        {title.label}
                                                    </SelectItem>
                                                ) )}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <MemberMinistrySelection
                                ministries={ministries}
                                isLoadingMinistries={isLoadingMinistries}
                                ministryMemberships={updatedMinistryMemberships}
                                onMinistryToggle={handleMinistryToggle}
                                onUpdateMembership={updateMinistryMembership}
                            />

                            <div className="flex justify-between gap-4 pt-4">
                                <MemberDeleteDialog
                                    isDeleting={isDeleting}
                                    onDelete={handleDelete}
                                />

                                <div className="flex gap-4">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => navigate( "/dashboard/membros" )}
                                        disabled={isSubmitting}
                                    >
                                        Cancelar
                                    </Button>
                                    <Button type="submit" disabled={isSubmitting}>
                                        {isSubmitting ? (
                                            "Salvando..."
                                        ) : (
                                            <>
                                                <Save className="mr-2 h-4 w-4" />
                                                Salvar Alterações
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </div>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
        );
};

export default MembroEditar;

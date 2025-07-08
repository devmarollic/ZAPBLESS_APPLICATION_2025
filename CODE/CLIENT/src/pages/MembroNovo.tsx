
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { ContactService, CreateContactRequest } from "@/services/contactService";
import { MinistryService, Ministry } from "@/services/ministryService";
import { ArrowLeft, Save } from "lucide-react";
import { AuthenticationService } from "@/lib/authentication_service";
import { useQuery } from "@tanstack/react-query";
import MemberMinistrySelection from "@/components/members/MemberMinistrySelection";

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

const MembroNovo = () => {
    const navigate = useNavigate();
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState( false );
    const [ministryMemberships, setMinistryMemberships] = useState<Array<{ ministryId: string; role: string }>>( [] );

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

    const onSubmit = async ( data: MemberFormValues ) => {
        try
        {
            setIsSubmitting( true );
            
            const contactData: CreateContactRequest = {
                name: data.name,
                number: data.number,
                ecclesiasticalTitle: data.ecclesiasticalTitle || undefined,
                churchId,
            };

            const newContact = await ContactService.createContact( contactData );

            // Adicionar ministérios selecionados
            await addMinistryMemberships( newContact.id );

            toast(
                {
                    title: "Sucesso",
                    description: "Membro criado com sucesso!",
                }
                );
            
            navigate( "/dashboard/membros" );
        }
        catch ( error )
        {
            console.error( 'Erro ao criar membro:', error );
            toast(
                {
                    title: "Erro",
                    description: "Não foi possível criar o membro. Tente novamente.",
                    variant: "destructive",
                }
                );
        }
        finally
        {
            setIsSubmitting( false );
        }
    };

    const addMinistryMemberships = async ( contactId: string ) => {
        for ( const membership of ministryMemberships )
        {
            try
            {
                await ContactService.associateContactToMinistry( contactId, {
                    ministryId: membership.ministryId,
                    roleSlug: membership.role
                } );
            }
            catch ( error )
            {
                console.error( `Erro ao adicionar ministério ${membership.ministryId}:`, error );
                // Continue with other ministries even if one fails
            }
        }
    };

    const handleMinistryToggle = ( ministryId: string, checked: boolean ) => {
        if ( checked )
        {
            setMinistryMemberships( current => [
                ...current,
                { ministryId, role: "member" }
            ] );
        }
        else
        {
            setMinistryMemberships( current =>
                current.filter( membership => membership.ministryId !== ministryId )
            );
        }
    };

    const updateMinistryMembership = ( ministryId: string, field: 'role', value: string ) => {
        setMinistryMemberships( current =>
            current.map( membership =>
                membership.ministryId === ministryId
                    ? { ...membership, [field]: value }
                    : membership
            )
        );
    };

    const handleRemoveMinistry = async ( ministryId: string ) => {
        // For new members, we just remove from local state since they don't exist in backend yet
        setMinistryMemberships( current =>
            current.filter( membership => membership.ministryId !== ministryId )
        );
    };

    const handleUpdateRole = async ( ministryId: string, role: string ) => {
        // For new members, we just update local state since they don't exist in backend yet
        setMinistryMemberships( current =>
            current.map( membership =>
                membership.ministryId === ministryId
                    ? { ...membership, role }
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
                    <h2 className="text-3xl font-bold tracking-tight gradientText">Novo Membro</h2>
                    <p className="text-muted-foreground">Adicione um novo membro à sua igreja</p>
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
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                                ministryMemberships={ministryMemberships}
                                onMinistryToggle={handleMinistryToggle}
                                onUpdateMembership={updateMinistryMembership}
                                onRemoveMinistry={handleRemoveMinistry}
                                onUpdateRole={handleUpdateRole}
                            />
                            
                            <div className="flex gap-4 pt-4">
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
                                            Salvar Membro
                                        </>
                                    )}
                                </Button>
                            </div>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    );
};

export default MembroNovo;

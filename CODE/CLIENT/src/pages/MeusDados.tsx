
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { User, Building, MapPin, Upload } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { HttpClient } from '@/lib/http_client';
import { useQuery } from '@tanstack/react-query';

const personalDataSchema = z.object({
    firstName: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
    lastName: z.string().min(2, 'Sobrenome deve ter pelo menos 2 caracteres'),
    phonePrefix: z.string().min(2, 'Prefixo de telefone deve ter pelo menos 2 caracteres'),
    phoneNumber: z.string().min(10, 'Telefone deve ter pelo menos 10 dígitos'),
    documentType: z.enum(['cpf', 'cnpj', 'passport']),
    documentNumber: z.string().min(8, 'Número do documento deve ter pelo menos 8 caracteres'),
    genderId: z.enum(['male', 'female']),
    imagePath: z.string().optional()
});

const churchDataSchema = z.object({
    chuchImagePath: z.string().optional(),
    churchName: z.string().min(2, 'Nome da igreja deve ter pelo menos 2 caracteres'),
    churchAddressLine1: z.string().min(5, 'Endereço deve ter pelo menos 5 caracteres'),
    churchAddressLine2: z.string().optional(),
    churchZipCode: z.string().min(8, 'CEP deve ter 8 dígitos'),
    churchCityCode: z.string().min(1, 'Selecione uma cidade'),
    churchStateCode: z.string().min(2, 'Selecione um estado'),
    churchCountryCode: z.string().min(2, 'Selecione um país'),
    churchNeighborhood: z.string().min(2, 'Bairro deve ter pelo menos 2 caracteres')
});

type PersonalDataFormValues = z.infer<typeof personalDataSchema>;
type ChurchDataFormValues = z.infer<typeof churchDataSchema>;

type ProfileAndChurchData = {
    church: {
        id: string;
        name: string;
        imagePath: string | null;
        addressLine1: string;
        addressLine2: string;
        cityName: string;
        cityCode: string;
        stateCode: string;
        stateName: string;
        countryCode: string;
        neighborhood: string;
        zipCode: string;
    },
    user: {
        id: string;
        firstName: string;
        lastName: string;
        phonePrefix: string;
        phoneNumber: string;
        documentType: 'cpf' | 'cnpj' | 'passport';
        documentNumber: string;
        genderId: 'male' | 'female';
        imagePath: string | null;
    }
}

const MeusDados = () => {
    const { toast } = useToast();
    const [isLoadingPersonal, setIsLoadingPersonal] = useState(false);
    const [isLoadingChurch, setIsLoadingChurch] = useState(false);
    const [churchImage, setChurchImage] = useState<string | null>(null);
    const { data: churchAndProfileData, isLoading: isLoadingChurchAndProfile } = useQuery({
        queryKey: ['churchAndProfileData'],
        queryFn: () => HttpClient.get<ProfileAndChurchData>('/profile/church-data')
    });

    const personalForm = useForm<PersonalDataFormValues>({
        resolver: zodResolver(personalDataSchema),
        defaultValues: {
            firstName: churchAndProfileData?.user.firstName,
            lastName: churchAndProfileData?.user.lastName,
            phonePrefix: churchAndProfileData?.user.phonePrefix,
            phoneNumber: churchAndProfileData?.user.phoneNumber,
            documentType: churchAndProfileData?.user.documentType,
            documentNumber: churchAndProfileData?.user.documentNumber
        },
    });

    const churchForm = useForm<ChurchDataFormValues>({
        resolver: zodResolver(churchDataSchema),
        defaultValues: {
            churchName: churchAndProfileData?.church.name,
            churchAddressLine1: churchAndProfileData?.church.addressLine1,
            churchAddressLine2: churchAndProfileData?.church.addressLine2,
            churchZipCode: churchAndProfileData?.church.zipCode,
            churchCityCode: churchAndProfileData?.church.cityCode,
            churchStateCode: churchAndProfileData?.church.stateCode,
            churchCountryCode: churchAndProfileData?.church.countryCode,
            churchNeighborhood: churchAndProfileData?.church.neighborhood
        },
    });

    const onSubmitPersonal = async (data: PersonalDataFormValues) => {
        try {
            setIsLoadingPersonal(true);

            // This would be a real API call in production
            // await HttpClient.put('/user/profile', data);

            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 1000));

            toast({
                title: 'Dados pessoais atualizados',
                description: 'Suas informações foram salvas com sucesso.',
            });
        } catch (error) {
            console.error('Error updating personal data:', error);
            toast({
                title: 'Erro ao atualizar dados',
                description: 'Não foi possível salvar suas informações. Tente novamente.',
                variant: 'destructive',
            });
        } finally {
            setIsLoadingPersonal(false);
        }
    };

    const onSubmitChurch = async (data: ChurchDataFormValues) => {
        try {
            setIsLoadingChurch(true);

            // This would be a real API call in production
            // await HttpClient.put('/church/profile', data);

            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 1000));

            toast({
                title: 'Dados da igreja atualizados',
                description: 'As informações da igreja foram salvas com sucesso.',
            });
        } catch (error) {
            console.error('Error updating church data:', error);
            toast({
                title: 'Erro ao atualizar dados',
                description: 'Não foi possível salvar as informações da igreja. Tente novamente.',
                variant: 'destructive',
            });
        } finally {
            setIsLoadingChurch(false);
        }
    };

    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setChurchImage(e.target?.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="md:container mx-auto py-6 space-y-6">
            <div>
                <h1 className="text-3xl font-bold">Meus Dados</h1>
                <p className="text-muted-foreground">Gerencie suas informações pessoais e da igreja</p>
            </div>

            <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
                {/* Dados Pessoais */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center">
                            <User className="mr-2 h-5 w-5" />
                            Dados Pessoais
                        </CardTitle>
                        <CardDescription>
                            Atualize suas informações pessoais
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Form {...personalForm}>
                            <form onSubmit={personalForm.handleSubmit(onSubmitPersonal)} className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <FormField
                                        control={personalForm.control}
                                        name="firstName"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Nome</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Nome" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={personalForm.control}
                                        name="lastName"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Sobrenome</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Sobrenome" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <FormField
                                        control={personalForm.control}
                                        name="phonePrefix"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Prefixo de Telefone</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="+55" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={personalForm.control}
                                        name="phoneNumber"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Telefone</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="(11) 99999-9999" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <FormField
                                        control={personalForm.control}
                                        name="documentType"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Tipo de Documento</FormLabel>
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Selecione" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        <SelectItem value="cpf">CPF</SelectItem>
                                                        <SelectItem value="cnpj">CNPJ</SelectItem>
                                                        <SelectItem value="passport">Passaporte</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={personalForm.control}
                                        name="documentNumber"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Número do Documento</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="000.000.000-00" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <Button type="submit" disabled={isLoadingPersonal} className="w-full">
                                    {isLoadingPersonal ? 'Salvando...' : 'Salvar Dados Pessoais'}
                                </Button>
                            </form>
                        </Form>
                    </CardContent>
                </Card>

                {/* Dados da Igreja */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center">
                            <Building className="mr-2 h-5 w-5" />
                            Dados da Igreja
                        </CardTitle>
                        <CardDescription>
                            Atualize as informações da sua igreja
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Form {...churchForm}>
                            <form onSubmit={churchForm.handleSubmit(onSubmitChurch)} className="space-y-4">
                                <FormField
                                    control={churchForm.control}
                                    name="churchName"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Nome da Igreja</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Nome da sua igreja" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <div>
                                    <FormLabel>Imagem da Igreja</FormLabel>
                                    <div className="mt-2 flex items-center gap-4">
                                        {churchImage && (
                                            <img src={churchImage} alt="Igreja" className="w-20 h-20 object-cover rounded-md" />
                                        )}
                                        <div>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={handleImageUpload}
                                                className="hidden"
                                                id="church-image"
                                            />
                                            <label htmlFor="church-image">
                                                <Button type="button" variant="outline" className="cursor-pointer" asChild>
                                                    <span>
                                                        <Upload className="mr-2 h-4 w-4" />
                                                        Escolher Imagem
                                                    </span>
                                                </Button>
                                            </label>
                                        </div>
                                    </div>
                                </div>

                                <FormField
                                    control={churchForm.control}
                                    name="churchAddressLine1"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Endereço da Igreja</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Rua, número" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={churchForm.control}
                                    name="churchAddressLine2"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Complemento</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Sala, andar, etc." {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <FormField
                                        control={churchForm.control}
                                        name="churchZipCode"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>CEP</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="00000-000" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={churchForm.control}
                                        name="churchNeighborhood"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Bairro</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Bairro da igreja" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={churchForm.control}
                                        name="churchCityCode"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Cidade</FormLabel>
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Selecione" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        <SelectItem value="sao-paulo">São Paulo</SelectItem>
                                                        <SelectItem value="rio-janeiro">Rio de Janeiro</SelectItem>
                                                        <SelectItem value="belo-horizonte">Belo Horizonte</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <FormField
                                        control={churchForm.control}
                                        name="churchStateCode"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Estado</FormLabel>
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Selecione" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        <SelectItem value="SP">São Paulo</SelectItem>
                                                        <SelectItem value="RJ">Rio de Janeiro</SelectItem>
                                                        <SelectItem value="MG">Minas Gerais</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={churchForm.control}
                                        name="churchCountryCode"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>País</FormLabel>
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Selecione" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        <SelectItem value="BR">Brasil</SelectItem>
                                                        <SelectItem value="US">Estados Unidos</SelectItem>
                                                        <SelectItem value="PT">Portugal</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <Button type="submit" disabled={isLoadingChurch} className="w-full">
                                    {isLoadingChurch ? 'Salvando...' : 'Salvar Dados da Igreja'}
                                </Button>
                            </form>
                        </Form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default MeusDados;

import { useState, useEffect } from 'react';
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
    churchImagePath: z.string().optional(),
    churchName: z.string().min(2, 'Nome da igreja deve ter pelo menos 2 caracteres'),
    churchAddressLine1: z.string().min(5, 'Endereço deve ter pelo menos 5 caracteres'),
    churchAddressLine2: z.string().optional(),
    churchZipCode: z.string().min(8, 'CEP deve ter 8 dígitos'),
    churchCityCode: z.string().min(1, 'Selecione uma cidade'),
    churchStateCode: z.string().min(2, 'Selecione um estado'),
    churchCountryCode: z.string().min(2, 'Selecione um país'),
    churchNeighborhood: z.string().min(2, 'Bairro deve ter pelo menos 2 caracteres')
});

const stateArray = [
    { code: 'AC', name: 'Acre' },
    { code: 'AL', name: 'Alagoas' },
    { code: 'AP', name: 'Amapá' },
    { code: 'AM', name: 'Amazonas' },
    { code: 'BA', name: 'Bahia' },
    { code: 'CE', name: 'Ceará' },
    { code: 'DF', name: 'Distrito Federal' },
    { code: 'ES', name: 'Espírito Santo' },
    { code: 'GO', name: 'Goiás' },
    { code: 'MA', name: 'Maranhão' },
    { code: 'MT', name: 'Mato Grosso' },
    { code: 'MS', name: 'Mato Grosso do Sul' },
    { code: 'MG', name: 'Minas Gerais' },
    { code: 'PA', name: 'Pará' },
    { code: 'PB', name: 'Paraíba' },
    { code: 'PR', name: 'Paraná' },
    { code: 'PE', name: 'Pernambuco' },
    { code: 'PI', name: 'Piauí' },
    { code: 'RJ', name: 'Rio de Janeiro' },
    { code: 'RN', name: 'Rio Grande do Norte' },
    { code: 'RS', name: 'Rio Grande do Sul' },
    { code: 'RO', name: 'Rondônia' },
    { code: 'RR', name: 'Roraima' },
    { code: 'SC', name: 'Santa Catarina' },
    { code: 'SP', name: 'São Paulo' },
    { code: 'SE', name: 'Sergipe' },
    { code: 'TO', name: 'Tocantins' }
];

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

type City = {
    code: string;
    name: string;
}

const MeusDados = () => {
    const { toast } = useToast();
    const [churchImage, setChurchImage] = useState<string | null>(null);
    const { data: churchAndProfileData, isLoading: isLoadingChurchAndProfile, refetch: refetchChurchAndProfileData, isRefetching: isRefetchingChurchAndProfile } = useQuery({
        queryKey: ['churchAndProfileData'],
        queryFn: () => HttpClient.getDefault().get<ProfileAndChurchData>('/profile/church-data')
    });

    useEffect(() => {
        if (churchAndProfileData?.church.imagePath) {
            setChurchImage(churchAndProfileData.church.imagePath);
        }
    }, [churchAndProfileData]);

    const personalForm = useForm<PersonalDataFormValues>({
        resolver: zodResolver(personalDataSchema),
        defaultValues: {
            firstName: churchAndProfileData?.user.firstName || '',
            lastName: churchAndProfileData?.user.lastName || '',
            phonePrefix: churchAndProfileData?.user.phonePrefix || '+55',
            phoneNumber: churchAndProfileData?.user.phoneNumber || '',
            documentType: churchAndProfileData?.user.documentType || 'cpf',
            documentNumber: churchAndProfileData?.user.documentNumber || '',
            genderId: churchAndProfileData?.user.genderId || 'male'
        },
    });

    const churchForm = useForm<ChurchDataFormValues>({
        resolver: zodResolver(churchDataSchema),
        defaultValues: {
            churchName: churchAndProfileData?.church.name || '',
            churchAddressLine1: churchAndProfileData?.church.addressLine1 || '',
            churchAddressLine2: churchAndProfileData?.church.addressLine2 || '',
            churchZipCode: churchAndProfileData?.church.zipCode || '',
            churchCityCode: churchAndProfileData?.church.cityCode || 'SP',
            churchStateCode: churchAndProfileData?.church.stateCode || 'SP',
            churchCountryCode: churchAndProfileData?.church.countryCode || 'BR',
            churchNeighborhood: churchAndProfileData?.church.neighborhood || ''
        },
    });

    const { data: cityArray, isLoading: isLoadingCityArray, refetch: refetchCityArray, isRefetching: isRefetchingCityArray } = useQuery({
        queryKey: ['cityArray', churchForm.watch('churchStateCode')],
        queryFn: () => HttpClient.getDefault().get<City[]>('/city/' + churchForm.watch('churchStateCode') + '/list'),
        enabled: !!churchForm.watch('churchStateCode')
    });

    useEffect(() => {
        if (churchAndProfileData) {
            personalForm.reset({
                firstName: churchAndProfileData.user.firstName,
                lastName: churchAndProfileData.user.lastName,
                phonePrefix: churchAndProfileData.user.phonePrefix,
                phoneNumber: churchAndProfileData.user.phoneNumber,
                documentType: churchAndProfileData.user.documentType,
                documentNumber: churchAndProfileData.user.documentNumber,
                genderId: churchAndProfileData.user.genderId
            });

            churchForm.reset({
                churchName: churchAndProfileData.church.name,
                churchAddressLine1: churchAndProfileData.church.addressLine1,
                churchAddressLine2: churchAndProfileData.church.addressLine2,
                churchZipCode: churchAndProfileData.church.zipCode,
                churchCityCode: churchAndProfileData.church.cityCode,
                churchStateCode: churchAndProfileData.church.stateCode,
                churchCountryCode: churchAndProfileData.church.countryCode,
                churchNeighborhood: churchAndProfileData.church.neighborhood
            });
        }
    }, [churchAndProfileData]);

    const onSubmitPersonal = async (data: PersonalDataFormValues) => {
        try {
            await HttpClient.getDefault().put('/profile/update', data);

            toast({
                title: 'Dados pessoais atualizados',
                description: 'Suas informações foram salvas com sucesso.',
            });

            refetchChurchAndProfileData();
        } catch (error) {
            console.error('Error updating personal data:', error);
            toast({
                title: 'Erro ao atualizar dados',
                description: 'Não foi possível salvar suas informações. Tente novamente.',
                variant: 'destructive',
            });
        }
    };


    const onSubmitChurch = async (data: ChurchDataFormValues) => {
        try {
            await HttpClient.getDefault().put('/church/update', {
                name: data.churchName,
                addressLine1: data.churchAddressLine1,
                addressLine2: data.churchAddressLine2,
                zipCode: data.churchZipCode,
                cityCode: data.churchCityCode,
                stateCode: data.churchStateCode,
                countryCode: data.churchCountryCode,
                neighborhood: data.churchNeighborhood
            });

            toast({
                title: 'Dados da igreja atualizados',
                description: 'As informações da igreja foram salvas com sucesso.',
            });

            refetchChurchAndProfileData();
        } catch (error) {
            console.error('Error updating church data:', error);
            toast({
                title: 'Erro ao atualizar dados',
                description: 'Não foi possível salvar as informações da igreja. Tente novamente.',
                variant: 'destructive',
            });
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
    }

    if (isLoadingChurchAndProfile) {
        return (
            <div className="md:container mx-auto py-6 space-y-6">
                <div>
                    <h1 className="text-3xl font-bold">Meus Dados</h1>
                    <p className="text-muted-foreground">Gerencie suas informações pessoais e da igreja</p>
                </div>
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
            </div>
        );
    }

    const phoneCountryCodes = [
        { code: '+55', country: 'Brasil', flag: '🇧🇷' },
        { code: '+1', country: 'EUA/Canadá', flag: '🇺🇸' },
        { code: '+54', country: 'Argentina', flag: '🇦🇷' },
        { code: '+56', country: 'Chile', flag: '🇨🇱' },
        { code: '+57', country: 'Colômbia', flag: '🇨🇴' },
        { code: '+51', country: 'Peru', flag: '🇵🇪' },
        { code: '+598', country: 'Uruguai', flag: '🇺🇾' },
        { code: '+595', country: 'Paraguai', flag: '🇵🇾' },
        { code: '+52', country: 'México', flag: '🇲🇽' },
        { code: '+34', country: 'Espanha', flag: '🇪🇸' },
        { code: '+351', country: 'Portugal', flag: '🇵🇹' }
    ];

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
                                                <Select
                                                    value={field.value}
                                                    onValueChange={field.onChange}
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Código" />
                                                    </SelectTrigger>
                                                    <SelectContent {...field}>
                                                        {phoneCountryCodes.map((item) => (
                                                            <SelectItem key={item.code} value={item.code}>
                                                                <div className="flex items-center space-x-2">
                                                                    <span>{item.flag}</span>
                                                                    <span>{item.code}</span>
                                                                    <span className="text-sm text-gray-500">{item.country}</span>
                                                                </div>
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
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

                                <FormField
                                    control={personalForm.control}
                                    name="genderId"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Gênero</FormLabel>
                                            <FormControl>
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Selecione" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        <SelectItem value="male">Masculino</SelectItem>
                                                        <SelectItem value="female">Feminino</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <Button type="submit" disabled={isLoadingChurchAndProfile || isRefetchingChurchAndProfile} className="w-full">
                                    {isLoadingChurchAndProfile || isRefetchingChurchAndProfile ? 'Salvando...' : 'Salvar Dados Pessoais'}
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

                                {/* <div>
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
                                </div> */}

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


                                    {!isLoadingCityArray && (
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
                                                            {
                                                                cityArray?.map(
                                                                    (city) => (
                                                                        <SelectItem key={city.code} value={city.code}>{city.name}</SelectItem>
                                                                    )
                                                                )
                                                            }
                                                        </SelectContent>
                                                    </Select>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    )}
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {
                                        !isLoadingCityArray && (
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
                                                                {stateArray.map((item) => (
                                                                    <SelectItem key={item.code} value={item.code}>
                                                                        {item.name}
                                                                    </SelectItem>
                                                                ))}
                                                            </SelectContent>
                                                        </Select>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        )
                                    }

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
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <Button type="submit" disabled={isLoadingChurchAndProfile || isRefetchingChurchAndProfile} className="w-full">
                                    {isLoadingChurchAndProfile || isRefetchingChurchAndProfile ? 'Salvando...' : 'Salvar Dados da Igreja'}
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

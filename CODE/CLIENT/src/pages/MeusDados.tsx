
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

const personalDataSchema = z.object({
    name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
    phoneNumber: z.string().min(10, 'Telefone deve ter pelo menos 10 dígitos'),
    addressLine1: z.string().min(5, 'Endereço deve ter pelo menos 5 caracteres'),
    addressLine2: z.string().optional(),
    zipCode: z.string().min(8, 'CEP deve ter 8 dígitos'),
    cityCode: z.string().min(1, 'Selecione uma cidade'),
    stateCode: z.string().min(2, 'Selecione um estado'),
    countryCode: z.string().min(2, 'Selecione um país'),
    neighborhood: z.string().min(2, 'Bairro deve ter pelo menos 2 caracteres'),
    documentType: z.string().min(1, 'Selecione o tipo de documento'),
    documentNumber: z.string().min(8, 'Número do documento deve ter pelo menos 8 caracteres'),
    languageTag: z.string().min(1, 'Selecione um idioma'),
});

const churchDataSchema = z.object({
    churchName: z.string().min(2, 'Nome da igreja deve ter pelo menos 2 caracteres'),
    churchDescription: z.string().optional(),
    churchAddressLine1: z.string().min(5, 'Endereço deve ter pelo menos 5 caracteres'),
    churchAddressLine2: z.string().optional(),
    churchZipCode: z.string().min(8, 'CEP deve ter 8 dígitos'),
    churchCityCode: z.string().min(1, 'Selecione uma cidade'),
    churchStateCode: z.string().min(2, 'Selecione um estado'),
    churchCountryCode: z.string().min(2, 'Selecione um país'),
    churchNeighborhood: z.string().min(2, 'Bairro deve ter pelo menos 2 caracteres'),
});

type PersonalDataFormValues = z.infer<typeof personalDataSchema>;
type ChurchDataFormValues = z.infer<typeof churchDataSchema>;

const MeusDados = () => {
    const { toast } = useToast();
    const [isLoadingPersonal, setIsLoadingPersonal] = useState(false);
    const [isLoadingChurch, setIsLoadingChurch] = useState(false);
    const [churchImage, setChurchImage] = useState<string | null>(null);

    const personalForm = useForm<PersonalDataFormValues>({
        resolver: zodResolver(personalDataSchema),
        defaultValues: {
            name: 'João Silva',
            phoneNumber: '11987654321',
            addressLine1: 'Rua das Flores, 123',
            addressLine2: 'Apt 45',
            zipCode: '01234567',
            cityCode: 'sao-paulo',
            stateCode: 'SP',
            countryCode: 'BR',
            neighborhood: 'Centro',
            documentType: 'cpf',
            documentNumber: '12345678901',
            languageTag: 'pt-BR',
        },
    });

    const churchForm = useForm<ChurchDataFormValues>({
        resolver: zodResolver(churchDataSchema),
        defaultValues: {
            churchName: 'Igreja Evangélica Exemplo',
            churchDescription: 'Uma igreja acolhedora no coração da cidade',
            churchAddressLine1: 'Av. Principal, 456',
            churchAddressLine2: '',
            churchZipCode: '01234567',
            churchCityCode: 'sao-paulo',
            churchStateCode: 'SP',
            churchCountryCode: 'BR',
            churchNeighborhood: 'Centro',
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
        <div className="container mx-auto py-6 space-y-6">
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
                                <FormField
                                    control={personalForm.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Nome Completo</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Seu nome completo" {...field} />
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
                                                        <SelectItem value="rg">RG</SelectItem>
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
                                    name="addressLine1"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Endereço</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Rua, número" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={personalForm.control}
                                    name="addressLine2"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Complemento</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Apartamento, bloco, etc." {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <FormField
                                        control={personalForm.control}
                                        name="zipCode"
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
                                        control={personalForm.control}
                                        name="neighborhood"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Bairro</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Seu bairro" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={personalForm.control}
                                        name="cityCode"
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
                                        control={personalForm.control}
                                        name="stateCode"
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
                                        control={personalForm.control}
                                        name="languageTag"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Idioma</FormLabel>
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Selecione" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        <SelectItem value="pt-BR">Português (Brasil)</SelectItem>
                                                        <SelectItem value="en-US">English (US)</SelectItem>
                                                        <SelectItem value="es-ES">Español</SelectItem>
                                                    </SelectContent>
                                                </Select>
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

                                <FormField
                                    control={churchForm.control}
                                    name="churchDescription"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Descrição</FormLabel>
                                            <FormControl>
                                                <Textarea placeholder="Breve descrição da igreja" {...field} />
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

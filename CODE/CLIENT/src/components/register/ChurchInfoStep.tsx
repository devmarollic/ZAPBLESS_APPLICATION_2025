import { useState } from 'react';
import { ChurchInfo } from '@/types/register';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ImagePlus, X } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { applyCnpjMask, applyCpfMask, applyZipCodeMask, removeMask } from '@/utils/documentMasks';
import { HttpClient } from '@/lib/http_client';
import { useQuery } from '@tanstack/react-query';

interface ChurchInfoStepProps {
    churchInfo: ChurchInfo;
    setChurchInfo: React.Dispatch<React.SetStateAction<ChurchInfo>>;
}

interface City {
    code: string;
    name: string;
}

const ChurchInfoStep = ({ churchInfo, setChurchInfo }: ChurchInfoStepProps) => {
    const [dragActive, setDragActive] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setChurchInfo(prev => ({ ...prev, [name]: value }));
    };

    const handleMaskedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        let maskedValue = value;

        if (name === 'zipCode') {
            maskedValue = applyZipCodeMask(value);
        } else if (name === 'documentNumber') {
            if (churchInfo.documentType === 'cpf') {
                maskedValue = applyCpfMask(value);
            } else if (churchInfo.documentType === 'cnpj') {
                maskedValue = applyCnpjMask(value);
            }
        }

        setChurchInfo(prev => ({ ...prev, [name]: maskedValue }));
    };

    const handleSelectChange = (name: string, value: string) => {
        setChurchInfo(prev => ({ ...prev, [name]: value }));
        
        if (name === 'stateCode') {
            const capitais: { [key: string]: string } = {
                'AC': 'Acre',
                'AL': 'Alagoas',
                'AP': 'Amapá',
                'AM': 'Amazonas',
                'BA': 'Bahia',
                'CE': 'Ceará',
                'DF': 'Distrito Federal',
                'ES': 'Espírito Santo',
                'GO': 'Goiás',
                'MA': 'Maranhão',
                'MT': 'Mato Grosso',
                'MS': 'Mato Grosso do Sul',
                'MG': 'Minas Gerais',
                'PA': 'Pará',
                'PB': 'Paraíba',
                'PR': 'Paraná',
                'PE': 'Pernambuco',
                'PI': 'Piauí',
                'RJ': 'Rio de Janeiro',
                'RN': 'Rio Grande do Norte',
                'RS': 'Rio Grande do Sul',
                'RO': 'Rondônia',
                'RR': 'Roraima',
                'SC': 'Santa Catarina',
                'SP': 'São Paulo',
                'SE': 'Sergipe',
                'TO': 'Tocantins'
            };
            setChurchInfo(prev => ({ 
                ...prev, 
                [name]: value,
                stateName: capitais[value] || '',
                cityCode: ''
            }));
        }

        if (name === 'documentType') {
            setChurchInfo(prev => ({ ...prev, documentNumber: '' }));
        }
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setChurchInfo(prev => ({
                ...prev,
                imagePath: file,
                imagePreview: URL.createObjectURL(file)
            }));
        }
    };

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true);
        } else if (e.type === 'dragleave') {
            setDragActive(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const file = e.dataTransfer.files[0];
            setChurchInfo(prev => ({
                ...prev,
                imagePath: file,
                imagePreview: URL.createObjectURL(file)
            }));
        }
    };

    const removeImage = () => {
        setChurchInfo(prev => ({
            ...prev,
            imagePath: null,
            imagePreview: null
        }));
    };

    const estados = [
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

    const paises = [
        { code: 'BR', name: 'Brasil' }
    ];

    const { data: cityArray, isLoading: isLoadingCityArray, refetch: refetchCityArray, isRefetching: isRefetchingCityArray } = useQuery({
        queryKey: ['cityArray', churchInfo.stateCode],
        queryFn: () => HttpClient.getDefault().get<City[]>('/city/' + churchInfo.stateCode + '/list'),
        enabled: !!churchInfo.stateCode
    });

    return (
        <div className="space-y-6">
            <h2 className="text-xl font-semibold text-center mb-6">Informações da Igreja</h2>

            <div className="grid gap-4 md:grid-cols-1">
                <div className="space-y-2">
                    <Label htmlFor="name">Nome da Igreja *</Label>
                    <Input
                        id="name"
                        name="name"
                        value={churchInfo.name}
                        onChange={handleChange}
                        placeholder="Ex: Igreja Batista Central"
                        required
                    />
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                    <Label htmlFor="address">Endereço *</Label>
                    <Input
                        id="address"
                        name="addressLine1"
                        value={churchInfo.addressLine1}
                        onChange={handleChange}
                        placeholder="Ex: Av. Brasil"
                        required
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="number">Número</Label>
                    <Input
                        id="number"
                        name="addressLine2"
                        value={churchInfo.addressLine2}
                        onChange={handleChange}
                        placeholder="Ex: 123"
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="neighborhood">Bairro *</Label>
                    <Input
                        id="neighborhood"
                        name="neighborhood"
                        value={churchInfo.neighborhood}
                        onChange={handleChange}
                        placeholder="Ex: Centro"
                        required
                    />
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-4">
                <div className="space-y-2">
                    <Label htmlFor="country">País *</Label>
                    <Select
                        value={churchInfo.countryCode}
                        onValueChange={(value) => handleSelectChange('countryCode', value)}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Selecione o país" />
                        </SelectTrigger>
                        <SelectContent>
                            {paises.map((pais) => (
                                <SelectItem key={pais.code} value={pais.code}>
                                    {pais.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="state">Estado *</Label>
                    <Select
                        value={churchInfo.stateCode}
                        onValueChange={(value) => handleSelectChange('stateCode', value)}
                        disabled={churchInfo.countryCode !== 'BR'}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Selecione o estado" />
                        </SelectTrigger>
                        <SelectContent>
                            {estados.map((estado) => (
                                <SelectItem key={estado.code} value={estado.code}>
                                    {estado.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="city">Cidade *</Label>
                    <Select
                        value={churchInfo.cityCode}
                        onValueChange={(value) => {
                            setChurchInfo(prev => ({ 
                                ...prev, 
                                cityCode: value
                            }));
                        }}
                        disabled={!churchInfo.stateCode || churchInfo.countryCode !== 'BR'}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Selecione a cidade" />
                        </SelectTrigger>
                        <SelectContent>
                            {churchInfo.stateCode && cityArray?.map((city) => (
                                <SelectItem key={city.code} value={city.code}>
                                    {city.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="zipCode">CEP *</Label>
                    <Input
                        id="zipCode"
                        name="zipCode"
                        value={churchInfo.zipCode}
                        onChange={handleMaskedChange}
                        placeholder="00000-000"
                        maxLength={9}
                        required
                    />
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                    <Label htmlFor="documentType">Tipo de Documento *</Label>
                    <Select
                        value={churchInfo.documentType}
                        onValueChange={(value) => handleSelectChange('documentType', value as 'passport' | 'cnpj' | 'cpf')}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Selecione o tipo" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="cnpj">CNPJ</SelectItem>
                            <SelectItem value="cpf">CPF</SelectItem>
                            <SelectItem value="passport">Passaporte</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="documentNumber">
                        {churchInfo.documentType === 'cnpj' ? 'CNPJ' : 
                         churchInfo.documentType === 'cpf' ? 'CPF' : 'Passaporte'} *
                    </Label>
                    <Input
                        id="documentNumber"
                        name="documentNumber"
                        value={churchInfo.documentNumber}
                        onChange={handleMaskedChange}
                        placeholder={
                            churchInfo.documentType === 'cnpj' ? '00.000.000/0000-00' :
                            churchInfo.documentType === 'cpf' ? '000.000.000-00' : 'Número do passaporte'
                        }
                        maxLength={
                            churchInfo.documentType === 'cnpj' ? 18 :
                            churchInfo.documentType === 'cpf' ? 14 : 20
                        }
                        required
                    />
                </div>
            </div>

            {/* <div className="space-y-2">
                <Label>Imagem da Igreja</Label>

                {churchInfo.imagePreview ? (
                    <div className="relative mt-2 rounded-lg overflow-hidden h-60 w-full">
                        <img
                            src={churchInfo.imagePreview}
                            alt="Church preview"
                            className="w-full h-full object-cover"
                        />
                        <button
                            onClick={removeImage}
                            className="absolute top-2 right-2 bg-white p-1 rounded-full shadow-md"
                        >
                            <X className="h-5 w-5 text-red-500" />
                        </button>
                    </div>
                ) : (
                    <div
                        className={`mt-2 border-2 border-dashed rounded-lg p-6 text-center h-60 flex flex-col items-center justify-center ${dragActive ? "border-zapPurple-500 bg-zapPurple-50" : "border-gray-300"
                            }`}
                        onDragEnter={handleDrag}
                        onDragLeave={handleDrag}
                        onDragOver={handleDrag}
                        onDrop={handleDrop}
                    >
                        <ImagePlus className="h-10 w-10 text-gray-400 mb-2" />
                        <p className="text-sm text-gray-500 mb-2">
                            Arraste e solte uma imagem aqui, ou clique para selecionar
                        </p>
                        <input
                            id="church-image"
                            name="church-image"
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="hidden"
                        />
                        <label
                            htmlFor="church-image"
                            className="text-zapPurple-600 text-sm cursor-pointer hover:underline"
                        >
                            Selecionar imagem
                        </label>
                    </div>
                )}
            </div> */}
        </div>
    );
};

export default ChurchInfoStep;

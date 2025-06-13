import { AdminInfo } from '@/types/register';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Calendar as CalendarIcon, Phone, Mail, User, Lock, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PhoneInput } from '@/components/ui/phone-input';
import { cn } from '@/lib/utils';
import { applyCpfMask } from '@/utils/documentMasks';

interface AdminInfoStepProps {
    adminInfo: AdminInfo;
    setAdminInfo: React.Dispatch<React.SetStateAction<AdminInfo>>;
}

const AdminInfoStep = ({ adminInfo, setAdminInfo }: AdminInfoStepProps) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setAdminInfo((prev) => ({ ...prev, [name]: value }));
    };

    const handleCpfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target;
        const maskedValue = applyCpfMask(value);
        setAdminInfo((prev) => ({ ...prev, documentNumber: maskedValue }));
    };

    const handleDateChange = (date: Date | undefined) => {
        setAdminInfo((prev) => ({ ...prev, birthDate: date || null }));
    };

    const handleGenderChange = (value: string) => {
        setAdminInfo((prev) => ({
            ...prev,
            genderId: value as 'male' | 'female'
        }));
    };

    const handlePhoneChange = (value: string) => {
        setAdminInfo((prev) => ({ ...prev, phoneNumber: value }));
    };

    const handlePhonePrefixChange = (value: string) => {
        setAdminInfo((prev) => ({ ...prev, phonePrefix: value }));
    };

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

    const today = new Date();
    
    return (
        <div className="space-y-6">
            <h2 className="text-xl font-semibold text-center mb-6">
                Informações do Administrador
            </h2>

            <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                    <Label htmlFor="firstName">Nome *</Label>
                    <div className="relative">
                        <User className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                        <Input
                            id="firstName"
                            name="firstName"
                            value={adminInfo.firstName}
                            onChange={handleChange}
                            placeholder="Seu nome"
                            className="pl-10"
                            required
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="lastName">Sobrenome *</Label>
                    <div className="relative">
                        <User className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                        <Input
                            id="lastName"
                            name="lastName"
                            value={adminInfo.lastName}
                            onChange={handleChange}
                            placeholder="Seu sobrenome"
                            className="pl-10"
                            required
                        />
                    </div>
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <div className="relative">
                    <Mail className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                    <Input
                        id="email"
                        name="email"
                        type="email"
                        value={adminInfo.email}
                        onChange={handleChange}
                        placeholder="seu.email@exemplo.com"
                        className="pl-10"
                        required
                    />
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="password">Password *</Label>
                <div className="relative">
                    <Lock className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                    <Input
                        id="password"
                        name="password"
                        type="password"
                        value={adminInfo.password}
                        onChange={handleChange}
                        placeholder="Digite sua senha"
                        className="pl-10"
                        required
                    />
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="documentNumber">CPF *</Label>
                <div className="relative">
                    <FileText className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                    <Input
                        id="documentNumber"
                        name="documentNumber"
                        value={adminInfo.documentNumber}
                        onChange={handleCpfChange}
                        placeholder="000.000.000-00"
                        className="pl-10"
                        maxLength={14}
                        required
                    />
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="birthDate">Data de Nascimento *</Label>
                <Popover>
                    <PopoverTrigger asChild>
                        <Button
                            variant="outline"
                            className={cn(
                                "w-full pl-3 text-left font-normal",
                                !adminInfo.birthDate && "text-muted-foreground"
                            )}
                        >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {adminInfo.birthDate ? (
                                format(adminInfo.birthDate, "PPP", { locale: ptBR })
                            ) : (
                                <span>Selecione sua data de nascimento</span>
                            )}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                            mode="single"
                            selected={adminInfo.birthDate || undefined}
                            onSelect={handleDateChange}
                            disabled={(date) => date > today}
                            initialFocus
                            locale={ptBR}
                            defaultMonth={adminInfo.birthDate || new Date(1990, 0)}
                            captionLayout="buttons"
                            fromYear={1920}
                            toYear={today.getFullYear() - 16}
                            className="pointer-events-auto"
                        />
                    </PopoverContent>
                </Popover>
            </div>

            <div className="space-y-3">
                <Label>Gênero *</Label>
                <RadioGroup
                    value={adminInfo.genderId}
                    onValueChange={handleGenderChange}
                    className="flex space-x-6"
                >
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="male" id="male" />
                        <Label htmlFor="male" className="cursor-pointer">Masculino</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="female" id="female" />
                        <Label htmlFor="female" className="cursor-pointer">Feminino</Label>
                    </div>
                </RadioGroup>
            </div>

            <div className="space-y-2">
                <Label>Telefone *</Label>
                <div className="flex space-x-2">
                    <div className="w-40">
                        <Select
                            value={adminInfo.phonePrefix}
                            onValueChange={handlePhonePrefixChange}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Código" />
                            </SelectTrigger>
                            <SelectContent>
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
                    </div>
                    <div className="flex-1">
                        <PhoneInput
                            value={adminInfo.phoneNumber}
                            onChange={handlePhoneChange}
                            placeholder="(11) 9 8765-4321"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminInfoStep;

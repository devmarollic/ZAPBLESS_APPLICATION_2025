import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import RegisterSteps from '@/components/register/RegisterSteps';
import ChurchInfoStep from '@/components/register/ChurchInfoStep';
import AdminInfoStep from '@/components/register/AdminInfoStep';
import PlanSelectionStep from '@/components/register/PlanSelectionStep';
import ReviewStep from '@/components/register/ReviewStep';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { HttpClient } from '@/lib/http_client';
import { useIsMobile } from '@/hooks/use-mobile';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useNavigate } from 'react-router-dom';
import { usePlanContext } from '@/context/PlanContext';

export type ChurchInfo = {
    documentNumber: any;
    documentType: any;
    zipCode: any;
    neighborhood: any;
    stateName: any;
    name: string;
    addressLine1: string;
    addressLine2: string;
    cityCode: string;
    cityName: string;
    stateCode: string;
    countryCode: string;
    imagePath: File | null;
    imagePreview: string | null;
    languageTag: string;
};

export type AdminInfo = {
    firstName: string;
    lastName: string;
    birthDate: Date | null;
    email: string;
    password: string;
    genderId: 'male' | 'female';
    phonePrefix: string;
    phoneNumber: string;
    documentNumber: string;
};

const Register = () => {
    const { toast } = useToast();
    const [currentStep, setCurrentStep] = useState<number>(0);
    const isMobile = useIsMobile();
    const [expandedStep, setExpandedStep] = useState<string>('step-0');
    const [loading, setLoading] = useState<boolean>(false);
    const navigate = useNavigate();
    const { selectedPlan, setSelectedPlan, isAnnual, setIsAnnual, setSubscriptionId } = usePlanContext();
    
    const [churchInfo, setChurchInfo] = useState<ChurchInfo>({
        name: '',
        addressLine1: '',
        addressLine2: '',
        neighborhood: '',
        cityCode: 'SP',
        cityName: 'São Paulo',
        stateCode: 'SP',
        stateName: 'São Paulo',
        countryCode: 'BR',
        zipCode: '',
        documentType: 'cnpj',
        documentNumber: '',
        imagePath: null,
        imagePreview: null,
        languageTag: navigator.language
    });

    const [adminInfo, setAdminInfo] = useState<AdminInfo>({
        firstName: '',
        lastName: '',
        birthDate: null,
        email: '',
        password: '',
        genderId: 'male',
        phonePrefix: '+55',
        phoneNumber: '',
        documentNumber: ''
    });

    useEffect(() => {
        setExpandedStep(`step-${currentStep}`);
    }, [currentStep]);

    const validateChurchInfo = (): boolean => {
        if (!churchInfo.name) {
            toast({
                title: 'Erro de validação',
                description: 'O nome da igreja é obrigatório',
                variant: 'destructive'
            });
            return false;
        }
        if (!churchInfo.addressLine1) {
            toast({
                title: 'Erro de validação',
                description: 'O endereço é obrigatório',
                variant: 'destructive'
            });
            return false;
        }
        if (!churchInfo.neighborhood) {
            toast({
                title: 'Erro de validação',
                description: 'O bairro é obrigatório',
                variant: 'destructive'
            });
            return false;
        }
        if (!churchInfo.zipCode) {
            toast({
                title: 'Erro de validação',
                description: 'O CEP é obrigatório',
                variant: 'destructive'
            });
            return false;
        }
        if (!churchInfo.documentNumber) {
            toast({
                title: 'Erro de validação',
                description: 'O documento é obrigatório',
                variant: 'destructive'
            });
            return false;
        }
        return true;
    };

    const validateAdminInfo = (): boolean => {
        if (!adminInfo.firstName) {
            toast({
                title: 'Erro de validação',
                description: 'O nome é obrigatório',
                variant: 'destructive'
            });
            return false;
        }
        if (!adminInfo.lastName) {
            toast({
                title: 'Erro de validação',
                description: 'O sobrenome é obrigatório',
                variant: 'destructive'
            });
            return false;
        }
        if (!adminInfo.email) {
            toast({
                title: 'Erro de validação',
                description: 'O email é obrigatório',
                variant: 'destructive'
            });
            return false;
        }
        if (!adminInfo.password) {
            toast({
                title: 'Erro de validação',
                description: 'O password é obrigatório',
                variant: 'destructive'
            });
            return false;
        }
        if (!adminInfo.birthDate) {
            toast({
                title: 'Erro de validação',
                description: 'A data de nascimento é obrigatória',
                variant: 'destructive'
            });
            return false;
        }
        if (!adminInfo.phoneNumber) {
            toast({
                title: 'Erro de validação',
                description: 'O número de telefone é obrigatório',
                variant: 'destructive'
            });
            return false;
        }
        if (!adminInfo.documentNumber) {
            toast({
                title: 'Erro de validação',
                description: 'O CPF é obrigatório',
                variant: 'destructive'
            });
            return false;
        }
        return true;
    };

    const nextStep = () => {
        // Validation for current step
        if (currentStep === 0) {
            if (!validateChurchInfo()) return;
        } else if (currentStep === 1) {
            if (!validateAdminInfo()) return;
        } else if (currentStep === 2 && selectedPlan === null) {
            toast({
                title: 'Erro de validação',
                description: 'Selecione um plano para continuar',
                variant: 'destructive'
            });
            return;
        }

        if (currentStep < steps.length - 1) {
            setCurrentStep(currentStep + 1);
        }
    };

    const prevStep = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    };

    const steps = [
        {
            id: 'church-info',
            name: 'Dados da Igreja',
            component: (
                <ChurchInfoStep
                    churchInfo={churchInfo}
                    setChurchInfo={setChurchInfo}
                />
            )
        },
        {
            id: 'admin-info',
            name: 'Dados do Administrador',
            component: (
                <AdminInfoStep
                    adminInfo={adminInfo}
                    setAdminInfo={setAdminInfo}
                />
            )
        },
        {
            id: 'plan-selection',
            name: 'Plano',
            component: (
                <PlanSelectionStep/>
            )
        },
        {
            id: 'review',
            name: 'Revisão',
            component: (
                <ReviewStep
                    churchInfo={churchInfo}
                    adminInfo={adminInfo}
                />
            )
        }
    ];

    const handleSubmit = async () => {
        setLoading(true);
        try {
            const response = await HttpClient.getDefault().post<{subscriptionId: string}>(
                '/church/add',
                {
                    churchInfo:
                        {
                            name: churchInfo.name,
                            addressLine1: churchInfo.addressLine1,
                            addressLine2: churchInfo.addressLine2,
                            cityCode: churchInfo.cityCode,
                            cityName: churchInfo.cityName,
                            stateCode: churchInfo.stateCode,
                            stateName: churchInfo.stateName,
                            neighborhood: churchInfo.neighborhood,
                            zipCode: churchInfo.zipCode,
                            countryCode: churchInfo.countryCode,
                            languageTag: churchInfo.languageTag,
                            imagePath: churchInfo.imagePath,
                            documentType: churchInfo.documentType,
                            documentNumber: churchInfo.documentNumber
                        },
                    adminInfo:
                        {
                            firstName: adminInfo.firstName,
                            lastName: adminInfo.lastName,
                            birthDate: adminInfo.birthDate,
                            genderId : adminInfo.genderId,
                            email: adminInfo.email,
                            password: adminInfo.password,
                            phonePrefix: adminInfo.phonePrefix,
                            phoneNumber: adminInfo.phoneNumber,
                            countryCode: churchInfo.countryCode,
                            documentNumber: adminInfo.documentNumber
                        },
                    selectedPlan,
                    isAnnual
                }   
            );
            
            toast({
                title: 'Cadastro realizado com sucesso!',
                description: 'Bem-vindo ao ZapBless!',
            });

            setSubscriptionId(response.subscriptionId);
            
            navigate('/pagamento');
        } catch (error) {
            console.error('Erro ao cadastrar igreja:', error);
            toast({
                title: 'Erro no cadastro',
                description: 'Não foi possível completar o cadastro. Tente novamente.',
                variant: 'destructive'
            });
        } finally {
            setLoading(false);
        }
    };

    // For desktop view, render standard steps
    if (!isMobile) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-zapBlue-50 to-zapPurple-50 py-12 px-4">
                <div className="max-w-3xl mx-auto">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold">
                            <span className="text-zapBlue-600">Zap</span>
                            <span className="text-zapPurple-600">Bless</span>
                        </h1>
                        <p className="text-gray-600 mt-2">Complete o cadastro para começar</p>
                    </div>

                    <Card className="shadow-lg border-0">
                        <CardContent className="pt-6">
                            <RegisterSteps
                                steps={steps.map((step) => step.name)}
                                currentStep={currentStep}
                            />

                            <div className="mt-8 min-h-[400px]">
                                {steps[currentStep].component}
                            </div>

                            <div className="flex justify-between mt-8">
                                {currentStep > 0 ? (
                                    <Button
                                        variant="outline"
                                        onClick={prevStep}
                                        className="flex items-center gap-2"
                                    >
                                        <ChevronLeft className="h-4 w-4" />
                                        Voltar
                                    </Button>
                                ) : (
                                    <div></div>
                                )}

                                {currentStep < steps.length - 1 ? (
                                    <Button
                                        onClick={nextStep}
                                        className="flex items-center gap-2 bg-gradient-to-r from-zapBlue-600 to-zapPurple-600"
                                        disabled={currentStep === 2 && selectedPlan === null}
                                    >
                                        Próximo
                                        <ChevronRight className="h-4 w-4" />
                                    </Button>
                                ) : (
                                    <Button
                                        onClick={handleSubmit}
                                        disabled={loading}
                                        className="bg-gradient-to-r from-zapBlue-600 to-zapPurple-600"
                                    >
                                        {loading ? 'Processando...' : 'Finalizar cadastro'}
                                    </Button>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        );
    }

    // For mobile view, render accordion-based steps
    return (
        <div className="min-h-screen bg-gradient-to-b from-zapBlue-50 to-zapPurple-50 py-6 px-4">
            <div className="max-w-3xl mx-auto">
                <div className="text-center mb-6">
                    <h1 className="text-2xl font-bold">
                        <span className="text-zapBlue-600">Zap</span>
                        <span className="text-zapPurple-600">Bless</span>
                    </h1>
                    <p className="text-gray-600 mt-2">Complete o cadastro para começar</p>
                </div>

                <Card className="shadow-lg border-0">
                    <CardContent className="p-4">
                        <Accordion
                            type="single"
                            collapsible
                            value={expandedStep}
                            onValueChange={(value) => {
                                // Allow expanding previous steps for editing
                                const stepIndex = parseInt(value.split('-')[1]);
                                if (stepIndex <= currentStep) {
                                    setExpandedStep(value);
                                }
                            }}
                            className="w-full"
                        >
                            {steps.map((step, index) => (
                                <AccordionItem 
                                    key={`step-${index}`} 
                                    value={`step-${index}`}
                                    className={`border rounded-lg mb-3 ${
                                        index === currentStep ? 'border-zapPurple-500' : 
                                        index < currentStep ? 'border-gray-300 bg-gray-50' : 'border-gray-200'
                                    }`}
                                >
                                    <AccordionTrigger className={`px-4 ${
                                        index === currentStep ? 'text-zapPurple-700 font-medium' : 
                                        index < currentStep ? 'text-gray-700' : 'text-gray-400'
                                    } ${index > currentStep ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                                    disabled={index > currentStep}
                                    >
                                        <div className="flex items-center">
                                            <span className={`flex items-center justify-center w-6 h-6 rounded-full text-xs font-semibold mr-2 ${
                                                index < currentStep ? 'bg-zapPurple-600 text-white' : 
                                                index === currentStep ? 'border-2 border-zapPurple-600 text-zapPurple-600' : 
                                                'border-2 border-gray-300 text-gray-400'
                                            }`}>
                                                {index + 1}
                                            </span>
                                            {step.name}
                                        </div>
                                    </AccordionTrigger>
                                    <AccordionContent className="px-4 pb-4">
                                        <div className="py-2">
                                            {step.component}
                                        </div>
                                        <div className="flex justify-between mt-4">
                                            {index > 0 ? (
                                                <Button
                                                    variant="outline"
                                                    onClick={() => {
                                                        setCurrentStep(index - 1);
                                                    }}
                                                    className="flex items-center gap-2"
                                                    size="sm"
                                                >
                                                    <ChevronLeft className="h-4 w-4" />
                                                    Voltar
                                                </Button>
                                            ) : (
                                                <div></div>
                                            )}

                                            {index < steps.length - 1 ? (
                                                <Button
                                                    onClick={() => {
                                                        if (index === 0 && !validateChurchInfo()) return;
                                                        if (index === 1 && !validateAdminInfo()) return;
                                                        if (index === 2 && selectedPlan === null) {
                                                            toast({
                                                                title: 'Erro de validação',
                                                                description: 'Selecione um plano para continuar',
                                                                variant: 'destructive'
                                                            });
                                                            return;
                                                        }
                                                        setCurrentStep(index + 1);
                                                    }}
                                                    className="flex items-center gap-2 bg-gradient-to-r from-zapBlue-600 to-zapPurple-600"
                                                    size="sm"
                                                >
                                                    Próximo
                                                    <ChevronRight className="h-4 w-4" />
                                                </Button>
                                            ) : (
                                                <Button
                                                    onClick={handleSubmit}
                                                    disabled={loading}
                                                    className="bg-gradient-to-r from-zapBlue-600 to-zapPurple-600"
                                                    size="sm"
                                                >
                                                    {loading ? 'Processando...' : 'Finalizar cadastro'}
                                                </Button>
                                            )}
                                        </div>
                                    </AccordionContent>
                                </AccordionItem>
                            ))}
                        </Accordion>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default Register;

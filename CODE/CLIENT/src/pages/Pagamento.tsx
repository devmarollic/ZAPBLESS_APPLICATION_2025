import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/hooks/use-toast';
import { CreditCard, Lock, Check, QrCode, FileText, Banknote } from 'lucide-react';
import { usePlanContext } from '@/context/PlanContext';
import { HttpClient } from '@/lib/http_client';

const Pagamento = () => {
    const navigate = useNavigate();
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState('credit_card');
    const { plans, isLoading, selectedPlan, isAnnual, planByIdMap, subscriptionId } = usePlanContext();
    
    const [formData, setFormData] = useState({
        // Dados do cartão
        cardNumber: '',
        expiryDate: '',
        cvv: '',
        holderName: '',
        cpf: '',
        // Dados do PIX
        pixKey: '',
        // Dados do boleto
        fullName: '',
        address: '',
        city: '',
        state: '',
        zipCode: ''
    });

    const price = isAnnual ? planByIdMap[selectedPlan]?.annualPrice : planByIdMap[selectedPlan]?.monthlyPrice;
    const [ real, cents ] = typeof price === 'number' ? price.toFixed(2).replace('.', ',').split(',') : ['0', '00'];

    useEffect(() => {
        if (!selectedPlan) {
            navigate('/register');
        }
    }, [selectedPlan, navigate]);

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const formatCardNumber = (value: string) => {
        const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
        const matches = v.match(/\d{4,16}/g);
        const match = matches && matches[0] || '';
        const parts = [];
        for (let i = 0, len = match.length; i < len; i += 4) {
            parts.push(match.substring(i, i + 4));
        }
        if (parts.length) {
            return parts.join(' ');
        } else {
            return v;
        }
    };

    const formatExpiryDate = (value: string) => {
        const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
        if (v.length >= 2) {
            return v.substring(0, 2) + '/' + v.substring(2, 4);
        }
        return v;
    };

    const formatCPF = (value: string) => {
        const v = value.replace(/\D/g, '');
        if (v.length <= 11) {
            return v.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
        }
        return v;
    };

    const formatZipCode = (value: string) => {
        const v = value.replace(/\D/g, '');
        if (v.length <= 8) {
            return v.replace(/(\d{5})(\d{3})/, '$1-$2');
        }
        return v;
    };

    const handleProcessPayment = async () => {
        setLoading(true);
        
        try {
            let response = await HttpClient.getDefault().post('/subscriptions/' + subscriptionId + '/payment', {
                paymentMethod: paymentMethod,
                paymentData: formData
            });
            
            let successMessage = '';
            switch (paymentMethod) {
                case 'credit_card':
                case 'debit_card':
                    successMessage = 'Pagamento processado com sucesso! Sua assinatura foi ativada.';
                    break;
                case 'pix':
                    if (response && typeof response === 'object' && 'data' in response && response.data && typeof response.data === 'object' && 'url' in response.data) {
                        window.open(response.data.url as string, '_self');
                    }
                    successMessage = 'PIX gerado com sucesso! Complete o pagamento para ativar sua assinatura.';
                    break;
                case 'boleto':
                    successMessage = 'Boleto gerado com sucesso! Pague até a data de vencimento para ativar sua assinatura.';
                    break;
            }
            
            toast({
                title: 'Sucesso!',
                description: successMessage,
            });
            
            // Redireciona para o dashboard após 2 segundos
            setTimeout(() => {
                navigate('/dashboard');
            }, 2000);
            
        } catch (error) {
            toast({
                title: 'Erro no pagamento',
                description: 'Não foi possível processar o pagamento. Tente novamente.',
                variant: 'destructive'
            });
        } finally {
            setLoading(false);
        }
    };

    const renderPaymentForm = () => {
        switch (paymentMethod) {
            case 'credit_card':
            case 'debit_card':
                return (
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="cardNumber">Número do Cartão</Label>
                            <Input
                                id="cardNumber"
                                placeholder="1234 5678 9012 3456"
                                value={formData.cardNumber}
                                onChange={(e) => handleInputChange('cardNumber', formatCardNumber(e.target.value))}
                                maxLength={19}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="expiryDate">Validade</Label>
                                <Input
                                    id="expiryDate"
                                    placeholder="MM/AA"
                                    value={formData.expiryDate}
                                    onChange={(e) => handleInputChange('expiryDate', formatExpiryDate(e.target.value))}
                                    maxLength={5}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="cvv">CVV</Label>
                                <Input
                                    id="cvv"
                                    placeholder="123"
                                    value={formData.cvv}
                                    onChange={(e) => handleInputChange('cvv', e.target.value.replace(/\D/g, ''))}
                                    maxLength={4}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="holderName">Nome no Cartão</Label>
                            <Input
                                id="holderName"
                                placeholder="João Silva"
                                value={formData.holderName}
                                onChange={(e) => handleInputChange('holderName', e.target.value)}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="cpf">CPF</Label>
                            <Input
                                id="cpf"
                                placeholder="000.000.000-00"
                                value={formData.cpf}
                                onChange={(e) => handleInputChange('cpf', formatCPF(e.target.value))}
                                maxLength={14}
                            />
                        </div>
                    </div>
                );

            case 'pix':
                return (
                    <div className="space-y-4">
                        <div className="text-center p-6 bg-gray-50 rounded-lg">
                            <QrCode className="h-24 w-24 mx-auto mb-4 text-zapPurple-600" />
                            <h3 className="text-lg font-semibold mb-2">Pagamento via PIX</h3>
                            <p className="text-gray-600 mb-4">
                                Escaneie o QR Code abaixo ou copie a chave PIX para realizar o pagamento
                            </p>
                            <div className="bg-white p-4 rounded border border-dashed border-gray-300">
                                <p className="text-sm text-gray-500 mb-2">Chave PIX:</p>
                                <p className="font-mono text-sm break-all">
                                    zapbless.pagamentos@exemplo.com.br
                                </p>
                                <Button variant="outline" size="sm" className="mt-2">
                                    Copiar Chave PIX
                                </Button>
                            </div>
                            <p className="text-xs text-gray-500 mt-4">
                                Valor: R$ {price?.toFixed(2).replace('.', ',')}
                            </p>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="cpf">CPF do Pagador</Label>
                            <Input
                                id="cpf"
                                placeholder="000.000.000-00"
                                value={formData.cpf}
                                onChange={(e) => handleInputChange('cpf', formatCPF(e.target.value))}
                                maxLength={14}
                            />
                        </div>
                    </div>
                );

            case 'boleto':
                return (
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="fullName">Nome Completo</Label>
                            <Input
                                id="fullName"
                                placeholder="João Silva Santos"
                                value={formData.fullName}
                                onChange={(e) => handleInputChange('fullName', e.target.value)}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="cpf">CPF</Label>
                            <Input
                                id="cpf"
                                placeholder="000.000.000-00"
                                value={formData.cpf}
                                onChange={(e) => handleInputChange('cpf', formatCPF(e.target.value))}
                                maxLength={14}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="address">Endereço Completo</Label>
                            <Input
                                id="address"
                                placeholder="Rua das Flores, 123, Apt 45"
                                value={formData.address}
                                onChange={(e) => handleInputChange('address', e.target.value)}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="city">Cidade</Label>
                                <Input
                                    id="city"
                                    placeholder="São Paulo"
                                    value={formData.city}
                                    onChange={(e) => handleInputChange('city', e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="state">Estado</Label>
                                <Input
                                    id="state"
                                    placeholder="SP"
                                    value={formData.state}
                                    onChange={(e) => handleInputChange('state', e.target.value)}
                                    maxLength={2}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="zipCode">CEP</Label>
                            <Input
                                id="zipCode"
                                placeholder="00000-000"
                                value={formData.zipCode}
                                onChange={(e) => handleInputChange('zipCode', formatZipCode(e.target.value))}
                                maxLength={9}
                            />
                        </div>

                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                            <div className="flex items-center gap-2 text-yellow-800 mb-2">
                                <FileText className="h-4 w-4" />
                                <span className="font-medium">Informações do Boleto</span>
                            </div>
                            <p className="text-sm text-yellow-700">
                                O boleto será gerado após a confirmação dos dados e terá vencimento em 3 dias úteis.
                                Você receberá o boleto por email para impressão.
                            </p>
                        </div>
                    </div>
                );

            default:
                return null;
        }
    };

    if (!selectedPlan) {
        return null;
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-zapBlue-50 to-zapPurple-50 py-12 px-4">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold">
                        <span className="text-zapBlue-600">Zap</span>
                        <span className="text-zapPurple-600">Bless</span>
                    </h1>
                    <p className="text-gray-600 mt-2">Finalize sua assinatura</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Resumo do Pedido */}
                    <Card className="shadow-lg border-0">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Check className="h-5 w-5 text-green-600" />
                                Resumo do Pedido
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                                <div>
                                    <h3 className="font-semibold">Plano {planByIdMap[selectedPlan]?.name}</h3>
                                    <p className="text-sm text-gray-600">
                                        {isAnnual ? 'Pagamento anual' : 'Pagamento mensal'}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="text-2xl font-bold text-zapPurple-600">
                                        <span className="text-sm">R$</span>
                                        <span className="text-2xl font-bold text-zapPurple-600">
                                            {real}
                                        </span>
                                        <span className="text-sm text-zapPurple-600">
                                            ,{cents}
                                        </span>
                                    </p>
                                    <p className="text-sm text-gray-600">
                                        {isAnnual ? '/ano' : '/mês'}
                                    </p>
                                </div>
                            </div>
                            
                            {isAnnual && (
                                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                                    <p className="text-green-800 text-sm font-medium">
                                        🎉 Você economiza R$ {((planByIdMap[selectedPlan]?.monthlyPrice * 12) - planByIdMap[selectedPlan]?.annualPrice).toFixed(2).replace('.', ',')} por ano!
                                    </p>
                                </div>
                            )}

                            <div className="space-y-2 pt-4 border-t">
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <Lock className="h-4 w-4" />
                                    Pagamento 100% seguro
                                </div>
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <Check className="h-4 w-4" />
                                    Cancele a qualquer momento
                                </div>
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <Check className="h-4 w-4" />
                                    Suporte prioritário
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Formulário de Pagamento */}
                    <Card className="shadow-lg border-0">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Banknote className="h-5 w-5 text-zapBlue-600" />
                                Forma de Pagamento
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {/* Seleção do método de pagamento */}
                            <div className="space-y-3">
                                <Label>Escolha a forma de pagamento:</Label>
                                <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                                    <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50">
                                        <RadioGroupItem value="credit_card" id="credit_card" />
                                        <CreditCard className="h-5 w-5 text-gray-600" />
                                        <Label htmlFor="credit_card" className="flex-1 cursor-pointer">
                                            Cartão de Crédito
                                        </Label>
                                    </div>
                                    {/* <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50">
                                        <RadioGroupItem value="debit_card" id="debit_card" />
                                        <CreditCard className="h-5 w-5 text-gray-600" />
                                        <Label htmlFor="debit_card" className="flex-1 cursor-pointer">
                                            Cartão de Débito
                                        </Label>
                                    </div> */}
                                    {/* <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50">
                                        <RadioGroupItem value="pix" id="pix" />
                                        <QrCode className="h-5 w-5 text-gray-600" />
                                        <Label htmlFor="pix" className="flex-1 cursor-pointer">
                                            PIX
                                        </Label>
                                    </div> */}
                                    {/* <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50">
                                        <RadioGroupItem value="boleto" id="boleto" />
                                        <FileText className="h-5 w-5 text-gray-600" />
                                        <Label htmlFor="boleto" className="flex-1 cursor-pointer">
                                            Boleto Bancário
                                        </Label>
                                    </div> */}
                                </RadioGroup>
                            </div>

                            {/* Formulário específico do método de pagamento */}
                            {renderPaymentForm()}

                            <Button
                                onClick={handleProcessPayment}
                                disabled={loading}
                                className="w-full bg-gradient-to-r from-zapBlue-600 to-zapPurple-600 hover:from-zapBlue-700 hover:to-zapPurple-700 text-white font-semibold py-3"
                            >
                                {loading ? 'Processando...' : 
                                 paymentMethod === 'pix' ? 'Gerar PIX' :
                                 paymentMethod === 'boleto' ? 'Gerar Boleto' :
                                 `Pagar R$ ${price?.toFixed(2).replace('.', ',')}`}
                            </Button>

                            <p className="text-xs text-gray-500 text-center">
                                Ao continuar, você concorda com nossos{' '}
                                <a href="/termos-de-servico" className="text-zapBlue-600 hover:underline">
                                    Termos de Serviço
                                </a>{' '}
                                e{' '}
                                <a href="/politica-de-privacidade" className="text-zapBlue-600 hover:underline">
                                    Política de Privacidade
                                </a>
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default Pagamento;

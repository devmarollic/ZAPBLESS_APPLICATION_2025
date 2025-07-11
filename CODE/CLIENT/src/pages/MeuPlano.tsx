import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { usePlanContext } from '@/context/PlanContext';
import { CreditCard, Calendar, Download, RefreshCw, Crown, Check, Loader2 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { HttpClient } from '@/lib/http_client';

type SubscriptionOverview = {
    currentPlan: {
        id: string;
        planId: string;
        planName: string;
        description: string;
        status: string;
        statusLabel: string;
        type: string;
        typeLabel: string;
        period: string;
        periodLabel: string;
        currentAmount: number;
        currency: string;
        startDate: string;
        expiresAt: string;
        paymentMethod: string;
        paymentMethodLabel: string;
        isActive: boolean;
        featureArray: string[];
    };
    nextBilling: {
        date: string;
        amount: number;
        currency: string;
        planName: string;
        period: string;
        periodLabel: string;
        description: string;
        paymentMethod: string;
        paymentMethodLabel: string;
    };
    invoiceHistory: {
        invoiceArray: {
            id: string;
            date: string;
            amount: number;
            status: string;
            currency: string;
            period: string;
            periodLabel: string;
            planName: string;
            paymentMethod: string;
            paymentMethodLabel: string;
            paymentGatewayId: string;
            isCurrentInvoice: boolean;
            description: string;
        }[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            pageCount: number;
        };
    };
}

const mockUpcomingCharges = [
    {
        date: '2024-02-15',
        amount: 29.90,
        description: 'Plano Premium - Fevereiro 2024'
    }
];

const MeuPlano = () => {
    const { toast } = useToast();
    const { planByIdMap, selectedPlan } = usePlanContext();
    const [subscriptionDetails, setSubscriptionDetails] = useState({
        plan: 'Premium',
        status: 'active',
        nextBilling: '2024-02-15',
        price: 29.90,
        features: [
            'Até 500 membros',
            'Mensagens ilimitadas',
            'Relatórios avançados',
            'Suporte prioritário',
            'Backup automático'
        ]
    });
    const { data: subscriptionOverview, isLoading: isLoadingSubscriptionOverview, refetch: handleRefreshSubscription, isRefetching: isRefetchingSubscriptionOverview } = useQuery({
        queryKey: ['subscriptions'],
        queryFn: async () => {
            return await HttpClient.getDefault().get<SubscriptionOverview>('/subscriptions/church/overview');
        }
    });

    const handleManageSubscription = () => {
        toast({
            title: 'Redirecionando...',
            description: 'Você será redirecionado para gerenciar sua assinatura.',
        });
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'Pago':
                return <Badge className="bg-green-100 text-green-800">Ativo</Badge>;
            case 'Cancelado':
                return <Badge variant="destructive">Cancelado</Badge>;
            case 'Pendente':
                return <Badge className="bg-yellow-100 text-yellow-800">Pendente</Badge>;
            case 'Recusado':
                return <Badge className="bg-red-100 text-red-800">Recusado</Badge>;
            default:
                return <Badge variant="secondary">{status}</Badge>;
        }
    };

    const handleSendInvoice = async (invoiceId: string) => {
        try {
            await HttpClient.getDefault().post(`/subscriptions/${invoiceId}/invoice-report`, {});

            toast({
                title: 'Fatura enviada',
                description: 'Fatura enviada com sucesso. Verifique sua caixa de entrada.',
            });
        } catch (error) {
            toast({
                title: 'Erro ao enviar fatura',
                description: 'Ocorreu um erro ao enviar a fatura. Por favor, tente novamente.',
            });
        }
    };

    const getInvoiceStatusBadge = (status: string) => {
        switch (status) {
            case 'paid':
                return <Badge className="bg-green-100 text-green-800">Pago</Badge>;
            case 'pending':
                return <Badge className="bg-yellow-100 text-yellow-800">Pendente</Badge>;
            case 'failed':
                return <Badge variant="destructive">Falhou</Badge>;
            default:
                return <Badge variant="secondary">{status}</Badge>;
        }
    };

    return (
        <div className="md:container mx-auto py-6 space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">Meu Plano</h1>
                <Button
                    onClick={() => handleRefreshSubscription()}
                    disabled={isRefetchingSubscriptionOverview}
                    variant="outline"
                >
                    <RefreshCw className={`mr-2 h-4 w-4 ${isRefetchingSubscriptionOverview ? 'animate-spin' : ''}`} />
                    Atualizar Status
                </Button>
            </div>

            {/* Detalhes do Plano Atual */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center">
                        <Crown className="mr-2 h-5 w-5 text-yellow-500" />
                        Plano Atual
                    </CardTitle>
                    <CardDescription>
                        Detalhes da sua assinatura ativa
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <span className="text-sm font-medium text-gray-600">Plano:</span>
                                <span className="text-lg font-bold">{subscriptionOverview?.currentPlan.planName}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm font-medium text-gray-600">Status:</span>
                                {getStatusBadge(subscriptionOverview?.currentPlan.statusLabel)}
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm font-medium text-gray-600">Próxima cobrança:</span>
                                <span className="text-sm">{new Date(subscriptionOverview?.currentPlan.expiresAt).toLocaleDateString('pt-BR')}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm font-medium text-gray-600">Valor mensal:</span>
                                <span className="text-lg font-bold text-zapPurple-600">
                                    {subscriptionOverview?.currentPlan?.currency &&
                                        new Intl.NumberFormat('pt-BR', { style: 'currency', currency: subscriptionOverview?.currentPlan?.currency }).format(subscriptionOverview?.currentPlan?.currentAmount)
                                    }
                                </span>
                            </div>
                        </div>

                        <div>
                            <h4 className="font-medium text-gray-900 mb-3">Recursos incluídos:</h4>
                            <ul className="space-y-2">
                                {subscriptionOverview?.currentPlan.featureArray.map((feature, index) => (
                                    <li key={index} className="flex items-center text-sm">
                                        <Check className="mr-2 h-4 w-4 text-green-500" />
                                        {feature}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    <Separator className="my-6" />

                    <div className="flex flex-col sm:flex-row gap-4">
                        <Button onClick={handleManageSubscription} className="flex-1">
                            <CreditCard className="mr-2 h-4 w-4" />
                            Gerenciar Assinatura
                        </Button>
                        <Button variant="outline" className="flex-1">
                            <Calendar className="mr-2 h-4 w-4" />
                            Alterar Plano
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Próximas Cobranças */}
            <Card>
                <CardHeader>
                    <CardTitle>Próximas Cobranças</CardTitle>
                    <CardDescription>
                        Cobranças programadas para sua assinatura
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-3">
                        {subscriptionOverview?.nextBilling && (
                            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                <div>
                                    <p className="font-medium">{subscriptionOverview?.nextBilling?.description}</p>
                                    <p className="text-sm text-gray-600">
                                        {new Date(subscriptionOverview?.nextBilling?.date).toLocaleDateString('pt-BR')}
                                    </p>
                                </div>
                                <span className="font-bold text-zapPurple-600">
                                    {subscriptionOverview?.nextBilling?.amount.toLocaleString('pt-BR', { style: 'currency', currency: subscriptionOverview?.nextBilling.currency })}
                                </span>
                            </div>
                        )}
                        { !subscriptionOverview?.nextBilling && (
                            <div className="flex justify-center items-center p-3 bg-gray-50 rounded-lg">
                                <p className="text-sm text-gray-600">Nenhuma cobrança programada</p>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Histórico de Faturas */}
            <Card>
                <CardHeader>
                    <CardTitle>Histórico de Faturas</CardTitle>
                    <CardDescription>
                        Suas faturas anteriores e seus status de pagamento
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Data</TableHead>
                                <TableHead>Descrição</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Valor</TableHead>
                                <TableHead>Ações</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isLoadingSubscriptionOverview && (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center">
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                    </TableCell>
                                </TableRow>
                            )}

                            {!isLoadingSubscriptionOverview && subscriptionOverview?.invoiceHistory?.invoiceArray.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center">
                                        <p>Nenhuma fatura encontrada</p>
                                    </TableCell>
                                </TableRow>
                            )}

                            {!isLoadingSubscriptionOverview && subscriptionOverview?.invoiceHistory?.invoiceArray.length > 0 && subscriptionOverview?.invoiceHistory?.invoiceArray.map((invoice) => (
                                <TableRow key={invoice.id}>
                                    <TableCell>
                                        {new Date(invoice.date).toLocaleDateString('pt-BR')}
                                    </TableCell>
                                    <TableCell>{invoice.description}</TableCell>
                                    <TableCell>
                                        {getInvoiceStatusBadge(invoice.status)}
                                    </TableCell>
                                    <TableCell className="font-medium">
                                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: invoice.currency }).format(invoice.amount)}
                                    </TableCell>
                                    <TableCell>
                                        <Button variant="ghost" size="sm" onClick={() => handleSendInvoice(invoice.id)}>
                                            <Download className="h-4 w-4" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
};

export default MeuPlano;

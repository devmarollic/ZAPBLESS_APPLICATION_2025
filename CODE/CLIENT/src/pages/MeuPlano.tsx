
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { usePlanContext } from '@/context/PlanContext';
import { CreditCard, Calendar, Download, RefreshCw, Crown, Check } from 'lucide-react';

const mockInvoices = [
    {
        id: 'inv_001',
        date: '2024-01-15',
        amount: 29.90,
        status: 'paid',
        description: 'Plano Premium - Janeiro 2024',
        downloadUrl: '#'
    },
    {
        id: 'inv_002',
        date: '2023-12-15',
        amount: 29.90,
        status: 'paid',
        description: 'Plano Premium - Dezembro 2023',
        downloadUrl: '#'
    },
    {
        id: 'inv_003',
        date: '2023-11-15',
        amount: 29.90,
        status: 'paid',
        description: 'Plano Premium - Novembro 2023',
        downloadUrl: '#'
    }
];

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
    const [isLoading, setIsLoading] = useState(false);
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

    const handleRefreshSubscription = async () => {
        setIsLoading(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 1000));
            toast({
                title: 'Status atualizado',
                description: 'As informações da sua assinatura foram atualizadas.',
            });
        } catch (error) {
            toast({
                title: 'Erro ao atualizar',
                description: 'Não foi possível atualizar o status da assinatura.',
                variant: 'destructive',
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleManageSubscription = () => {
        toast({
            title: 'Redirecionando...',
            description: 'Você será redirecionado para gerenciar sua assinatura.',
        });
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'active':
                return <Badge className="bg-green-100 text-green-800">Ativo</Badge>;
            case 'canceled':
                return <Badge variant="destructive">Cancelado</Badge>;
            case 'past_due':
                return <Badge className="bg-yellow-100 text-yellow-800">Em atraso</Badge>;
            default:
                return <Badge variant="secondary">{status}</Badge>;
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
                    onClick={handleRefreshSubscription}
                    disabled={isLoading}
                    variant="outline"
                >
                    <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
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
                                <span className="text-lg font-bold">{subscriptionDetails.plan}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm font-medium text-gray-600">Status:</span>
                                {getStatusBadge(subscriptionDetails.status)}
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm font-medium text-gray-600">Próxima cobrança:</span>
                                <span className="text-sm">{new Date(subscriptionDetails.nextBilling).toLocaleDateString('pt-BR')}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm font-medium text-gray-600">Valor mensal:</span>
                                <span className="text-lg font-bold text-zapPurple-600">
                                    R$ {subscriptionDetails.price.toFixed(2).replace('.', ',')}
                                </span>
                            </div>
                        </div>

                        <div>
                            <h4 className="font-medium text-gray-900 mb-3">Recursos incluídos:</h4>
                            <ul className="space-y-2">
                                {subscriptionDetails.features.map((feature, index) => (
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
                        {mockUpcomingCharges.map((charge, index) => (
                            <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                <div>
                                    <p className="font-medium">{charge.description}</p>
                                    <p className="text-sm text-gray-600">
                                        {new Date(charge.date).toLocaleDateString('pt-BR')}
                                    </p>
                                </div>
                                <span className="font-bold text-zapPurple-600">
                                    R$ {charge.amount.toFixed(2).replace('.', ',')}
                                </span>
                            </div>
                        ))}
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
                            {mockInvoices.map((invoice) => (
                                <TableRow key={invoice.id}>
                                    <TableCell>
                                        {new Date(invoice.date).toLocaleDateString('pt-BR')}
                                    </TableCell>
                                    <TableCell>{invoice.description}</TableCell>
                                    <TableCell>
                                        {getInvoiceStatusBadge(invoice.status)}
                                    </TableCell>
                                    <TableCell className="font-medium">
                                        R$ {invoice.amount.toFixed(2).replace('.', ',')}
                                    </TableCell>
                                    <TableCell>
                                        <Button variant="ghost" size="sm">
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

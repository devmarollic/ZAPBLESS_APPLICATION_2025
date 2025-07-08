import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import PlanSelectionStep from '@/components/register/PlanSelectionStep';
import { usePlanContext } from '@/context/PlanContext';
import { HttpClient } from '@/lib/http_client';
import { useToast } from '@/hooks/use-toast';
import { useParams } from 'react-router-dom';

const PlanSelection = () => {
    const { email } = useParams();
    const navigate = useNavigate();
    const { toast } = useToast();
    const { selectedPlan, isAnnual, setSubscriptionId } = usePlanContext();

    const handleContinueToPayment = async () => {
        if (!selectedPlan) {
            toast({
                title: 'Selecione um plano',
                description: 'Por favor, escolha um plano para continuar',
                variant: 'destructive',
            });
            return;
        }

        try {
            const { id: subscriptionId } = await HttpClient.getDefault().post<{ id: string }>('/subscriptions/' + email + '/add', {
                planId: selectedPlan,
                billingPeriod: isAnnual ? 'annual' : 'monthly'
            });

            if (subscriptionId) {
                setSubscriptionId(subscriptionId);
            }

            navigate('/pagamento');
        } catch (error) {
            toast({
                title: 'Erro',
                description: 'Não foi possível prosseguir. Tente novamente.',
                variant: 'destructive',
            });
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        <span className="text-zapPurple-600">Zap</span>
                        <span className="text-zapBlue-600">Bless</span>
                    </h1>
                    <p className="text-lg text-gray-600">
                        Para continuar, selecione um plano de assinatura
                    </p>
                </div>

                <div className="bg-white rounded-lg shadow-lg p-6 md:p-8">
                    <PlanSelectionStep />

                    <div className="mt-8 flex justify-center">
                        <Button
                            onClick={handleContinueToPayment}
                            disabled={!selectedPlan}
                            className="bg-gradient-to-r from-zapBlue-600 to-zapPurple-600 hover:from-zapBlue-700 hover:to-zapPurple-700 rounded-full px-8 py-3 text-lg"
                        >
                            Continuar para Pagamento
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PlanSelection;

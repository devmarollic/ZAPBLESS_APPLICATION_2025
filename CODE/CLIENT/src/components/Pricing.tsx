
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Check, TrendingUp } from 'lucide-react';
import { PlanOption } from './register/PlanSelectionStep';
import { usePlan } from '@/hooks/use-plan';
import { useNavigate } from 'react-router-dom';

const Pricing = () => {
    const [isAnnual, setIsAnnual] = useState(true);
    const { plans, isLoading, setSelectedPlan } = usePlan();
    const navigate = useNavigate();

    const planBorderColorByIndexMap =
    {
        0: 'border-zapBlue-200 hover:border-zapBlue-400',
        1: 'border-zapPurple-300 hover:border-zapPurple-500',
        2: 'border-zapGold-200 hover:border-zapGold-400'
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
            minimumFractionDigits: 2
        }).format(price);
    };

    const calculateMonthlyFromAnnual = (annualPrice: number) => {
        return annualPrice / 12;
    };

    const calculateSavings = (monthlyPrice: number, annualPrice: number) => {
        const annualMonthly = annualPrice / 12;
        const savings = ((monthlyPrice - annualMonthly) / monthlyPrice) * 100;
        return Math.round(savings);
    };

    const handlePlanClick = (planId: string) => {
        setSelectedPlan(planId);
        navigate(`/register`);
    };

    return (
        <section id="pricing" className="section bg-white">
            <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                    Escolha o plano ideal para sua igreja
                </h2>
                <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-8">
                    Temos opções para igrejas de todos os tamanhos, com planos flexíveis que crescem junto com sua comunidade.
                </p>

                <div className="inline-flex items-center p-1 bg-gray-100 rounded-full mb-8">
                    <button
                        className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${isAnnual ? "bg-white shadow-sm" : "text-gray-500"
                            }`}
                        onClick={() => setIsAnnual(true)}
                    >
                        Anual <span className="text-zapPurple-600 font-semibold">(Economize até 15%)</span>
                    </button>
                    <button
                        className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${!isAnnual ? "bg-white shadow-sm" : "text-gray-500"
                            }`}
                        onClick={() => setIsAnnual(false)}
                    >
                        Mensal
                    </button>
                </div>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                {plans.map((plan, index) => (
                    <div
                        key={index}
                        className={`bg-white rounded-xl border-2 ${planBorderColorByIndexMap[index]} p-6 md:p-8 transition-all ${plan.isPromoted ? "md:-translate-y-4 shadow-xl" : "shadow-sm"
                            } relative flex flex-col h-full`}
                    >
                        {plan.isPromoted && (
                            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-zapBlue-600 to-zapPurple-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                                Mais Popular
                            </div>
                        )}
                        <div className="flex-1">
                            <div className="text-center mb-8">
                                <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                                <p className="text-gray-500 mb-6">{plan.description}</p>

                                {/* Preço Principal */}
                                <div className="mb-4">
                                    {isAnnual ? (
                                        <div className="space-y-2">
                                            {/* Preço Original Riscado */}
                                            <div className="text-lg text-gray-400 line-through">
                                                {formatPrice(plan.monthlyPrice)}/mês
                                            </div>

                                            {/* Preço com Desconto */}
                                            <div className="flex items-baseline justify-center gap-1">
                                                <span className="text-sm text-gray-600">R$</span>
                                                <span className="text-5xl font-bold text-gray-900">
                                                    {Math.round(calculateMonthlyFromAnnual(plan.annualPrice))}
                                                </span>
                                                <span className="text-lg text-gray-600 font-medium">/mês</span>
                                            </div>

                                            {/* Badge de Economia */}
                                            <div className="inline-flex items-center gap-1 bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold">
                                                <TrendingUp className="w-3 h-3" />
                                                Economize {calculateSavings(plan.monthlyPrice, plan.annualPrice)}%
                                            </div>

                                            {/* Valor Total Anual */}
                                            <div className="text-sm text-gray-500 mt-2">
                                                Cobrança anual de <span className="font-semibold text-gray-700">{formatPrice(plan.annualPrice)}</span>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="space-y-2">
                                            <div className="flex items-baseline justify-center gap-1">
                                                <span className="text-sm text-gray-600">R$</span>
                                                <span className="text-5xl font-bold text-gray-900">
                                                    {plan.monthlyPrice}
                                                </span>
                                                <span className="text-lg text-gray-600 font-medium">/mês</span>
                                            </div>

                                            {/* Preço Anual Equivalente */}
                                            <div className="text-sm text-gray-500">
                                                ou {formatPrice(plan.annualPrice)} por ano
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Indicador de Valor */}
                                {isAnnual && (
                                    <div className="bg-gradient-to-r from-zapPurple-50 to-zapBlue-50 border border-zapPurple-200 rounded-lg p-3 mb-4">
                                        <div className="text-xs text-zapPurple-700 font-medium">
                                            🎯 Melhor custo-benefício
                                        </div>
                                        <div className="text-sm text-zapPurple-600 mt-1">
                                            Você economiza {formatPrice((plan.monthlyPrice * 12) - plan.annualPrice)} por ano
                                        </div>
                                    </div>
                                )}
                            </div>

                            <ul className="space-y-3">
                                {plan.featureArray.map((feature, i) => (
                                    <li key={i} className="flex items-start gap-2">
                                        <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                                        <span>{feature}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <Button
                            onClick={() => handlePlanClick(plan.id)}
                            className={`w-full rounded-full mt-8 ${index !== (plans.length - 1) ? 'bg-gradient-to-r from-zapBlue-600 to-zapPurple-600 hover:from-zapBlue-700 hover:to-zapPurple-700' : 'bg-zapGold-600 hover:bg-zapGold-700'} py-6 text-white font-semibold text-lg`}
                        >
                            {isAnnual ? 'Economizar Agora' : 'Comece Agora'}
                        </Button>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default Pricing;

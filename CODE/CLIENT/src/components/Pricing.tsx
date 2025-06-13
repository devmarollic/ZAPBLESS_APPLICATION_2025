import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';
import { PlanOption } from './register/PlanSelectionStep';
import { usePlan } from '@/hooks/use-plan';

const Pricing = () => {
    const [isAnnual, setIsAnnual] = useState(true);
    const { plans, isLoading } = usePlan();

    const planBorderColorByIndexMap =
    {
        0: 'border-zapBlue-200 hover:border-zapBlue-400',
        1: 'border-zapPurple-300 hover:border-zapPurple-500',
        2: 'border-zapGold-200 hover:border-zapGold-400'
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
                        Anual <span className="text-zapPurple-600">(Economize 15%)</span>
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
                        className={`bg-white rounded-xl border-2 ${ planBorderColorByIndexMap[index] } p-6 md:p-8 transition-all ${plan.isPromoted ? "md:-translate-y-4 shadow-xl" : "shadow-sm"
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
                                <p className="text-gray-500 mb-4">{plan.description}</p>
                                <div className="text-4xl font-bold">
                                    R${isAnnual ? plan.annualPrice : plan.monthlyPrice}
                                    <span className="text-lg text-gray-500 font-normal">
                                        /mês
                                    </span>
                                </div>
                                {isAnnual && (
                                    <div className="text-sm text-zapPurple-600 mt-1">
                                        Cobrança anual de R${plan.annualPrice * 12}
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
                            className={`w-full rounded-full mt-8 ${ index !== ( plans.length - 1 ) ? 'bg-gradient-to-r from-zapBlue-600 to-zapPurple-600 hover:from-zapBlue-700 hover:to-zapPurple-700' : 'bg-zapGold-600 hover:bg-zapGold-700' } py-6 text-white`}
                        >
                            Comece Agora
                        </Button>
                    </div>
                ))}
            </div>

            <div className="mt-12 text-center text-gray-500">
                <p>
                    Todos os planos incluem período de teste gratuito de 14 dias.
                    <br />
                    Não é necessário cartão de crédito.
                </p>
            </div>
        </section>
    );
};

export default Pricing;

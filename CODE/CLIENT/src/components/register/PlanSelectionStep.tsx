
import { useState } from 'react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Check, TrendingUp } from 'lucide-react';
import { usePlanContext } from '@/context/PlanContext';

export type PlanOption = {
    id: string;
    name: string;
    description: string;
    price: number;
    annualPrice: number;
    monthlyPrice: number;
    featureArray: string[];
    color: string;
    isPromoted: boolean;
};

const PlanSelectionStep = () => {
    const { plans, isLoading, setSelectedPlan, setIsAnnual, selectedPlan, isAnnual } = usePlanContext();

    if (isLoading) {
        return <div>Loading...</div>;
    }
    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
            minimumFractionDigits: 2
        }).format(price);
    };
    const calculateSavings = (monthlyPrice: number, annualPrice: number) => {
        const annualMonthly = annualPrice / 12;
        const savings = ((monthlyPrice - annualMonthly) / monthlyPrice) * 100;
        return Math.round(savings);
    };
    const calculateMonthlyFromAnnual = (annualPrice: number) => {
        return annualPrice / 12;
    };
    return (
        <div className="space-y-6">
            <h2 className="text-xl font-semibold text-center mb-6">
                Escolha seu plano
            </h2>

            <div className="inline-flex items-center p-1 bg-gray-100 rounded-full mx-auto mb-8 w-auto">
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

            <RadioGroup value={selectedPlan} onValueChange={setSelectedPlan} className="grid md:grid-cols-3 gap-4">
                {plans.map((plan) => (
                    <div
                        key={plan.id}
                        className={`relative ${selectedPlan === plan.id
                            ? "ring-2 ring-zapPurple-500"
                            : "ring-1 ring-transparent"
                            }`}
                    >
                        <RadioGroupItem
                            value={plan.id}
                            id={plan.id}
                            className="sr-only"
                        />
                        <Label
                            htmlFor={plan.id}
                            className={`block cursor-pointer rounded-xl border-2 ${plan.color} p-6 transition-all shadow-sm hover:shadow-md ${plan.isPromoted ? "md:-translate-y-1" : ""
                                } relative h-full`}
                        >
                            {plan.isPromoted && (
                                <div className="text-center absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-zapBlue-600 to-zapPurple-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                                    Mais Popular
                                </div>
                            )}
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
                            </div>

                            <ul className="space-y-2 text-sm">
                                {plan.featureArray.map((feature, i) => (
                                    <li key={i} className="flex items-start gap-1.5">
                                        <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                                        <span>{feature}</span>
                                    </li>
                                ))}
                            </ul>

                            {selectedPlan === plan.id && (
                                <div className="absolute top-3 right-3">
                                    <div className="w-5 h-5 rounded-full bg-zapPurple-600 flex items-center justify-center">
                                        <Check className="h-3 w-3 text-white" />
                                    </div>
                                </div>
                            )}
                        </Label>
                    </div>
                ))}
            </RadioGroup>

            <div className="mt-4 text-center text-gray-500 text-sm">
                <p>Todos os planos incluem período de teste gratuito de 14 dias.</p>
            </div>
        </div>
    );
};

export default PlanSelectionStep;

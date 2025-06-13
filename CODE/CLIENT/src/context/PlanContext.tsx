import { usePlan } from '@/hooks/use-plan';
import { createContext, useContext } from 'react';

export const PlanContext = createContext({
    plans: [],
    isLoading: true,
    planByIdMap: {},
    selectedPlan: null,
    setSelectedPlan: (plan: any) => {},
    isAnnual: true,
    setIsAnnual: (isAnnual: boolean) => {},
    subscriptionId: null as string | null,
    setSubscriptionId: (subscriptionId: string | null) => {}
});

export function PlanProvider({ children }: { children: React.ReactNode }) {
    const { plans, isLoading, planByIdMap, selectedPlan, setSelectedPlan, isAnnual, setIsAnnual, subscriptionId, setSubscriptionId } = usePlan();
    return (
        <PlanContext.Provider value={{ 
            plans, 
            isLoading, 
            planByIdMap, 
            selectedPlan, 
            setSelectedPlan, 
            isAnnual, 
            setIsAnnual, 
            subscriptionId, 
            setSubscriptionId
        }}>
            {children}
        </PlanContext.Provider>
    );
}

export const usePlanContext = () => {
    return useContext(PlanContext);
};

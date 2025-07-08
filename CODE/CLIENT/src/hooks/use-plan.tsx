import { useState, useEffect, useReducer } from 'react';
import { HttpClient } from '@/lib/http_client';
import { PlanOption } from '@/components/register/PlanSelectionStep';
import { getMap } from '@/lib/utils';

function reducer(state, action) {
    if (action.type === 'FETCH_PLANS_SUCCESS') {
        return action.payload;
    }
};

export function usePlan() {
    const [isLoading, setIsLoading] = useState(true);
    const [selectedPlan, setSelectedPlan] = useState( null );
    const [plans, dispatch] = useReducer(reducer, []);
    const [planByIdMap, setPlanByIdMap] = useState<Record<string, PlanOption>>({});
    const [isAnnual, setIsAnnual] = useState<boolean>(true);
    const [subscriptionId, setSubscriptionId] = useState<string | null>(null);

    useEffect(() => {
        async function fetchPlans() {
            try {
                setIsLoading(true);
                const data = await HttpClient.getDefault().get<PlanOption[]>('/plan/list');
                dispatch({ type: 'FETCH_PLANS_SUCCESS', payload: data });
                setPlanByIdMap(getMap(data, 'id'));
            } catch (error) {
                console.error(error);
            } finally {
                setIsLoading(false);
            }
        }
        fetchPlans();
    }, []);

    return {
        plans,
        isLoading,
        planByIdMap,
        selectedPlan,
        setSelectedPlan,
        isAnnual,
        setIsAnnual,
        subscriptionId,
        setSubscriptionId
    };
}

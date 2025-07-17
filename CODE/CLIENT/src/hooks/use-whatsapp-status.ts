import { useState, useEffect, useCallback } from 'react';
import { WhatsAppContainerService, WhatsAppStatus } from '@/lib/whatsapp_container_service';

export const useWhatsAppStatus = (pollingInterval: number = 5000) => {
    const [status, setStatus] = useState<WhatsAppStatus | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isPolling, setIsPolling] = useState(false);

    // Função para obter status
    const fetchStatus = useCallback(async () => {
        if (!WhatsAppContainerService.isContainerActive()) {
            return;
        }

        try {
            setIsLoading(true);
            setError(null);
            const response = await WhatsAppContainerService.getStatus();
            setStatus(response);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Erro ao obter status');
            console.error('Erro ao obter status do WhatsApp:', err);
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Função para iniciar polling
    const startPolling = useCallback(() => {
        setIsPolling(true);
    }, []);

    // Função para parar polling
    const stopPolling = useCallback(() => {
        setIsPolling(false);
    }, []);

    // Função para iniciar container e começar polling
    const startContainer = useCallback(async () => {
        try {
            setIsLoading(true);
            setError(null);
            
            await WhatsAppContainerService.startContainer();
            await fetchStatus();
            startPolling();
            
            return true;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Erro ao iniciar container');
            console.error('Erro ao iniciar container:', err);
            return false;
        } finally {
            setIsLoading(false);
        }
    }, [fetchStatus, startPolling]);

    // Função para desconectar
    const disconnect = useCallback(async () => {
        try {
            setIsLoading(true);
            setError(null);
            
            await WhatsAppContainerService.disconnect();
            await fetchStatus();
            
            return true;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Erro ao desconectar');
            console.error('Erro ao desconectar WhatsApp:', err);
            return false;
        } finally {
            setIsLoading(false);
        }
    }, [fetchStatus]);

    // Função para limpar container
    const clearContainer = useCallback(() => {
        WhatsAppContainerService.clearContainerUrl();
        setStatus(null);
        setError(null);
        stopPolling();
    }, [stopPolling]);

    // Polling automático
    useEffect(() => {
        if (!isPolling || !WhatsAppContainerService.isContainerActive()) {
            return;
        }

        const interval = setInterval(() => {
            fetchStatus();
        }, pollingInterval);

        return () => clearInterval(interval);
    }, [isPolling, pollingInterval, fetchStatus]);

    // Verificar se container está ativo ao montar
    useEffect(() => {
        if (WhatsAppContainerService.isContainerActive()) {
            fetchStatus();
            startPolling();
        }
    }, [fetchStatus, startPolling]);

    return {
        status,
        isLoading,
        error,
        isPolling,
        fetchStatus,
        startContainer,
        disconnect,
        clearContainer,
        startPolling,
        stopPolling,
        isContainerActive: WhatsAppContainerService.isContainerActive()
    };
}; 
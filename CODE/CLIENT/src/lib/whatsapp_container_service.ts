import { HttpClient } from './http_client';

export interface ContainerInfo {
    success: boolean;
    message: string;
    containerUrl: string;
    port: number;
    containerName: string;
    churchId: string;
}

export interface WhatsAppStatus {
    qrCode?: string;
    status: string;
    pairingCode?: string;
    sessionId?: string;
}

export class WhatsAppContainerService {
    private static containerUrl: string | null = null;

    // Iniciar container e obter URL
    static async startContainer(): Promise<ContainerInfo> {
        try {
            const response = await HttpClient.getDefault().post<ContainerInfo>('/docker/sync', {});
            
            if (response.success) {
                this.containerUrl = response.containerUrl;

                window.open( response.containerUrl, '_blank');

                return response;
            } else {
                throw new Error(response.message || 'Erro ao iniciar container');
            }
        } catch (error) {
            console.error('Erro ao iniciar container:', error);
            throw error;
        }
    }

    // Obter status do WhatsApp no container
    static async getStatus(): Promise<WhatsAppStatus> {
        if (!this.containerUrl) {
            throw new Error('Container não iniciado. Chame startContainer() primeiro.');
        }

        try {
            const response = await fetch(`${this.containerUrl}/status`);
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Erro ao obter status do WhatsApp:', error);
            throw error;
        }
    }

    // Iniciar sessão WhatsApp
    static async startSession(phoneNumber?: string): Promise<any> {
        if (!this.containerUrl) {
            throw new Error('Container não iniciado. Chame startContainer() primeiro.');
        }

        try {
            const body = phoneNumber ? { phoneNumber } : {};
            const response = await fetch(`${this.containerUrl}/start`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(body)
            });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Erro ao iniciar sessão WhatsApp:', error);
            throw error;
        }
    }

    // Desconectar sessão WhatsApp
    static async disconnect(): Promise<any> {
        if (!this.containerUrl) {
            throw new Error('Container não iniciado. Chame startContainer() primeiro.');
        }

        try {
            const response = await fetch(`${this.containerUrl}/disconnect`, {
                method: 'POST'
            });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Erro ao desconectar WhatsApp:', error);
            throw error;
        }
    }

    // Enviar mensagem de texto
    static async sendTextMessage(to: string, text: string): Promise<any> {
        if (!this.containerUrl) {
            throw new Error('Container não iniciado. Chame startContainer() primeiro.');
        }

        try {
            const response = await fetch(`${this.containerUrl}/send/text`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ to, text })
            });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Erro ao enviar mensagem:', error);
            throw error;
        }
    }

    // Obter URL atual do container
    static getContainerUrl(): string | null {
        return this.containerUrl;
    }

    // Limpar URL do container (útil para logout)
    static clearContainerUrl(): void {
        this.containerUrl = null;
    }

    // Verificar se container está ativo
    static isContainerActive(): boolean {
        return this.containerUrl !== null;
    }
} 
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { HttpClient } from '@/lib/http_client';
import { MessageSquare, RefreshCw, QrCode as QrCodeIcon } from 'lucide-react';
import { useWhatsApp } from '@/context/WhatsAppContext';
import QrCode from '@/components/QrCode';

const WhatsAppSync = () => {
    const { whatsapps, isLoading, syncing, setSyncing, qrCode, setQrCode, whatsapp, setIsLoading, setWhatsapp } = useWhatsApp();
    const { toast } = useToast();
    const [timer, setTimer] = useState<number>(30);
    const [qrStatus, setQrStatus] = useState<'valid' | 'invalid' | 'connecting' | 'expired'>('valid');

    const handleSyncWhatsApp = async () => {
        try {
            setSyncing(true);
            setTimer(30); // Reset timer when generating a new QR code
            setQrStatus('valid');

            let response = await HttpClient.getWhatsapp().post<{ base64: string }>('/whatsapp/sync', {});

            setQrCode(response.base64);
            setIsLoading(false);
            setSyncing(false);

            toast({
                title: 'QR Code gerado',
                description: 'Escaneie o QR code com seu WhatsApp para sincronizar.'
            });
        } catch (error) {
            toast({
                title: 'Erro ao sincronizar',
                description: 'Não foi possível gerar o QR code para WhatsApp.',
                variant: 'destructive'
            });
            console.error(error);
            setSyncing(false);
            setQrStatus('invalid');
        }
    };

    useEffect(() => {
        // Timer for QR code expiration
        if (whatsapp?.connectionStatus === 'connecting' && timer > 0) {
            const interval = setInterval(() => {
                setTimer((prevTimer) => {
                    if (prevTimer <= 1) {
                        setQrStatus('expired');
                        clearInterval(interval);
                        return 0;
                    }
                    return prevTimer - 1;
                });
            }, 1000);

            return () => clearInterval(interval);
        }
    }, [whatsapp?.connectionStatus, timer]);

    // Effect to handle automatic QR refresh when expired
    useEffect(() => {
        if (timer === 0 && whatsapp?.connectionStatus === 'connecting' && !syncing) {
            // Auto-refresh QR code after expiration
            handleSyncWhatsApp();
        }
    }, [timer, whatsapp?.connectionStatus]);

    // Set QR status based on WhatsApp connection status
    useEffect(() => {
        if (whatsapp?.connectionStatus === 'connecting') {
            setQrStatus('connecting');
        } else if (whatsapp?.connectionStatus === 'close') {
            setQrStatus('invalid');
        }
    }, [whatsapp?.connectionStatus]);

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div>
                    <CardTitle className="text-sm font-medium">Sincronização do WhatsApp</CardTitle>
                    <CardDescription>
                        Conecte o WhatsApp da sua igreja para enviar notificações
                    </CardDescription>
                </div>
                <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    <div className="flex flex-col">
                        <div>
                            <span className="font-medium">Status: </span>
                            {isLoading && (
                                <span className="text-muted-foreground">Carregando...</span>
                            )}
                            {whatsapp === null && (<p className="text-muted-foreground">Nenhum dispositivo WhatsApp conectado.</p>)}
                            {whatsapp !== null && (<div key={whatsapp.id} className="flex items-center gap-2 mt-2">
                                <div className={`h-3 w-3 rounded-full ${whatsapp?.connectionStatus === 'open' ? 'bg-green-500' :
                                    whatsapp?.connectionStatus === 'close' ? 'bg-red-500' : 'bg-yellow-500'
                                    }`} />
                                <span>
                                    {whatsapp?.connectionStatus === 'open' ? 'Conectado' :
                                        whatsapp?.connectionStatus === 'connecting' ? <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> :
                                            whatsapp?.connectionStatus === 'close' ? 'Desconectado' : 'Conectando...'}
                                </span>
                            </div>)}
                        </div>
                    </div>

                    <QrCode
                        whatsapp={whatsapp}
                        qrCode={qrCode}
                        qrStatus={qrStatus}
                        timer={timer}
                    />

                    <Button
                        onClick={handleSyncWhatsApp}
                        disabled={syncing || isLoading}
                        className="w-full"
                    >
                        {syncing ? (
                            <>
                                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                                Gerando QR Code...
                            </>
                        ) : whatsapp?.qrcode ? (
                            <>
                                <QrCodeIcon className="mr-2 h-4 w-4" />
                                Gerar novo QR Code
                            </>
                        ) : (
                            <>
                                <MessageSquare className="mr-2 h-4 w-4" />
                                {whatsapp?.connectionStatus === 'open' ? 'Reconectar WhatsApp' : 'Sincronizar WhatsApp'}
                            </>
                        )}
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
};

export default WhatsAppSync;

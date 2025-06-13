
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { HttpClient } from '@/lib/http_client';
import { MessageSquare, RefreshCw, QrCode } from 'lucide-react';
import { useWhatsApp } from '@/context/WhatsAppContext';
import QRCode from 'qrcode';

const WhatsAppSync = () => {
    const { whatsapps, isLoading, syncing, setSyncing, qrCode, setQrCode, whatsapp } = useWhatsApp();
    const { toast } = useToast();
    const [timer, setTimer] = useState<number>(30);
    const [qrStatus, setQrStatus] = useState<'valid' | 'invalid' | 'connecting' | 'expired'>('valid');

    const handleSyncWhatsApp = async () => {
        try {
            setSyncing(true);
            setTimer(30); // Reset timer when generating a new QR code
            setQrStatus('valid');

            await HttpClient.post('/whatsapp/sync', {});

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
        if (whatsapp?.qrcode) {
            QRCode.toDataURL(whatsapp.qrcode).then(setQrCode);
            setQrStatus('valid');
            setTimer(30);
        }
    }, [whatsapp?.qrcode]);

    useEffect(() => {
        // Timer for QR code expiration
        if (whatsapp?.status === 'qrcode' && timer > 0) {
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
    }, [whatsapp?.status, timer]);

    // Effect to handle automatic QR refresh when expired
    useEffect(() => {
        if (timer === 0 && whatsapp?.status === 'qrcode' && !syncing) {
            // Auto-refresh QR code after expiration
            handleSyncWhatsApp();
        }
    }, [timer, whatsapp?.status]);

    // Set QR status based on WhatsApp connection status
    useEffect(() => {
        if (whatsapp?.status === 'CONNECTING') {
            setQrStatus('connecting');
        } else if (whatsapp?.status === 'DISCONNECTED') {
            setQrStatus('invalid');
        }
    }, [whatsapp?.status]);

    const getQrCodeOverlayClass = () => {
        switch (qrStatus) {
            case 'connecting':
                return 'absolute inset-0 bg-yellow-500/50 flex items-center justify-center rounded-md';
            case 'invalid':
                return 'absolute inset-0 bg-red-500/50 flex items-center justify-center rounded-md';
            case 'expired':
                return 'absolute inset-0 bg-gray-500/70 flex items-center justify-center rounded-md';
            default:
                return '';
        }
    };

    const getQrCodeOverlayText = () => {
        switch (qrStatus) {
            case 'connecting':
                return 'Conectando...';
            case 'invalid':
                return 'QR Code inválido';
            case 'expired':
                return 'QR Code expirado';
            default:
                return '';
        }
    };

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
                                <div className={`h-3 w-3 rounded-full ${whatsapp?.status === 'CONNECTED' ? 'bg-green-500' :
                                    whatsapp?.status === 'DISCONNECTED' ? 'bg-red-500' : 'bg-yellow-500'
                                    }`} />
                                <span>
                                    {whatsapp?.status === 'CONNECTED' ? 'Conectado' :
                                        whatsapp?.status === 'OPENING' ? <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> :
                                        whatsapp?.status === 'DISCONNECTED' ? 'Desconectado' : 'Conectando...'}
                                </span>
                            </div>)}
                        </div>
                    </div>

                    {whatsapp?.status === 'qrcode' && (
                        <div className="flex flex-col items-center justify-center mt-4">
                            <p className="text-sm text-muted-foreground mb-3">Escaneie o QR Code com seu WhatsApp:</p>
                            <div className="border p-4 rounded-md bg-white relative">
                                <img
                                    src={qrCode}
                                    alt="QR Code para sincronização do WhatsApp"
                                    className="w-48 h-48"
                                />
                                {qrStatus !== 'valid' && (
                                    <div className={getQrCodeOverlayClass()}>
                                        <span className="text-white font-medium text-center px-3">{getQrCodeOverlayText()}</span>
                                    </div>
                                )}
                            </div>
                            <p className="text-xs text-muted-foreground mt-2">
                                {timer > 0 
                                    ? `Expira em ${timer} segundo${timer !== 1 ? 's' : ''}`
                                    : 'QR Code expirado, gerando novo...'}
                            </p>
                        </div>
                    )}

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
                                <QrCode className="mr-2 h-4 w-4" />
                                Gerar novo QR Code
                            </>
                        ) : (
                            <>
                                <MessageSquare className="mr-2 h-4 w-4" />
                                {whatsapp?.status === 'CONNECTED' ? 'Reconectar WhatsApp' : 'Sincronizar WhatsApp'}
                            </>
                        )}
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
};

export default WhatsAppSync;

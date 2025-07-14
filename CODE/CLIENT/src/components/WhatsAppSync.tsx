import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { HttpClient } from '@/lib/http_client';
import { MessageSquare, RefreshCw, QrCode as QrCodeIcon, Phone, KeyRound } from 'lucide-react';
import { useWhatsApp } from '@/context/WhatsAppContext';
import QrCode from '@/components/QrCode';
import { PhoneInput } from '@/components/ui/phone-input';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';

const WhatsAppSync = () => {
    const { whatsapps, isLoading, syncing, setSyncing, qrCode, setQrCode, whatsapp, setIsLoading, setWhatsapp } = useWhatsApp();
    const { toast } = useToast();
    const [timer, setTimer] = useState<number>(30);
    const [qrStatus, setQrStatus] = useState<'valid' | 'invalid' | 'connecting' | 'expired'>('valid');
    const [syncMode, setSyncMode] = useState<'qr' | 'number'>('qr');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [isRequestingCode, setIsRequestingCode] = useState(false);
    const [syncCode, setSyncCode] = useState('');
    const [codeError, setCodeError] = useState('');

    const handleSyncWhatsApp = async () => {
        try {
            setSyncing(true);
            setTimer(30); // Reset timer when generating a new QR code
            setQrStatus('valid');

            await HttpClient.getWhatsapp().post('/start', {});
            await new Promise(resolve => setTimeout(resolve, 3000));
            let response = await HttpClient.getWhatsapp().get<{ qrCode: string, status: string }>('/status');

            setWhatsapp(
                (prev) => ({
                    ...prev,
                    connectionStatus: response.status
                })
            );

            setQrCode(response.qrCode);
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

    async function handleRequestSyncCode() {
        setIsRequestingCode(true);
        setCodeError('');
        setSyncCode('');
        try {
            await HttpClient.getWhatsapp().post('/start', { phoneNumber });
            await new Promise(resolve => setTimeout(resolve, 3000));
            let response = await HttpClient.getWhatsapp().get<{ pairingCode: string, status: string }>('/status');
            setWhatsapp(
                (prev) => ({
                    ...prev,
                    connectionStatus: response.status
                })
            );
            let receivedCode = response.pairingCode;
            if (typeof receivedCode !== 'string') {
                receivedCode = String(receivedCode ?? '');
            }
            setSyncCode(receivedCode);
            toast({
                title: 'Código gerado',
                description: 'Digite este código no WhatsApp do celular para concluir a sincronização.'
            });
        } catch (error) {
            setCodeError('Não foi possível gerar o código. Verifique o número e tente novamente.');
            toast({
                title: 'Erro ao gerar código',
                description: 'Não foi possível gerar o código de sincronização.',
                variant: 'destructive'
            });
        }
        setIsRequestingCode(false);
    }

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
                    <div className="flex flex-row gap-2 mb-2">
                        <Button
                            variant={syncMode === 'qr' ? 'default' : 'outline'}
                            onClick={() => setSyncMode('qr')}
                            size="sm"
                        >
                            <QrCodeIcon className="mr-2 h-4 w-4" /> QR Code
                        </Button>
                        <Button
                            variant={syncMode === 'number' ? 'default' : 'outline'}
                            onClick={() => setSyncMode('number')}
                            size="sm"
                        >
                            <Phone className="mr-2 h-4 w-4" /> Pelo número
                        </Button>
                    </div>

                    {syncMode === 'qr' && (
                        <>
                            {/* Status e QR Code padrão */}
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
                        </>
                    )}

                    {syncMode === 'number' && (
                        <div className="flex flex-col gap-4 items-center mt-2">
                            <div className="w-full">
                                <label className="block text-sm font-medium mb-1" htmlFor="phone-number">Número de celular</label>
                                <PhoneInput
                                    value={phoneNumber}
                                    onChange={setPhoneNumber}
                                    placeholder="(99) 9 9999-9999"
                                    className="mb-2"
                                />
                                <Button
                                    onClick={handleRequestSyncCode}
                                    disabled={isRequestingCode || phoneNumber.replace(/\D/g, '').length < 11}
                                    className="w-full mt-2"
                                >
                                    <KeyRound className="mr-2 h-4 w-4" />
                                    Gerar código de sincronização
                                </Button>
                                {codeError && <p className="text-red-500 text-xs mt-1">{codeError}</p>}
                            </div>
                            {typeof syncCode === 'string' && syncCode.length > 0 && (
                                <div className="flex flex-col items-center w-full">
                                    <p className="text-sm text-muted-foreground mb-2">Digite este código no WhatsApp do celular:</p>
                                    <InputOTP value={syncCode.padEnd(8, ' ')} disabled maxLength={8} containerClassName="justify-center">
                                        <InputOTPGroup>
                                            {[...Array(8)].map((_, i) => (
                                                <InputOTPSlot key={i} index={i} />
                                            ))}
                                        </InputOTPGroup>
                                    </InputOTP>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
};

export default WhatsAppSync;

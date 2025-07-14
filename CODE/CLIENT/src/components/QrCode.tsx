const QrCode = ({ whatsapp, qrCode, qrStatus, timer }: { whatsapp: any, qrCode: string, qrStatus: string, timer: number }) => {
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
    return whatsapp?.connectionStatus === 'connecting' && (
        <div className="flex flex-col items-center justify-center mt-4">
            <p className="text-sm text-muted-foreground mb-3">Escaneie o QR Code com seu WhatsApp:</p>
            {qrCode && (
                <div className="border p-4 rounded-md bg-white relative">
                    <img
                        src={ 'http://localhost:1234' + qrCode}
                        alt="QR Code para sincronização do WhatsApp"
                        className="w-48 h-48"
                    />
                    {qrStatus !== 'valid' && (
                        <div className={getQrCodeOverlayClass()}>
                            <span className="text-white font-medium text-center px-3">{getQrCodeOverlayText()}</span>
                        </div>
                    )}
                </div>
            )}
            <p className="text-xs text-muted-foreground mt-2">
                {timer > 0
                    ? `Expira em ${timer} segundo${timer !== 1 ? 's' : ''}`
                    : 'QR Code expirado, gerando novo...'}
            </p>
        </div>

    );
};

export default QrCode;
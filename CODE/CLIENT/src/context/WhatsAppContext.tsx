
import { useDashboard } from '@/hooks/use-dashboard';
import { createContext, useContext } from 'react';

const WhatsAppContext = createContext({
  isLoading: true,
  whatsapps: [],
  church: null,
  ministries: [],
  contacts: [],
  whatsapp: null,
  setWhatsapp: (whatsapp: {}) => {},
  syncing: false,
  setSyncing: (syncing: boolean) => {},
  qrCode: null,
  setQrCode: (qrCode: string) => {},
});

export function WhatsAppProvider({ children }: { children: React.ReactNode }) {
    const { isLoading, whatsapps, church, ministries, contacts, whatsapp, setWhatsapp, syncing, setSyncing, qrCode, setQrCode } = useDashboard();

    return (
        <WhatsAppContext.Provider value={{ isLoading, whatsapps, church, ministries, contacts, whatsapp, setWhatsapp, syncing, setSyncing, qrCode, setQrCode }}>
            {children}
        </WhatsAppContext.Provider>
    );
}

export const useWhatsApp = () => {
    return useContext(WhatsAppContext);
};

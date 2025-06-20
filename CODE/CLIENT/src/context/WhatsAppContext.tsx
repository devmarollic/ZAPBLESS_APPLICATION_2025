
import { useDashboard } from '@/hooks/use-dashboard';
import { createContext, useContext } from 'react';

const WhatsAppContext = createContext({
  isLoading: true,
  setIsLoading: (isLoading: boolean) => {},
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
  metrics: {
    members: {
      total: 0,
      growth: 0
    },
    messages: {
      total: 0,
      growth: 0
    },
    ministries: {
      total: 0,
      growth: 0
    },
    announcements: {
      total: 0,
      growth: 0
    }
  }
});

export function WhatsAppProvider({ children }: { children: React.ReactNode }) {
    const { isLoading, setIsLoading, whatsapps, church, ministries, contacts, whatsapp, setWhatsapp, syncing, setSyncing, qrCode, setQrCode, metrics } = useDashboard();

    return (
        <WhatsAppContext.Provider value={{ isLoading, setIsLoading, whatsapps, church, ministries, contacts, whatsapp, setWhatsapp, syncing, setSyncing, qrCode, setQrCode, metrics }}>
            {children}
        </WhatsAppContext.Provider>
    );
}

export const useWhatsApp = () => {
    return useContext(WhatsAppContext);
};

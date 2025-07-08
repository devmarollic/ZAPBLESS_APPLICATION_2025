
import { useState, useEffect, useReducer } from 'react';
import { HttpClient } from '@/lib/http_client';
import { getMap } from '@/lib/utils';
import connectToSocket from '../lib/socket';

interface Ministry {
    id: string;
    name: string;
}

interface Church {
    id: string;
    name: string;
    phoneNumber: string;
    addressLine1: string;
    addressLine2: string;
    zipCode: string;
    cityCode: string;
    stateCode: string;
    countryCode: string;
    neighborhood: string;
    documentType: string;
    documentNumber: string;
    languageTag: string;
}

interface WhatsApp {
    id: string;
    status: string;
    updatedAt: string;
    qrcode?: string;
    retries?: number;
}

interface Contact {
    id: string;
    name: string;
}

interface DashboardData {
    whatsapp?: WhatsApp;
    church?: Church;
    ministries?: Ministry[];
    contacts?: Contact[];
    metrics?: Metric;
}

type MinistriesAction =
    | { type: 'FETCH_MINISTRIES_SUCCESS', payload: Ministry[] }
    | { type: 'FETCH_CHURCH_SUCCESS', payload: Church };

type WhatsAppAction =
    | { type: 'LOAD_WHATSAPPS', payload: WhatsApp[] }
    | { type: 'UPDATE_WHATSAPPS', payload: WhatsApp }
    | { type: 'UPDATE_SESSION', payload: WhatsApp }
    | { type: 'DELETE_WHATSAPPS', payload: string }
    | { type: 'RESET' };

type Metric = {
    members: {
        total: number;
        growth: number;
    },
    messages: {
        total: number;
        growth: number;
    },
    ministries: {
        total: number;
        growth: number;
    },
    announcements: {
        total: number;
        growth: number;
    }
};

function reducer(state: any, action: MinistriesAction) {
    if (action.type === 'FETCH_MINISTRIES_SUCCESS') {
        return action.payload;
    }

    if (action.type === 'FETCH_CHURCH_SUCCESS') {
        return action.payload;
    }

    return state;
};

function whatsappReducer(state: WhatsApp[], action: WhatsAppAction) {
    if (action.type === 'LOAD_WHATSAPPS') {
        const whatsApps = action.payload;
        return [...whatsApps];
    }

    if (action.type === 'UPDATE_WHATSAPPS') {
        const whatsApp = action.payload;
        const whatsAppIndex = state.findIndex(s => s.id === whatsApp.id);

        if (whatsAppIndex !== -1) {
            state[whatsAppIndex] = whatsApp;
            return [...state];
        } else {
            return [whatsApp, ...state];
        }
    }

    if (action.type === 'UPDATE_SESSION') {
        const whatsApp = action.payload;
        const whatsAppIndex = state.findIndex(s => s.id === whatsApp.id);

        if (whatsAppIndex !== -1) {
            state[whatsAppIndex].status = whatsApp.status;
            state[whatsAppIndex].updatedAt = whatsApp.updatedAt;
            state[whatsAppIndex].qrcode = whatsApp.qrcode;
            state[whatsAppIndex].retries = whatsApp.retries;
            return [...state];
        } else {
            return [...state];
        }
    }

    if (action.type === 'DELETE_WHATSAPPS') {
        const whatsAppId = action.payload;

        const whatsAppIndex = state.findIndex(s => s.id === whatsAppId);
        if (whatsAppIndex !== -1) {
            state.splice(whatsAppIndex, 1);
        }
        return [...state];
    }

    if (action.type === 'RESET') {
        return [];
    }

    return state;
};

export function useDashboard() {
    const [isLoading, setIsLoading] = useState(true);
    const [whatsapps, dispatchWhatsapp] = useReducer(whatsappReducer, []);
    const [whatsapp, setWhatsapp] = useState<WhatsApp | null>(null);
    const [church, setChurch] = useState<Church | null>(null);
    const [ministries, dispatchMinistries] = useReducer(reducer, []);
    const [contacts, setContacts] = useState<Contact[]>([]);
    const [syncing, setSyncing] = useState(false);
    const [qrCode, setQrCode] = useState<string | null>(null);
    const [metrics, setMetrics] = useState<Metric>({
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
    });

    useEffect(() => {
        async function fetchDashboardData() {
            try {
                setIsLoading(true);
                const data = await HttpClient.getDefault().get<DashboardData>('/dashboard/get');

                if (data) {
                    if (data.whatsapp) {
                        dispatchWhatsapp({ type: 'UPDATE_SESSION', payload: data.whatsapp });
                        setWhatsapp(data.whatsapp);
                    }

                    if (data.church) {
                        setChurch(data.church);
                    }

                    if (data.ministries) {
                        dispatchMinistries({ type: 'FETCH_MINISTRIES_SUCCESS', payload: data.ministries });
                    }

                    if (data.contacts) {
                        setContacts(data.contacts);
                    }

                    if (data.metrics) {
                        setMetrics(data.metrics);
                    }
                }
            } catch (error) {
                console.error('Error fetching dashboard data:', error);
                dispatchWhatsapp({
                    type: 'LOAD_WHATSAPPS',
                    payload: [{
                        id: '1',
                        status: 'DISCONNECTED',
                        updatedAt: new Date().toISOString()
                    }]
                });
            } finally {
                setIsLoading(false);
            }
        }
        fetchDashboardData();
    }, []);

    useEffect(() => {
        const socket = connectToSocket();

        if (!socket) return;

        socket.on('whatsapp', (data: { action: string; whatsapp: WhatsApp; whatsappId: string }) => {
            if (data.action === 'update') {
                dispatchWhatsapp({ type: 'UPDATE_WHATSAPPS', payload: data.whatsapp });
            }

            if (data.action === 'delete') {
                dispatchWhatsapp({ type: 'DELETE_WHATSAPPS', payload: data.whatsappId });
            }
        });

        socket.on('whatsappSession', (data: { action: string; session: WhatsApp }) => {
            if (data.action === 'update') {

                setWhatsapp(prev => {
                    if (prev?.status === 'CONNECTED' && data.session.status === 'qrcode') {
                        return prev;
                    }
                    return data.session;
                });
                setSyncing(false);
                dispatchWhatsapp({ type: 'UPDATE_SESSION', payload: data.session });
            }
        });

        return () => {
            socket.disconnect();
        };
    }, []);

    return {
        isLoading,
        setIsLoading,
        whatsapps,
        church,
        ministries,
        contacts,
        whatsapp,
        setWhatsapp,
        syncing,
        setSyncing,
        qrCode,
        setQrCode,
        metrics
    };
}

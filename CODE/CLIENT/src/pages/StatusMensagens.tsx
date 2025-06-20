
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MessageSquare, Send, Clock, CheckCircle, XCircle, AlertCircle, Search, Calendar, Users } from 'lucide-react';

interface SentMessage {
    id: string;
    title: string;
    content: string;
    targetType: 'all' | 'ministry' | 'specific';
    targetName?: string;
    recipientCount: number;
    sentCount: number;
    deliveredCount: number;
    readCount: number;
    failedCount: number;
    status: 'scheduled' | 'sending' | 'sent' | 'failed' | 'partially_sent';
    sentAt?: string;
    scheduledFor?: string;
    createdAt: string;
}

const mockSentMessages: SentMessage[] = [
    {
        id: '1',
        title: 'Convite Culto Domingo',
        content: 'Paz do Senhor! Você está convidado para nosso culto de domingo às 19h. Não falte!',
        targetType: 'all',
        recipientCount: 150,
        sentCount: 150,
        deliveredCount: 145,
        readCount: 120,
        failedCount: 5,
        status: 'sent',
        sentAt: '2024-01-15T10:30:00Z',
        createdAt: '2024-01-15T10:25:00Z',
    },
    {
        id: '2',
        title: 'Reunião de Jovens',
        content: 'Lembrete: Nossa reunião de jovens será hoje às 19h30. Venham todos!',
        targetType: 'ministry',
        targetName: 'Jovens',
        recipientCount: 25,
        sentCount: 23,
        deliveredCount: 22,
        readCount: 18,
        failedCount: 2,
        status: 'partially_sent',
        sentAt: '2024-01-14T16:45:00Z',
        createdAt: '2024-01-14T16:40:00Z',
    },
    {
        id: '3',
        title: 'Aniversário Maria',
        content: 'Parabéns Maria! Que Deus abençoe sua vida neste novo ano!',
        targetType: 'specific',
        recipientCount: 1,
        sentCount: 0,
        deliveredCount: 0,
        readCount: 0,
        failedCount: 0,
        status: 'scheduled',
        scheduledFor: '2024-01-18T09:00:00Z',
        createdAt: '2024-01-15T14:20:00Z',
    },
    {
        id: '4',
        title: 'Aviso Importante',
        content: 'Informamos que o culto de quarta-feira será cancelado devido a reforma no templo.',
        targetType: 'all',
        recipientCount: 150,
        sentCount: 0,
        deliveredCount: 0,
        readCount: 0,
        failedCount: 150,
        status: 'failed',
        sentAt: '2024-01-13T08:00:00Z',
        createdAt: '2024-01-13T07:55:00Z',
    },
    {
        id: '5',
        title: 'Ensaio Coral',
        content: 'Ensaio do coral hoje às 18h. Não faltem!',
        targetType: 'ministry',
        targetName: 'Louvor',
        recipientCount: 12,
        sentCount: 8,
        deliveredCount: 0,
        readCount: 0,
        failedCount: 0,
        status: 'sending',
        createdAt: '2024-01-15T17:30:00Z',
    },
];

const StatusMensagens = () => {
    const [messages, setMessages] = useState<SentMessage[]>(mockSentMessages);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [targetFilter, setTargetFilter] = useState<string>('all');

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'sent':
                return 'bg-green-100 text-green-800';
            case 'sending':
                return 'bg-blue-100 text-blue-800';
            case 'scheduled':
                return 'bg-yellow-100 text-yellow-800';
            case 'failed':
                return 'bg-red-100 text-red-800';
            case 'partially_sent':
                return 'bg-orange-100 text-orange-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'sent':
                return <CheckCircle className="h-4 w-4" />;
            case 'sending':
                return <Send className="h-4 w-4" />;
            case 'scheduled':
                return <Clock className="h-4 w-4" />;
            case 'failed':
                return <XCircle className="h-4 w-4" />;
            case 'partially_sent':
                return <AlertCircle className="h-4 w-4" />;
            default:
                return <MessageSquare className="h-4 w-4" />;
        }
    };

    const getStatusLabel = (status: string) => {
        const labels = {
            sent: 'Enviada',
            sending: 'Enviando',
            scheduled: 'Agendada',
            failed: 'Falhou',
            partially_sent: 'Parcial'
        };
        return labels[status as keyof typeof labels] || status;
    };

    const getTargetLabel = (message: SentMessage) => {
        switch (message.targetType) {
            case 'all':
                return 'Todos os membros';
            case 'ministry':
                return `Ministério: ${message.targetName}`;
            case 'specific':
                return 'Membros específicos';
            default:
                return 'Não definido';
        }
    };

    const getSuccessRate = (message: SentMessage) => {
        if (message.recipientCount === 0) return 0;
        return Math.round((message.deliveredCount / message.recipientCount) * 100);
    };

    const filteredMessages = messages.filter(message => {
        const matchesSearch = message.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            message.content.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'all' || message.status === statusFilter;
        const matchesTarget = targetFilter === 'all' || message.targetType === targetFilter;
        
        return matchesSearch && matchesStatus && matchesTarget;
    });

    const totalMessages = messages.length;
    const totalRecipients = messages.reduce((sum, msg) => sum + msg.recipientCount, 0);
    const totalSent = messages.reduce((sum, msg) => sum + msg.sentCount, 0);
    const totalDelivered = messages.reduce((sum, msg) => sum + msg.deliveredCount, 0);

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold">Status das Mensagens</h1>
                <p className="text-muted-foreground">Acompanhe o status e estatísticas das mensagens enviadas</p>
            </div>

            {/* Cards de Estatísticas */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Mensagens</CardTitle>
                        <MessageSquare className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalMessages}</div>
                        <p className="text-xs text-muted-foreground">
                            Mensagens enviadas
                        </p>
                    </CardContent>
                </Card>
                
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Destinatários</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalRecipients}</div>
                        <p className="text-xs text-muted-foreground">
                            Pessoas alcançadas
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Taxa de Envio</CardTitle>
                        <Send className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {totalRecipients > 0 ? Math.round((totalSent / totalRecipients) * 100) : 0}%
                        </div>
                        <p className="text-xs text-muted-foreground">
                            {totalSent} de {totalRecipients} enviadas
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Taxa de Entrega</CardTitle>
                        <CheckCircle className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {totalSent > 0 ? Math.round((totalDelivered / totalSent) * 100) : 0}%
                        </div>
                        <p className="text-xs text-muted-foreground">
                            {totalDelivered} de {totalSent} entregues
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Filtros */}
            <Card>
                <CardHeader>
                    <CardTitle>Filtros</CardTitle>
                    <CardDescription>Filtre as mensagens por status, tipo ou busque por título</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-4 md:grid-cols-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Buscar</label>
                            <div className="relative">
                                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Buscar por título..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-8"
                                />
                            </div>
                        </div>
                        
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Status</label>
                            <Select value={statusFilter} onValueChange={setStatusFilter}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Todos os status</SelectItem>
                                    <SelectItem value="sent">Enviadas</SelectItem>
                                    <SelectItem value="sending">Enviando</SelectItem>
                                    <SelectItem value="scheduled">Agendadas</SelectItem>
                                    <SelectItem value="failed">Falharam</SelectItem>
                                    <SelectItem value="partially_sent">Parciais</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Tipo de Destinatário</label>
                            <Select value={targetFilter} onValueChange={setTargetFilter}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Todos os tipos</SelectItem>
                                    <SelectItem value="all">Todos os membros</SelectItem>
                                    <SelectItem value="ministry">Por ministério</SelectItem>
                                    <SelectItem value="specific">Específicos</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Ações</label>
                            <Button 
                                variant="outline" 
                                className="w-full"
                                onClick={() => {
                                    setSearchTerm('');
                                    setStatusFilter('all');
                                    setTargetFilter('all');
                                }}
                            >
                                Limpar Filtros
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Lista de Mensagens */}
            <Card>
                <CardHeader>
                    <CardTitle>Mensagens Enviadas</CardTitle>
                    <CardDescription>
                        Lista de todas as mensagens com seu respectivo status de entrega
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Título</TableHead>
                                    <TableHead>Destinatários</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Estatísticas</TableHead>
                                    <TableHead>Data/Hora</TableHead>
                                    <TableHead>Taxa Sucesso</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredMessages.map((message) => (
                                    <TableRow key={message.id}>
                                        <TableCell>
                                            <div>
                                                <div className="font-medium">{message.title}</div>
                                                <div className="text-sm text-muted-foreground truncate max-w-[200px]">
                                                    {message.content}
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div>
                                                <div className="font-medium">{message.recipientCount} pessoas</div>
                                                <div className="text-sm text-muted-foreground">
                                                    {getTargetLabel(message)}
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge className={getStatusColor(message.status)}>
                                                {getStatusIcon(message.status)}
                                                <span className="ml-1">{getStatusLabel(message.status)}</span>
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <div className="text-sm space-y-1">
                                                <div>✓ Enviadas: {message.sentCount}</div>
                                                <div>📱 Entregues: {message.deliveredCount}</div>
                                                <div>👁️ Lidas: {message.readCount}</div>
                                                {message.failedCount > 0 && (
                                                    <div className="text-red-600">❌ Falharam: {message.failedCount}</div>
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="text-sm">
                                                {message.status === 'scheduled' && message.scheduledFor && (
                                                    <div className="flex items-center">
                                                        <Calendar className="mr-1 h-4 w-4" />
                                                        <div>
                                                            <div>Agendada para:</div>
                                                            <div>{new Date(message.scheduledFor).toLocaleString('pt-BR')}</div>
                                                        </div>
                                                    </div>
                                                )}
                                                {message.sentAt && (
                                                    <div className="flex items-center">
                                                        <Send className="mr-1 h-4 w-4" />
                                                        <div>
                                                            <div>Enviada em:</div>
                                                            <div>{new Date(message.sentAt).toLocaleString('pt-BR')}</div>
                                                        </div>
                                                    </div>
                                                )}
                                                <div className="text-muted-foreground mt-1">
                                                    Criada: {new Date(message.createdAt).toLocaleDateString('pt-BR')}
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="text-center">
                                                <div className="text-lg font-bold">{getSuccessRate(message)}%</div>
                                                <div className="text-xs text-muted-foreground">sucesso</div>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                    
                    {filteredMessages.length === 0 && (
                        <div className="text-center py-8">
                            <MessageSquare className="mx-auto h-12 w-12 text-gray-400" />
                            <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhuma mensagem encontrada</h3>
                            <p className="mt-1 text-sm text-gray-500">
                                Não há mensagens que correspondem aos filtros aplicados.
                            </p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default StatusMensagens;

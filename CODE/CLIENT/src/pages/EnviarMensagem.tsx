
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { MessageSquare, Send, Check, Calendar, Clock } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import PresetMessages from '@/components/messaging/PresetMessages';

const messageFormSchema = z.object({
    title: z.string().min(3, 'O título deve ter pelo menos 3 caracteres'),
    message: z.string().min(10, 'A mensagem deve ter pelo menos 10 caracteres'),
    target: z.string().min(1, 'Selecione o destino da mensagem'),
    specificTarget: z.string().optional(),
    isScheduled: z.boolean().default(false),
    scheduledDate: z.string().optional(),
    scheduledTime: z.string().optional(),
}).refine((data) => {
    if (data.isScheduled) {
        return data.scheduledDate && data.scheduledTime;
    }
    return true;
}, {
    message: "Data e horário são obrigatórios para mensagens agendadas",
    path: ["scheduledDate"],
});

type MessageFormValues = z.infer<typeof messageFormSchema>;

// Mock data for testing
const mockMembers = [
    { id: '1', name: 'João Silva', phone: '(11) 98765-4321' },
    { id: '2', name: 'Maria Santos', phone: '(11) 91234-5678' },
    { id: '3', name: 'Pedro Oliveira', phone: '(11) 92345-6789' },
    { id: '4', name: 'Ana Costa', phone: '(11) 93456-7890' },
    { id: '5', name: 'Carlos Souza', phone: '(11) 94567-8901' },
];

const mockMinistries = [
    { id: '1', name: 'Louvor' },
    { id: '2', name: 'Jovens' },
    { id: '3', name: 'Infantil' },
    { id: '4', name: 'Células' },
];

const EnviarMensagem = () => {
    const { toast } = useToast();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [selectedRecipients, setSelectedRecipients] = useState<string[]>([]);
    const [targetType, setTargetType] = useState<string>('all');
    const [showPreview, setShowPreview] = useState(false);
    const [previewData, setPreviewData] = useState<{ title: string, message: string, recipients: number }>({
        title: '',
        message: '',
        recipients: 0
    });

    const form = useForm<MessageFormValues>({
        resolver: zodResolver(messageFormSchema),
        defaultValues: {
            title: '',
            message: '',
            target: 'all',
            isScheduled: false,
            scheduledDate: '',
            scheduledTime: '',
        },
    });

    const isScheduled = form.watch('isScheduled');

    const handleSelectPresetMessage = (content: string) => {
        form.setValue('message', content);
    };

    const handleTargetChange = (value: string) => {
        setTargetType(value);
        form.setValue('target', value);
        form.setValue('specificTarget', undefined);
        setSelectedRecipients([]);
    };

    const handleSpecificTargetChange = (value: string) => {
        form.setValue('specificTarget', value);

        if (targetType === 'ministry') {
            // If a ministry is selected, auto-select all members of that ministry
            // In a real app, this would be based on members in the ministry
            setSelectedRecipients(mockMembers.slice(0, 3).map(m => m.id));
        }
    };

    const toggleMemberSelection = (memberId: string) => {
        setSelectedRecipients(current => {
            if (current.includes(memberId)) {
                return current.filter(id => id !== memberId);
            } else {
                return [...current, memberId];
            }
        });
    };

    const handlePreview = () => {
        const isValid = form.trigger();
        if (!isValid) return;

        const formValues = form.getValues();
        let recipientCount = 0;

        if (targetType === 'all') {
            recipientCount = mockMembers.length;
        } else if (targetType === 'ministry' && formValues.specificTarget) {
            // In a real app, this would count members in the ministry
            recipientCount = 3;
        } else if (targetType === 'specific') {
            recipientCount = selectedRecipients.length;
        }

        setPreviewData({
            title: formValues.title,
            message: formValues.message,
            recipients: recipientCount,
        });

        setShowPreview(true);
    };

    const onSubmit = async (data: MessageFormValues) => {
        try {
            setIsLoading(true);

            // Prepare data for API
            const messageData = {
                ...data,
                recipients: targetType === 'specific' ? selectedRecipients : undefined,
            };

            // This would be a real API call in production
            // await HttpClient.post('/messages/send', messageData);

            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 1500));

            const actionText = data.isScheduled ? 'agendada' : 'enviada';
            const timeText = data.isScheduled 
                ? `para ${new Date(data.scheduledDate + 'T' + data.scheduledTime).toLocaleString('pt-BR')}`
                : '';

            toast({
                title: `Mensagem ${actionText}`,
                description: `Mensagem ${actionText} com sucesso para ${previewData.recipients} destinatários. ${timeText}`,
            });

            navigate('/dashboard/mensagens/status');
        } catch (error) {
            console.error('Error sending message:', error);
            toast({
                title: 'Erro ao enviar mensagem',
                description: 'Não foi possível enviar a mensagem. Tente novamente mais tarde.',
                variant: 'destructive',
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="md:container mx-auto py-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl md:text-3xl font-bold">Enviar Mensagem</h1>
                <Button variant="outline" onClick={() => navigate('/dashboard/membros')}>
                    Voltar para Membros
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center">
                                <MessageSquare className="mr-2 h-5 w-5" />
                                Composição da Mensagem
                            </CardTitle>
                            <CardDescription>
                                Crie a mensagem que será enviada via WhatsApp
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                                    <FormField
                                        control={form.control}
                                        name="title"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Título da Mensagem</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Ex: Convite para Culto" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="message"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Conteúdo da Mensagem</FormLabel>
                                                <FormControl>
                                                    <Textarea
                                                        placeholder="Digite a mensagem que será enviada..."
                                                        className="min-h-[150px]"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="target"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Destinatários</FormLabel>
                                                <Select
                                                    onValueChange={(value) => {
                                                        field.onChange(value);
                                                        handleTargetChange(value);
                                                    }}
                                                    defaultValue={field.value}
                                                >
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Selecione os destinatários" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        <SelectItem value="all">Todos os Membros</SelectItem>
                                                        <SelectItem value="ministry">Por Ministério</SelectItem>
                                                        <SelectItem value="specific">Membros Específicos</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    {targetType === "ministry" && (
                                        <FormField
                                            control={form.control}
                                            name="specificTarget"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Selecione o Ministério</FormLabel>
                                                    <Select
                                                        onValueChange={handleSpecificTargetChange}
                                                        value={field.value}
                                                    >
                                                        <FormControl>
                                                            <SelectTrigger>
                                                                <SelectValue placeholder="Selecione um ministério" />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent>
                                                            {mockMinistries.map(ministry => (
                                                                <SelectItem key={ministry.id} value={ministry.id}>
                                                                    {ministry.name}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    )}

                                    <Card>
                                        <CardHeader className="pb-3">
                                            <CardTitle className="text-base flex items-center">
                                                <Calendar className="mr-2 h-4 w-4" />
                                                Agendamento de Mensagem
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            <FormField
                                                control={form.control}
                                                name="isScheduled"
                                                render={({ field }) => (
                                                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                                                        <div className="space-y-0.5">
                                                            <FormLabel>Agendar mensagem</FormLabel>
                                                            <div className="text-sm text-muted-foreground">
                                                                Enviar a mensagem em data e horário específicos
                                                            </div>
                                                        </div>
                                                        <FormControl>
                                                            <Switch
                                                                checked={field.value}
                                                                onCheckedChange={field.onChange}
                                                            />
                                                        </FormControl>
                                                    </FormItem>
                                                )}
                                            />

                                            {isScheduled && (
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <FormField
                                                        control={form.control}
                                                        name="scheduledDate"
                                                        render={({ field }) => (
                                                            <FormItem>
                                                                <FormLabel>Data de Envio</FormLabel>
                                                                <FormControl>
                                                                    <Input
                                                                        type="date"
                                                                        min={new Date().toISOString().split('T')[0]}
                                                                        {...field}
                                                                    />
                                                                </FormControl>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />

                                                    <FormField
                                                        control={form.control}
                                                        name="scheduledTime"
                                                        render={({ field }) => (
                                                            <FormItem>
                                                                <FormLabel>Horário de Envio</FormLabel>
                                                                <FormControl>
                                                                    <Input
                                                                        type="time"
                                                                        {...field}
                                                                    />
                                                                </FormControl>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />
                                                </div>
                                            )}
                                        </CardContent>
                                    </Card>

                                    <div className="flex flex-col justify-center md:flex-row md:justify-end gap-4 pt-4">
                                        <Button type="button" variant="outline" onClick={handlePreview}>
                                            Visualizar
                                        </Button>
                                        <Button
                                            type="submit"
                                            disabled={isLoading || !showPreview || (targetType === "specific" && selectedRecipients.length === 0)}
                                        >
                                            {isLoading ? (
                                                <>Processando...</>
                                            ) : (
                                                <>
                                                    {isScheduled ? (
                                                        <>
                                                            <Clock className="mr-2 h-4 w-4" />
                                                            Agendar Mensagem
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Send className="mr-2 h-4 w-4" />
                                                            Enviar Mensagem
                                                        </>
                                                    )}
                                                </>
                                            )}
                                        </Button>
                                    </div>
                                </form>
                            </Form>
                        </CardContent>
                    </Card>

                    {targetType === "specific" && (
                        <Card className="mt-6">
                            <CardHeader>
                                <CardTitle className="text-sm font-medium">Selecionar Membros</CardTitle>
                                <CardDescription>
                                    Selecione os membros que receberão a mensagem
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="max-h-[300px] overflow-y-auto">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead className="w-[50px]"></TableHead>
                                                <TableHead>Nome</TableHead>
                                                <TableHead>Telefone</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {mockMembers.map(member => (
                                                <TableRow key={member.id} className="cursor-pointer hover:bg-muted/50" onClick={() => toggleMemberSelection(member.id)}>
                                                    <TableCell>
                                                        <div className="flex items-center justify-center">
                                                            <input
                                                                type="checkbox"
                                                                className="h-4 w-4"
                                                                checked={selectedRecipients.includes(member.id)}
                                                                onChange={() => { }}
                                                            />
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>{member.name}</TableCell>
                                                    <TableCell>{member.phone}</TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                                <div className="mt-4 text-sm text-muted-foreground">
                                    {selectedRecipients.length} membro(s) selecionado(s)
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>

                <div className="flex flex-col gap-6">
                    <PresetMessages onSelectMessage={handleSelectPresetMessage} />

                    {showPreview && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center">
                                    <MessageSquare className="mr-2 h-5 w-5" />
                                    Prévia da Mensagem
                            </CardTitle>
                                <CardDescription>
                                    Confira como sua mensagem será enviada
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="bg-muted p-4 rounded-md">
                                    <h3 className="font-bold">{previewData.title}</h3>
                                    <div className="mt-2 whitespace-pre-line">{previewData.message}</div>
                                </div>

                                <div className="mt-4 space-y-2">
                                    <div className="flex items-center text-sm">
                                        <Check className="mr-2 h-4 w-4 text-green-500" />
                                        <span>Será enviada para <strong>{previewData.recipients}</strong> destinatário(s)</span>
                                    </div>
                                    
                                    {isScheduled && form.getValues('scheduledDate') && form.getValues('scheduledTime') && (
                                        <div className="flex items-center text-sm">
                                            <Clock className="mr-2 h-4 w-4 text-blue-500" />
                                            <span>
                                                Agendada para <strong>
                                                    {new Date(form.getValues('scheduledDate') + 'T' + form.getValues('scheduledTime')).toLocaleString('pt-BR')}
                                                </strong>
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    );
};

export default EnviarMensagem;

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Bell, Plus, Calendar, Clock, AlertTriangle, CheckCircle, Trash2 } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import TemplateManager from '@/components/templates/TemplateManager';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { ScheduleResponse, ScheduleService } from '@/services/scheduleService';

type ReminderCategory = 'culto' | 'reuniao' | 'evento' | 'aniversario' | 'outros';

interface Reminder {
    id: string;
    title: string;
    description: string;
    category: ReminderCategory;
    dueDate: string;
    dueTime: string;
    status: 'pending' | 'completed';
    priority: 'low' | 'medium' | 'high';
}


const Lembretes = () => {
    const { toast } = useToast();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [activeTab, setActiveTab] = useState<'reminders' | 'templates'>('reminders');

    const queryClient = useQueryClient();
    const { data: reminders, isLoading: isLoadingSchedules } = useQuery<ScheduleResponse[]>({
        queryKey: ['schedules'],
        queryFn: () => ScheduleService.getSchedules()
    });

    const handleCreateReminder = () => {
        
        setIsDialogOpen(false);

        toast({
            title: 'Lembrete criado',
            description: 'O lembrete foi criado com sucesso!'
        });
    };

    const handleToggleStatus = async (id: string, status: 'sent' | 'pending') => {
        try {
            await ScheduleService.updateScheduleStatus(id, status);
    
            queryClient.invalidateQueries({ queryKey: ['schedules'] });
        } catch (error) {
            toast({
                title: 'Erro',
                description: 'Erro ao atualizar o status do lembrete',
                variant: 'destructive'
            });
        }
    };

    const handleDeleteReminder = async (id: string) => {
        try {
            await ScheduleService.deleteSchedule(id);

            queryClient.invalidateQueries({ queryKey: ['schedules'] });

            toast({
                title: 'Lembrete excluído',
                description: 'O lembrete foi excluído com sucesso!'
            });
        } catch (error) {
            toast({
                title: 'Erro',
                description: 'Erro ao excluir o lembrete',
                variant: 'destructive'
            });
        }
    };

    const getRoleColor = (role: string) => {
        const colors = {
            'leader': 'bg-blue-100 text-blue-800',
            'member': 'bg-green-100 text-green-800',
            'volunteer': 'bg-yellow-100 text-yellow-800',
            'vice-leader': 'bg-purple-100 text-purple-800'
        };
        return colors[role];
    };

    const getRoleName = (role: string) => {
        const names = {
            'leader': 'Lideres',
            'member': 'Membros',
            'volunteer': 'Voluntários',
            'vice-leader': 'Vice-líderes'
        };
        return names[role];
    };

    const getCategoryColor = (category: ReminderCategory) => {
        const colors = {
            culto: 'bg-blue-100 text-blue-800',
            reuniao: 'bg-green-100 text-green-800',
            evento: 'bg-purple-100 text-purple-800',
            aniversario: 'bg-pink-100 text-pink-800',
            outros: 'bg-gray-100 text-gray-800'
        };
        return colors[category];
    };

    const getPriorityColor = (priority: 'low' | 'medium' | 'high') => {
        const colors = {
            low: 'bg-green-100 text-green-800',
            medium: 'bg-yellow-100 text-yellow-800',
            high: 'bg-red-100 text-red-800'
        };
        return colors[priority];
    };

    const getPriorityIcon = (priority: 'low' | 'medium' | 'high') => {
        switch (priority) {
            case 'high':
                return <AlertTriangle className="h-4 w-4" />;
            case 'medium':
                return <Clock className="h-4 w-4" />;
            default:
                return <CheckCircle className="h-4 w-4" />;
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold">Lembretes</h1>
                    <p className="text-muted-foreground">Gerencie seus lembretes e templates de mensagens</p>
                </div>
                
                <div className="flex gap-2">
                    <Button
                        variant={activeTab === 'reminders' ? 'default' : 'outline'}
                        onClick={() => setActiveTab('reminders')}
                    >
                        <Bell className="mr-2 h-4 w-4" />
                        Lembretes
                    </Button>
                    <Button
                        variant={activeTab === 'templates' ? 'default' : 'outline'}
                        onClick={() => setActiveTab('templates')}
                    >
                        <Plus className="mr-2 h-4 w-4" />
                        Templates
                    </Button>
                </div>
            </div>

            {activeTab === 'reminders' && (
                <>
                    <div className="flex justify-end">
                        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                            {/* <DialogTrigger asChild>
                                <Button>
                                    <Plus className="mr-2 h-4 w-4" />
                                    Novo Lembrete
                                </Button>
                            </DialogTrigger> */}
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Criar Novo Lembrete</DialogTitle>
                                    <DialogDescription>
                                        Preencha os dados do lembrete
                                    </DialogDescription>
                                </DialogHeader>
                                {/* <div className="space-y-4">
                                    <div>
                                        <label className="text-sm font-medium">Título *</label>
                                        <Input
                                            value={newReminder.title}
                                            onChange={(e) => setNewReminder({...newReminder, title: e.target.value})}
                                            placeholder="Digite o título do lembrete"
                                        />
                                    </div>
                                    
                                    <div>
                                        <label className="text-sm font-medium">Descrição</label>
                                        <Textarea
                                            value={newReminder.description}
                                            onChange={(e) => setNewReminder({...newReminder, description: e.target.value})}
                                            placeholder="Digite a descrição do lembrete"
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-sm font-medium">Categoria</label>
                                            <Select 
                                                value={newReminder.category} 
                                                onValueChange={(value: ReminderCategory) => setNewReminder({...newReminder, category: value})}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="culto">Culto</SelectItem>
                                                    <SelectItem value="reuniao">Reunião</SelectItem>
                                                    <SelectItem value="evento">Evento</SelectItem>
                                                    <SelectItem value="aniversario">Aniversário</SelectItem>
                                                    <SelectItem value="outros">Outros</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div>
                                            <label className="text-sm font-medium">Prioridade</label>
                                            <Select 
                                                value={newReminder.priority} 
                                                onValueChange={(value: 'low' | 'medium' | 'high') => setNewReminder({...newReminder, priority: value})}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="low">Baixa</SelectItem>
                                                    <SelectItem value="medium">Média</SelectItem>
                                                    <SelectItem value="high">Alta</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-sm font-medium">Data *</label>
                                            <Input
                                                type="date"
                                                value={newReminder.dueDate}
                                                onChange={(e) => setNewReminder({...newReminder, dueDate: e.target.value})}
                                            />
                                        </div>

                                        <div>
                                            <label className="text-sm font-medium">Horário *</label>
                                            <Input
                                                type="time"
                                                value={newReminder.dueTime}
                                                onChange={(e) => setNewReminder({...newReminder, dueTime: e.target.value})}
                                            />
                                        </div>
                                    </div>

                                    <div className="flex justify-end gap-2">
                                        <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                                            Cancelar
                                        </Button>
                                        <Button onClick={handleCreateReminder}>
                                            Criar Lembrete
                                        </Button>
                                    </div>
                                </div> */}
                            </DialogContent>
                        </Dialog>
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center">
                                <Bell className="mr-2 h-5 w-5" />
                                Seus Lembretes
                            </CardTitle>
                            <CardDescription>
                                Lista de todos os seus lembretes
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Título</TableHead>
                                        <TableHead>Ministério</TableHead>
                                        <TableHead>Categoria</TableHead>
                                        <TableHead>Data/Hora</TableHead>
                                        <TableHead>Alvos</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Ações</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {(reminders || []).map((reminder) => (
                                        <TableRow key={reminder.id}>
                                            <TableCell>
                                                <div>
                                                    <div className="font-medium">{reminder.event.title}</div>
                                                    {reminder.event.description && (
                                                        <div className="text-sm text-muted-foreground">{reminder.event.description}</div>
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge className={reminder.event?.ministry?.color ? `bg-[${reminder.event.ministry.color}] whitespace-nowrap` : ''}>
                                                    {reminder.event?.ministry?.name ?? 'Sem ministério'}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <Badge className={getCategoryColor(reminder.event.eventType.name)}>
                                                    {reminder.event.eventType.name}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center">
                                                    <Calendar className="mr-1 h-4 w-4" />
                                                    <span className="text-sm">
                                                        {new Date(reminder.scheduleAtTimestamp).toLocaleDateString('pt-BR')} às {new Date(reminder.scheduleAtTimestamp).toLocaleTimeString('pt-BR')}
                                                    </span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                {JSON.parse(reminder.targetRoleArray)?.map((role) => (
                                                    <Badge key={role} className={`bg-[${getRoleColor(role)}] whitespace-nowrap`}>
                                                        {getRoleName(role)}
                                                    </Badge>
                                                ))}
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant={reminder.status.id === 'sent' ? 'default' : 'secondary'}>
                                                    {reminder.status.name}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex gap-2">
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() => handleToggleStatus(reminder.id, reminder.status.id === 'sent' ? 'pending' : 'sent')}
                                                    >
                                                        {reminder.status.id === 'sent' ? 'Reenviar' : 'Concluir'}
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() => handleDeleteReminder(reminder.id)}
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </>
            )}

            {activeTab === 'templates' && (
                <TemplateManager />
            )}
        </div>
    );
};

export default Lembretes;

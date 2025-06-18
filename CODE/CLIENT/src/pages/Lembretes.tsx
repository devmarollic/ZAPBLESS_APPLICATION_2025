
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

const mockReminders: Reminder[] = [
    {
        id: '1',
        title: 'Preparar material do culto',
        description: 'Organizar hinário e materiais para o culto de domingo',
        category: 'culto',
        dueDate: '2024-01-15',
        dueTime: '18:00',
        status: 'pending',
        priority: 'high'
    },
    {
        id: '2',
        title: 'Reunião de liderança',
        description: 'Reunião mensal com os líderes dos ministérios',
        category: 'reuniao',
        dueDate: '2024-01-20',
        dueTime: '19:30',
        status: 'pending',
        priority: 'medium'
    },
    {
        id: '3',
        title: 'Aniversário João Silva',
        description: 'Enviar mensagem de parabéns',
        category: 'aniversario',
        dueDate: '2024-01-18',
        dueTime: '09:00',
        status: 'completed',
        priority: 'low'
    }
];

const Lembretes = () => {
    const { toast } = useToast();
    const [reminders, setReminders] = useState<Reminder[]>(mockReminders);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [newReminder, setNewReminder] = useState({
        title: '',
        description: '',
        category: 'outros' as ReminderCategory,
        dueDate: '',
        dueTime: '',
        priority: 'medium' as 'low' | 'medium' | 'high'
    });

    const handleCreateReminder = () => {
        if (!newReminder.title || !newReminder.dueDate || !newReminder.dueTime) {
            toast({
                title: 'Erro',
                description: 'Preencha todos os campos obrigatórios',
                variant: 'destructive'
            });
            return;
        }

        const reminder: Reminder = {
            id: Date.now().toString(),
            ...newReminder,
            status: 'pending'
        };

        setReminders([...reminders, reminder]);
        setNewReminder({
            title: '',
            description: '',
            category: 'outros',
            dueDate: '',
            dueTime: '',
            priority: 'medium'
        });
        setIsDialogOpen(false);

        toast({
            title: 'Lembrete criado',
            description: 'O lembrete foi criado com sucesso!'
        });
    };

    const handleToggleStatus = (id: string) => {
        setReminders(reminders.map(reminder => 
            reminder.id === id 
                ? { ...reminder, status: reminder.status === 'pending' ? 'completed' : 'pending' }
                : reminder
        ));
    };

    const handleDeleteReminder = (id: string) => {
        setReminders(reminders.filter(reminder => reminder.id !== id));
        toast({
            title: 'Lembrete excluído',
            description: 'O lembrete foi excluído com sucesso!'
        });
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
                    <p className="text-muted-foreground">Gerencie seus lembretes e tarefas</p>
                </div>
                
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            Novo Lembrete
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Criar Novo Lembrete</DialogTitle>
                            <DialogDescription>
                                Preencha os dados do lembrete
                            </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
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
                        </div>
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
                                <TableHead>Categoria</TableHead>
                                <TableHead>Data/Hora</TableHead>
                                <TableHead>Prioridade</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Ações</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {reminders.map((reminder) => (
                                <TableRow key={reminder.id}>
                                    <TableCell>
                                        <div>
                                            <div className="font-medium">{reminder.title}</div>
                                            {reminder.description && (
                                                <div className="text-sm text-muted-foreground">{reminder.description}</div>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge className={getCategoryColor(reminder.category)}>
                                            {reminder.category}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center">
                                            <Calendar className="mr-1 h-4 w-4" />
                                            <span className="text-sm">
                                                {new Date(reminder.dueDate).toLocaleDateString('pt-BR')} às {reminder.dueTime}
                                            </span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge className={getPriorityColor(reminder.priority)}>
                                            {getPriorityIcon(reminder.priority)}
                                            <span className="ml-1 capitalize">{reminder.priority}</span>
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={reminder.status === 'completed' ? 'default' : 'secondary'}>
                                            {reminder.status === 'completed' ? 'Concluído' : 'Pendente'}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex gap-2">
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => handleToggleStatus(reminder.id)}
                                            >
                                                {reminder.status === 'completed' ? 'Reabrir' : 'Concluir'}
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
        </div>
    );
};

export default Lembretes;

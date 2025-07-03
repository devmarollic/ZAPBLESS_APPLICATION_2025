
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { Plus, Pencil, Trash2, Users, UserCheck } from 'lucide-react';
import { MinistryService, Ministry } from '@/services/ministryService';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

const MinisterioGerenciar = () => {
    const { toast } = useToast();
    const navigate = useNavigate();
    const [ministries, setMinistries] = useState<Ministry[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isDeleting, setIsDeleting] = useState<string | null>(null);

    useEffect(() => {
        loadMinistries();
    }, []);

    const loadMinistries = async () => {
        try {
            setIsLoading(true);
            const response = await MinistryService.getMinistries();
            
            if (Array.isArray(response)) {
                setMinistries(response);
            } else {
                console.log('Response message:', response.message);
                setMinistries([]);
            }
        } catch (error) {
            console.error('Error loading ministries:', error);
            toast({
                title: 'Erro ao carregar ministérios',
                description: 'Não foi possível carregar a lista de ministérios.',
                variant: 'destructive',
            });
            setMinistries([]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (ministryId: string) => {
        try {
            setIsDeleting(ministryId);
            await MinistryService.deleteMinistry(ministryId);
            
            toast({
                title: 'Ministério excluído',
                description: 'O ministério foi excluído com sucesso.',
            });
            
            await loadMinistries();
        } catch (error) {
            console.error('Error deleting ministry:', error);
            toast({
                title: 'Erro ao excluir ministério',
                description: 'Não foi possível excluir o ministério. Tente novamente.',
                variant: 'destructive',
            });
        } finally {
            setIsDeleting(null);
        }
    };

    const getLeaderName = (ministry: Ministry) => {
        if (ministry.leaderArray && ministry.leaderArray.length > 0) {
            return ministry.leaderArray[0].profile.legalName;
        }
        return 'Sem líder';
    };

    const getMemberCount = (ministry: Ministry) => {
        if (ministry.memberCountArray && ministry.memberCountArray.length > 0) {
            return ministry.memberCountArray[0].count;
        }
        return 0;
    };

    if (isLoading) {
        return (
            <div className="container mx-auto py-6">
                <div className="flex justify-center items-center h-64">
                    <div className="text-lg">Carregando ministérios...</div>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto py-6">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold">Gerenciar Ministérios</h1>
                    <p className="text-muted-foreground">Gerencie os ministérios da sua igreja</p>
                </div>
                <Button onClick={() => navigate('/dashboard/ministerios/novo')}>
                    <Plus className="mr-2 h-4 w-4" />
                    Novo Ministério
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Ministérios Cadastrados</CardTitle>
                    <CardDescription>
                        Lista de todos os ministérios da igreja
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {ministries.length === 0 ? (
                        <div className="text-center py-8">
                            <Users className="mx-auto h-12 w-12 text-muted-foreground" />
                            <h3 className="mt-4 text-lg font-semibold">Nenhum ministério encontrado</h3>
                            <p className="text-muted-foreground">Comece criando seu primeiro ministério.</p>
                            <Button 
                                onClick={() => navigate('/dashboard/ministerios/novo')}
                                className="mt-4"
                            >
                                <Plus className="mr-2 h-4 w-4" />
                                Criar Primeiro Ministério
                            </Button>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Nome</TableHead>
                                        <TableHead>Descrição</TableHead>
                                        <TableHead>Líder</TableHead>
                                        <TableHead>Membros</TableHead>
                                        <TableHead>Cor</TableHead>
                                        <TableHead className="text-right">Ações</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {ministries.map((ministry) => (
                                        <TableRow key={ministry.id}>
                                            <TableCell className="font-medium">
                                                {ministry.name}
                                            </TableCell>
                                            <TableCell className="max-w-xs truncate">
                                                {ministry.description}
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center">
                                                    <UserCheck className="mr-2 h-4 w-4 text-muted-foreground" />
                                                    {getLeaderName(ministry)}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="secondary">
                                                    {getMemberCount(ministry)} membros
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <div
                                                    className="w-6 h-6 rounded-full border"
                                                    style={{ backgroundColor: ministry.color }}
                                                />
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => navigate(`/dashboard/ministerios/editar/${ministry.id}`)}
                                                    >
                                                        <Pencil className="h-4 w-4" />
                                                    </Button>
                                                    <AlertDialog>
                                                        <AlertDialogTrigger asChild>
                                                            <Button 
                                                                variant="outline" 
                                                                size="sm"
                                                                disabled={isDeleting === ministry.id}
                                                            >
                                                                <Trash2 className="h-4 w-4" />
                                                            </Button>
                                                        </AlertDialogTrigger>
                                                        <AlertDialogContent>
                                                            <AlertDialogHeader>
                                                                <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                                                                <AlertDialogDescription>
                                                                    Tem certeza que deseja excluir o ministério "{ministry.name}"? 
                                                                    Esta ação não pode ser desfeita.
                                                                </AlertDialogDescription>
                                                            </AlertDialogHeader>
                                                            <AlertDialogFooter>
                                                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                                                <AlertDialogAction
                                                                    onClick={() => handleDelete(ministry.id)}
                                                                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                                                >
                                                                    Excluir
                                                                </AlertDialogAction>
                                                            </AlertDialogFooter>
                                                        </AlertDialogContent>
                                                    </AlertDialog>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default MinisterioGerenciar;

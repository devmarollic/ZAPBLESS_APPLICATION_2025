
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { HttpClient } from '@/lib/http_client';
import { Ministry } from '@/types/ministry';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Plus, Edit, Trash2, Building } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';

const Ministerios = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [ministryToDelete, setMinistryToDelete] = useState<Ministry | null>(null);

  const { data: ministries, isLoading, error, refetch } = useQuery({
    queryKey: ['ministries'],
    queryFn: async () => {
      try {
        return await HttpClient.get<Ministry[]>('/ministry/list');
      } catch (error) {
        console.error('Error fetching ministries:', error);
        throw error;
      }
    }
  });

  const handleDelete = async () => {
    if (!ministryToDelete) return;
    
    try {
      await HttpClient.patch(`/ministerios/${ministryToDelete.id}/delete`, null);
      
      toast({
        title: 'Ministério excluído',
        description: `O ministério ${ministryToDelete.name} foi excluído com sucesso`,
      });
      
      refetch();
    } catch (error) {
      console.error('Failed to delete ministry:', error);
      
      toast({
        title: 'Erro ao excluir',
        description: 'Não foi possível excluir o ministério. Tente novamente.',
        variant: 'destructive',
      });
    } finally {
      setDeleteDialogOpen(false);
      setMinistryToDelete(null);
    }
  };

  const confirmDelete = (ministry: Ministry) => {
    setMinistryToDelete(ministry);
    setDeleteDialogOpen(true);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-zapPurple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando ministérios...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-4">
        <h2 className="text-2xl font-bold text-red-600 mb-2">Erro ao carregar ministérios</h2>
        <p className="text-gray-600 mb-4">Não foi possível carregar a lista de ministérios.</p>
        <Button onClick={() => refetch()}>Tentar novamente</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Ministérios</h1>
        <Button 
          onClick={() => navigate('/dashboard/ministerios/novo')} 
          className="bg-gradient-to-r from-zapBlue-600 to-zapPurple-600 hover:from-zapBlue-700 hover:to-zapPurple-700"
        >
          <Plus className="mr-2 h-4 w-4" /> Novo Ministério
        </Button>
      </div>
      
      {ministries && ministries.length > 0 ? (
        <Table>
          <TableCaption>Lista de ministérios da igreja.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Descrição</TableHead>
              <TableHead>Líder</TableHead>
              <TableHead>Membros</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {ministries.map((ministry) => (
              <TableRow key={ministry.id}>
                <TableCell className="font-medium">{ministry.name}</TableCell>
                <TableCell className="line-clamp-4">{ministry.description}</TableCell>
                <TableCell>{ministry.leaderArray?.[ 0 ]?.profile?.legalName || 'Não definido'}</TableCell>
                <TableCell>{ministry.memberCountArray?.[ 0 ]?.count || 0}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate(`/dashboard/ministerios/editar/${ministry.id}`)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => confirmDelete(ministry)}
                      className="text-red-600 hover:text-red-700 hover:border-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <div className="flex flex-col items-center justify-center bg-gray-50 rounded-lg p-8 text-center">
          <div className="bg-gray-100 p-4 rounded-full mb-4">
            <Building className="h-12 w-12 text-gray-400" />
          </div>
          <h3 className="text-xl font-medium text-gray-900 mb-2">Nenhum ministério encontrado</h3>
          <p className="text-gray-600 mb-4">Você ainda não criou nenhum ministério.</p>
          <Button 
            onClick={() => navigate('/dashboard/ministerios/novo')}
            className="bg-gradient-to-r from-zapBlue-600 to-zapPurple-600 hover:from-zapBlue-700 hover:to-zapPurple-700"
          >
            <Plus className="mr-2 h-4 w-4" /> Criar Ministério
          </Button>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Excluir ministério</DialogTitle>
            <DialogDescription>
              Esta ação não pode ser desfeita. Isso excluirá permanentemente o ministério
              <span className="font-semibold"> {ministryToDelete?.name}</span>.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setDeleteDialogOpen(false)}
            >
              Cancelar
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDelete}
            >
              Excluir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Ministerios;

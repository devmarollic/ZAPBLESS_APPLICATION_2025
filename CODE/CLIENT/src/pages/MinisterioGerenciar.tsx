
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { HttpClient } from '@/lib/http_client';
import { Ministry } from '@/types/ministry';
import { useToast } from '@/hooks/use-toast';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
import { ArrowLeft, Edit, Search, Trash2 } from 'lucide-react';

const MinisterioGerenciar = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [ministryToDelete, setMinistryToDelete] = useState<Ministry | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const { data: ministries, isLoading, error, refetch } = useQuery({
    queryKey: ['ministries'],
    queryFn: async () => {
      try {
        return await HttpClient.get<Ministry[]>('/ministerios');
      } catch (error) {
        console.error('Error fetching ministries:', error);
        throw error;
      }
    }
  });

  const filteredMinistries = ministries?.filter(
    (ministry) => 
      ministry.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ministry.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (ministry.leader && ministry.leader.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleDelete = async () => {
    if (!ministryToDelete) return;
    
    try {
      await HttpClient.delete(`/ministerios/${ministryToDelete.id}/delete`);
      
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
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Gerenciar Ministérios</h1>
        <Button
          variant="outline"
          onClick={() => navigate('/dashboard/ministerios')}
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Voltar
        </Button>
      </div>
      
      <div className="flex items-center">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            type="search"
            placeholder="Buscar ministério..."
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      
      {filteredMinistries && filteredMinistries.length > 0 ? (
        <div className="rounded-md border">
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
              {filteredMinistries.map((ministry) => (
                <TableRow key={ministry.id}>
                  <TableCell className="font-medium">{ministry.name}</TableCell>
                  <TableCell className="max-w-xs truncate">{ministry.description}</TableCell>
                  <TableCell>{ministry.leader || 'Não definido'}</TableCell>
                  <TableCell>{ministry.members_count || 0}</TableCell>
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
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center bg-gray-50 rounded-lg p-8 text-center">
          <h3 className="text-xl font-medium text-gray-900 mb-2">
            {searchTerm ? 'Nenhum ministério encontrado' : 'Não há ministérios cadastrados'}
          </h3>
          <p className="text-gray-600 mb-4">
            {searchTerm 
              ? 'Não encontramos nenhum ministério com os critérios de busca informados.' 
              : 'Você ainda não criou nenhum ministério.'}
          </p>
          {searchTerm ? (
            <Button 
              variant="outline"
              onClick={() => setSearchTerm('')}
            >
              Limpar busca
            </Button>
          ) : (
            <Button 
              onClick={() => navigate('/dashboard/ministerios/novo')}
              className="bg-gradient-to-r from-zapBlue-600 to-zapPurple-600 hover:from-zapBlue-700 hover:to-zapPurple-700"
            >
              Criar Ministério
            </Button>
          )}
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

export default MinisterioGerenciar;

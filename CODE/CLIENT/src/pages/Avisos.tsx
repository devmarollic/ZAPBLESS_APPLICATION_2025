
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { HttpClient } from '@/lib/http_client';
import { Announcement } from '@/types/announcement';
import { useToast } from '@/hooks/use-toast';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Plus, Search, Filter } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const PriorityBadge = ({ priority }: { priority: string | undefined }) => {
  if (!priority) return null;
  
  const colors: Record<string, string> = {
    low: "bg-green-100 text-green-800 hover:bg-green-100",
    medium: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100",
    high: "bg-red-100 text-red-800 hover:bg-red-100",
  };
  
  return (
    <Badge variant="outline" className={colors[priority]}>
      {priority === 'low' ? 'Baixa' : priority === 'medium' ? 'Média' : 'Alta'}
    </Badge>
  );
};

const Avisos = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  const { data: announcements, isLoading, error, refetch } = useQuery({
    queryKey: ['announcements'],
    queryFn: async () => {
      try {
        return await HttpClient.get<Announcement[]>('/avisos');
      } catch (error) {
        console.error('Error fetching announcements:', error);
        throw error;
      }
    }
  });
  
  // Mock data for development
  const mockAnnouncements: Announcement[] = [
    {
      id: '1',
      title: 'Culto Especial de Páscoa',
      content: 'Venha participar do nosso culto especial de Páscoa neste domingo às 18h.',
      author: 'Pastor João',
      published_at: new Date().toISOString(),
      expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      is_active: true,
      priority: 'high',
      category: 'eventos',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: '2',
      title: 'Jejum e Oração',
      content: 'Esta semana teremos nosso período de jejum e oração. Participe!',
      author: 'Ministério de Oração',
      published_at: new Date().toISOString(),
      expires_at: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
      is_active: true,
      priority: 'medium',
      category: 'atividades',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: '3',
      title: 'Reunião de Liderança',
      content: 'Lembramos a todos os líderes que teremos nossa reunião mensal no sábado.',
      author: 'Secretaria',
      published_at: new Date().toISOString(),
      expires_at: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
      is_active: true,
      priority: 'low',
      category: 'administrativo',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ];
  
  const displayAnnouncements = announcements || mockAnnouncements;
  
  const getUniqueCategories = () => {
    const categories = new Set(displayAnnouncements.map(a => a.category).filter(Boolean));
    return Array.from(categories);
  };
  
  const filteredAnnouncements = displayAnnouncements.filter((announcement) => {
    const matchesSearch = announcement.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         announcement.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (announcement.author && announcement.author.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = categoryFilter === 'all' || announcement.category === categoryFilter;
    
    return matchesSearch && matchesCategory;
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-zapPurple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando avisos...</p>
        </div>
      </div>
    );
  }

  if (error && !mockAnnouncements) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-4">
        <h2 className="text-2xl font-bold text-red-600 mb-2">Erro ao carregar avisos</h2>
        <p className="text-gray-600 mb-4">Não foi possível carregar a lista de avisos.</p>
        <Button onClick={() => refetch()}>Tentar novamente</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Avisos</h1>
        <Button
          onClick={() => navigate('/dashboard/avisos/novo')}
          className="bg-gradient-to-r from-zapBlue-600 to-zapPurple-600 hover:from-zapBlue-700 hover:to-zapPurple-700"
        >
          <Plus className="mr-2 h-4 w-4" /> Novo Aviso
        </Button>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4 items-center">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            type="search"
            placeholder="Buscar avisos..."
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex-shrink-0 w-full sm:w-auto">
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Filtrar por categoria" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas categorias</SelectItem>
              {getUniqueCategories().map((category) => (
                <SelectItem key={category} value={category || ''}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {filteredAnnouncements.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAnnouncements.map((announcement) => (
            <Card key={announcement.id} className="overflow-hidden h-full flex flex-col">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>{announcement.title}</CardTitle>
                    <CardDescription className="mt-1">
                      {announcement.author && `Por: ${announcement.author}`}
                    </CardDescription>
                  </div>
                  <PriorityBadge priority={announcement.priority} />
                </div>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-sm text-gray-700">
                  {announcement.content.length > 150
                    ? `${announcement.content.substring(0, 150)}...`
                    : announcement.content}
                </p>
                {announcement.category && (
                  <Badge variant="outline" className="mt-3">
                    {announcement.category}
                  </Badge>
                )}
              </CardContent>
              <CardFooter className="flex justify-between border-t pt-4">
                <div className="text-xs text-gray-500">
                  {announcement.expires_at && (
                    <>Expira em: {format(new Date(announcement.expires_at), 'dd/MM/yyyy', { locale: ptBR })}</>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => navigate(`/dashboard/avisos/gerenciar?id=${announcement.id}`)}
                  >
                    Ver detalhes
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center bg-gray-50 rounded-lg p-8 text-center">
          <h3 className="text-xl font-medium text-gray-900 mb-2">
            {searchTerm || categoryFilter !== 'all' ? 'Nenhum aviso encontrado' : 'Não há avisos cadastrados'}
          </h3>
          <p className="text-gray-600 mb-4">
            {searchTerm || categoryFilter !== 'all'
              ? 'Não encontramos nenhum aviso com os critérios de busca informados.'
              : 'Você ainda não criou nenhum aviso.'}
          </p>
          {(searchTerm || categoryFilter !== 'all') ? (
            <Button
              variant="outline"
              onClick={() => {
                setSearchTerm('');
                setCategoryFilter('all');
              }}
            >
              Limpar filtros
            </Button>
          ) : (
            <Button
              onClick={() => navigate('/dashboard/avisos/novo')}
              className="bg-gradient-to-r from-zapBlue-600 to-zapPurple-600 hover:from-zapBlue-700 hover:to-zapPurple-700"
            >
              Criar Aviso
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default Avisos;

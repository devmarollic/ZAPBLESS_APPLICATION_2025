
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { HttpClient } from '@/lib/http_client';
import { Ministry } from '@/types/ministry';
import { useToast } from '@/hooks/use-toast';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ArrowLeft, FileDown, Check, Download } from 'lucide-react';

const MinisterioExportar = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [exporting, setExporting] = useState(false);
  const [exported, setExported] = useState(false);

  const { data: ministries, isLoading } = useQuery({
    queryKey: ['ministries'],
    queryFn: async () => {
      try {
        return await HttpClient.getDefault().get<Ministry[]>('/ministerios');
      } catch (error) {
        console.error('Error fetching ministries:', error);
        throw error;
      }
    }
  });

  const handleExport = async (format: 'csv' | 'json' | 'xlsx') => {
    try {
      setExporting(true);
      
      // Placeholder for real export functionality
      // In a real app, you would call an API endpoint to get the export file
      // For now, we'll create a simple file client-side
      
      let data: any;
      let fileType: string;
      let fileName: string;
      
      if (format === 'json') {
        data = JSON.stringify(ministries || [], null, 2);
        fileType = 'application/json';
        fileName = 'ministerios.json';
      } else if (format === 'csv') {
        // Simple CSV format
        const headers = ['id', 'name', 'description', 'leader', 'members_count'];
        const rows = (ministries || []).map(ministry => 
          headers.map(header => ministry[header as keyof Ministry] || '').join(',')
        );
        data = [headers.join(','), ...rows].join('\n');
        fileType = 'text/csv';
        fileName = 'ministerios.csv';
      } else {
        // XLSX would typically be handled server-side
        toast({
          title: 'Formato não suportado',
          description: 'O formato XLSX será implementado em breve.',
          variant: 'destructive',
        });
        setExporting(false);
        return;
      }
      
      // Create and download file
      const blob = new Blob([data as BlobPart], { type: fileType });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      setExported(true);
      
      toast({
        title: 'Exportação concluída',
        description: `Os dados dos ministérios foram exportados para ${fileName}`,
      });
    } catch (error) {
      console.error('Export failed:', error);
      toast({
        title: 'Erro na exportação',
        description: 'Não foi possível exportar os dados dos ministérios.',
        variant: 'destructive',
      });
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Exportar Ministérios</h1>
        <Button
          variant="outline"
          onClick={() => navigate('/dashboard/ministerios')}
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Voltar
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Exportar para CSV</CardTitle>
            <CardDescription>
              Exporte seus ministérios em formato CSV para uso em Excel, Google Sheets e outros.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">
              Formato compatível com a maioria dos programas de planilha.
              Os dados incluirão nome, descrição, líder e número de membros.
            </p>
          </CardContent>
          <CardFooter>
            <Button 
              onClick={() => handleExport('csv')}
              className="w-full"
              disabled={exporting || isLoading}
            >
              {exporting ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-t-transparent" />
                  Exportando...
                </>
              ) : (
                <>
                  <FileDown className="mr-2 h-4 w-4" /> Exportar CSV
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Exportar para JSON</CardTitle>
            <CardDescription>
              Exporte seus ministérios em formato JSON para desenvolvimento ou integração.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">
              Formato ideal para desenvolvedores e integrações com outros sistemas.
              Contém todos os dados dos ministérios em formato estruturado.
            </p>
          </CardContent>
          <CardFooter>
            <Button 
              onClick={() => handleExport('json')}
              className="w-full"
              disabled={exporting || isLoading}
            >
              {exporting ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-t-transparent" />
                  Exportando...
                </>
              ) : (
                <>
                  <FileDown className="mr-2 h-4 w-4" /> Exportar JSON
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Exportar para Excel</CardTitle>
            <CardDescription>
              Exporte seus ministérios em formato XLSX para uso no Microsoft Excel.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">
              Formato nativo do Microsoft Excel. Os dados serão formatados
              e organizados em uma planilha pronta para uso.
            </p>
          </CardContent>
          <CardFooter>
            <Button 
              onClick={() => handleExport('xlsx')}
              className="w-full"
              disabled={exporting || isLoading || true}
            >
              <FileDown className="mr-2 h-4 w-4" /> Exportar XLSX
              <span className="text-xs ml-1">(em breve)</span>
            </Button>
          </CardFooter>
        </Card>
      </div>
      
      {exported && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start">
          <Check className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
          <div>
            <h3 className="font-medium text-green-800">Exportação concluída com sucesso</h3>
            <p className="text-sm text-green-700 mt-1">
              Se o download não iniciar automaticamente, clique no botão abaixo.
            </p>
            <Button
              variant="outline" 
              size="sm"
              className="mt-2"
              onClick={() => handleExport('csv')}
            >
              <Download className="mr-2 h-4 w-4" />
              Baixar novamente
            </Button>
          </div>
        </div>
      )}
      
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
        <h3 className="font-medium text-amber-800">Dicas para exportação</h3>
        <ul className="mt-2 space-y-1 text-sm text-amber-700 list-disc pl-5">
          <li>A exportação inclui todos os ministérios ativos no sistema</li>
          <li>Para CSV e Excel, alguns caracteres especiais podem ser convertidos</li>
          <li>Recomendamos o formato JSON para garantir fidelidade total dos dados</li>
          <li>Os dados exportados não incluem informações sensíveis dos membros</li>
        </ul>
      </div>
    </div>
  );
};

export default MinisterioExportar;

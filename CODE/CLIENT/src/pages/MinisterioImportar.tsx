
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { HttpClient } from '@/lib/http_client';
import { useToast } from '@/hooks/use-toast';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Upload } from 'lucide-react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';

const MinisterioImportar = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleImport = async () => {
    if (!file) {
      toast({
        title: 'Nenhum arquivo selecionado',
        description: 'Por favor, selecione um arquivo CSV ou Excel para importar.',
        variant: 'destructive',
      });
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    setIsUploading(true);

    try {
              await HttpClient.getDefault().postForm('/ministerios/importar', formData);
      
      toast({
        title: 'Importação bem-sucedida',
        description: 'Os ministérios foram importados com sucesso!',
      });
      
      navigate('/dashboard/ministerios');
    } catch (error) {
      console.error('Failed to import ministries:', error);
      
      toast({
        title: 'Erro na importação',
        description: 'Não foi possível importar os ministérios. Verifique o formato do arquivo e tente novamente.',
        variant: 'destructive',
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Importar Ministérios</h1>
        <Button
          variant="outline"
          onClick={() => navigate('/dashboard/ministerios')}
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Voltar
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Enviar arquivo CSV ou Excel</CardTitle>
          <CardDescription>
            Faça o upload de um arquivo CSV ou Excel com os dados dos ministérios para importação.
            O arquivo deve conter as colunas: nome, descrição e líder (opcional).
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Input 
                id="file" 
                type="file" 
                accept=".csv,.xlsx,.xls" 
                onChange={handleFileChange} 
              />
              <p className="text-xs text-muted-foreground">
                Formatos suportados: .csv, .xlsx, .xls
              </p>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between border-t px-6 py-4">
          <Button 
            variant="outline"
            onClick={() => navigate('/dashboard/ministerios')}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleImport}
            className="bg-gradient-to-r from-zapBlue-600 to-zapPurple-600 hover:from-zapBlue-700 hover:to-zapPurple-700"
            disabled={!file || isUploading}
          >
            {isUploading ? (
              <>
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-t-transparent" />
                Importando...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" /> Importar
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
      
      <div className="rounded-lg border bg-amber-50 p-4">
        <h3 className="font-semibold text-amber-800 mb-2">Dicas para importação</h3>
        <ul className="list-disc list-inside text-amber-700 space-y-1">
          <li>Certifique-se de que o arquivo segue o modelo esperado</li>
          <li>A primeira linha deve conter os cabeçalhos (nome, descrição, líder)</li>
          <li>O nome e a descrição são campos obrigatórios</li>
          <li>O líder é um campo opcional</li>
          <li>
            <a 
              href="#" 
              className="text-zapBlue-600 hover:underline"
            >
              Baixar modelo de importação
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default MinisterioImportar;

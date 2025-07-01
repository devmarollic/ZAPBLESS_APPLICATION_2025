
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Filter, MessageSquare, Plus, Search } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const membrosData = [
  { id: 1, nome: "Carlos Silva", email: "carlos@exemplo.com", telefone: "(11) 98765-4321", ministerio: "Louvor", status: "Ativo" },
  { id: 2, nome: "Maria Santos", email: "maria@exemplo.com", telefone: "(11) 91234-5678", ministerio: "Infantil", status: "Ativo" },
  { id: 3, nome: "João Oliveira", email: "joao@exemplo.com", telefone: "(11) 99876-5432", ministerio: "Jovens", status: "Inativo" },
  { id: 4, nome: "Ana Costa", email: "ana@exemplo.com", telefone: "(11) 95555-6666", ministerio: "Diaconia", status: "Ativo" },
  { id: 5, nome: "Pedro Souza", email: "pedro@exemplo.com", telefone: "(11) 97777-8888", ministerio: "Missões", status: "Ativo" },
];

const Membros = () => {
    const navigate = useNavigate();
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight gradientText">Membros</h2>
          <p className="text-muted-foreground">Gerencie os membros da sua igreja</p>
        </div>
        <Button asChild>
          <Link to="/dashboard/membros/novo">
            <Plus className="mr-2 h-4 w-4" /> Novo Membro
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Membros</CardTitle>
          <CardDescription>
            Total de {membrosData.length} membros cadastrados
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row justify-between mb-4 gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
              <Input placeholder="Pesquisar membro..." className="pl-9" />
            </div>
            <div className="flex gap-2">
              <Button variant="outline">
                <Filter className="mr-2 h-4 w-4" /> Filtrar
              </Button>
              <Button variant="outline">
                Importar
              </Button>
              <Button variant="outline">
                Exportar
              </Button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="py-3 text-left font-medium">Nome</th>
                  <th className="py-3 text-left font-medium">E-mail</th>
                  <th className="py-3 text-left font-medium">Telefone</th>
                  <th className="py-3 text-left font-medium">Ministério</th>
                  <th className="py-3 text-left font-medium">Status</th>
                  <th className="py-3 text-left font-medium">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {membrosData.map((membro) => (
                  <tr key={membro.id} className="hover:bg-gray-50">
                    <td className="py-3">{membro.nome}</td>
                    <td className="py-3">{membro.email}</td>
                    <td className="py-3">{membro.telefone}</td>
                    <td className="py-3">{membro.ministerio}</td>
                    <td className="py-3">
                      <span className={`inline-block px-2 py-1 rounded-full text-xs ${membro.status === "Ativo" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                        {membro.status}
                      </span>
                    </td>
                    <td className="py-3">
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => navigate(`/dashboard/membros/editar/${membro.id}`)}>Editar</Button>
                        <Button size="sm" variant="outline">
                          <MessageSquare className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Membros;

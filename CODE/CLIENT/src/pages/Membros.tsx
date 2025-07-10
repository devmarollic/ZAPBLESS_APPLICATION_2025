
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Filter, MessageSquare, Plus, Search, Loader2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { ContactService, Contact } from "@/services/contactService";
import { useToast } from "@/components/ui/use-toast";
import { AuthenticationService } from "@/lib/authentication_service";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getUserInitials } from "@/utils/getUserInitials";

const Membros = () => {
    const navigate = useNavigate();
    const { toast } = useToast();
    const [contacts, setContacts] = useState<Contact[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    const churchId = AuthenticationService.getChurchId();

    useEffect(() => {
        loadContacts();
    }, []);

    const loadContacts = async () => {
        try {
            setLoading(true);
            const contactsData = await ContactService.getContactsByChurch(churchId);
            setContacts(contactsData);
        } catch (error) {
            console.error('Erro ao carregar contatos:', error);
            toast({
                title: "Erro",
                description: "Não foi possível carregar os contatos.",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    const filteredContacts = contacts.filter(contact =>
        contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contact.number.includes(searchTerm)
    );

    const getStatusLabel = (contact: Contact) => {
        return "Ativo"; // Por enquanto, todos ativos
    };

    const getMinistryLabel = (contact: Contact) => {
        return contact.ecclesiasticalTitle || "Membro";
    };

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
                        Total de {filteredContacts.length} membros cadastrados
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col md:flex-row justify-between mb-4 gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                            <Input
                                placeholder="Pesquisar membro..."
                                className="pl-9"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
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

                    {loading ? (
                        <div className="flex items-center justify-center py-8">
                            <Loader2 className="h-8 w-8 animate-spin" />
                            <span className="ml-2">Carregando membros...</span>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-gray-200">
                                        <th className="py-3 text-left font-medium">Nome</th>
                                        <th className="py-3 text-left font-medium">Telefone</th>
                                        <th className="py-3 text-left font-medium">Título</th>
                                        <th className="py-3 text-left font-medium">Status</th>
                                        <th className="py-3 text-left font-medium">Ações</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {filteredContacts.map((contact) => (
                                        <tr key={contact.id} className="hover:bg-gray-50">
                                            <td className="py-3">
                                                <div className="flex items-center gap-2">
                                                    <Avatar className="h-8 w-8">
                                                        <AvatarImage src={contact?.imgUrl} alt={contact?.name} />
                                                        <AvatarFallback className="bg-zapPurple-600 text-white text-sm">
                                                            {getUserInitials(contact?.name)}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    {contact?.name || 'Contato não salvo'}
                                                </div>
                                            </td>
                                            <td className="py-3">{contact.number}</td>
                                            <td className="py-3">{getMinistryLabel(contact)}</td>
                                            <td className="py-3">
                                                <span className="inline-block px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                                                    {getStatusLabel(contact)}
                                                </span>
                                            </td>
                                            <td className="py-3">
                                                <div className="flex gap-2">
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() => navigate(`/dashboard/membros/editar/${contact.id}`)}
                                                    >
                                                        Editar
                                                    </Button>
                                                    <Button size="sm" variant="outline">
                                                        <MessageSquare className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    {filteredContacts.length === 0 && (
                                        <tr>
                                            <td colSpan={5} className="py-8 text-center text-gray-500">
                                                {searchTerm ? "Nenhum membro encontrado com os critérios de busca." : "Nenhum membro cadastrado ainda."}
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default Membros;

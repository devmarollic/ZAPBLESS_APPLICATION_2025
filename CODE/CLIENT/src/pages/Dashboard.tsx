
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer } from '@/components/ui/chart';
import { ChartLegend, ChartLegendContent } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { MessageSquare, Users, Building, Bell } from 'lucide-react';
import { AuthenticationService } from '@/lib/authentication_service';
import WhatsAppSync from '@/components/WhatsAppSync';
import ChartWrapper from '@/components/ui/chart-wrapper';
import { useDashboard } from '@/hooks/use-dashboard';

const dashboardData = [
    { name: 'Domingo', membros: 120, mensagens: 45 },
    { name: 'Segunda', membros: 30, mensagens: 15 },
    { name: 'Terça', membros: 45, mensagens: 20 },
    { name: 'Quarta', membros: 80, mensagens: 35 },
    { name: 'Quinta', membros: 65, mensagens: 28 },
    { name: 'Sexta', membros: 70, mensagens: 30 },
    { name: 'Sábado', membros: 90, mensagens: 40 }
];

const Dashboard = () => {
    const { ministries, isLoading } = useDashboard();

    // Transform ministries data for the chart
    const ministeriosData = ministries?.map(ministry => ({
        name: ministry.name,
        membros: Math.floor(Math.random() * 50) + 5 // Temporary random data until we have real member counts
    })) || [
        { name: 'Louvor', membros: 25 },
        { name: 'Infantil', membros: 15 },
        { name: 'Jovens', membros: 40 },
        { name: 'Diaconia', membros: 12 },
        { name: 'Missões', membros: 8 }
    ];

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-3xl font-bold tracking-tight gradientText">Visão Geral</h2>
                <p className="text-muted-foreground">Bem-vindo {AuthenticationService.getUsername()}, ao dashboard da sua igreja!</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total de Membros</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">245</div>
                        <p className="text-xs text-muted-foreground">
                            +12 neste mês
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Mensagens Enviadas</CardTitle>
                        <MessageSquare className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">1,253</div>
                        <p className="text-xs text-muted-foreground">
                            +124 nesta semana
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Ministérios Ativos</CardTitle>
                        <Building className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{ministries?.length || 8}</div>
                        <p className="text-xs text-muted-foreground">
                            +2 neste trimestre
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Avisos Publicados</CardTitle>
                        <Bell className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">42</div>
                        <p className="text-xs text-muted-foreground">
                            +8 neste mês
                        </p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                <WhatsAppSync />
                <Card className="col-span-1">
                    <CardHeader>
                        <CardTitle>Atividade Semanal</CardTitle>
                        <CardDescription>
                            Acompanhe os membros e mensagens da última semana
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="pl-2">
                        <ChartContainer
                            config={{
                                membros: {
                                    label: "Membros",
                                    color: "#3B82F6",
                                },
                                mensagens: {
                                    label: "Mensagens",
                                    color: "#8B5CF6",
                                },
                            }}
                            className="aspect-[4/3]"
                        >
                            <ChartWrapper>
                                <BarChart
                                    data={dashboardData}
                                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip />
                                    <Bar dataKey="membros" fill="#3B82F6" name="Membros" />
                                    <Bar dataKey="mensagens" fill="#8B5CF6" name="Mensagens" />
                                </BarChart>
                                <ChartLegend>
                                    <ChartLegendContent />
                                </ChartLegend>
                            </ChartWrapper>
                        </ChartContainer>
                    </CardContent>
                </Card>
            </div>

            <Card className="col-span-1">
                <CardHeader>
                    <CardTitle>Distribuição de Ministérios</CardTitle>
                    <CardDescription>
                        Membros por ministério
                    </CardDescription>
                </CardHeader>
                <CardContent className="pl-2">
                    {isLoading ? (
                        <div className="flex items-center justify-center h-[300px]">
                            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-zapPurple-600"></div>
                        </div>
                    ) : (
                        <ChartContainer
                            config={{
                                membros: {
                                    label: "Membros",
                                    color: "#8B5CF6",
                                },
                            }}
                            className="aspect-[4/3]"
                        >
                            <ChartWrapper>
                                <BarChart
                                    data={ministeriosData}
                                    layout="vertical"
                                    margin={{ top: 10, right: 30, left: 40, bottom: 0 }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis type="number" />
                                    <YAxis dataKey="name" type="category" />
                                    <Tooltip />
                                    <Bar dataKey="membros" fill="#8B5CF6" name="Membros" />
                                </BarChart>
                            </ChartWrapper>
                        </ChartContainer>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default Dashboard;


import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer } from '@/components/ui/chart';
import { ChartLegend, ChartLegendContent } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { Users, UserPlus, UserMinus, TrendingUp } from 'lucide-react';
import ChartWrapper from '@/components/ui/chart-wrapper';

const crescimentoData = [
    { mes: 'Jan', novos: 12, inativos: 3, total: 245 },
    { mes: 'Fev', novos: 18, inativos: 5, total: 258 },
    { mes: 'Mar', novos: 15, inativos: 2, total: 271 },
    { mes: 'Abr', novos: 22, inativos: 7, total: 286 },
    { mes: 'Mai', novos: 19, inativos: 4, total: 301 },
    { mes: 'Jun', novos: 25, inativos: 6, total: 320 }
];

const faixaEtariaData = [
    { faixa: '0-12 anos', quantidade: 45, color: '#3B82F6' },
    { faixa: '13-17 anos', quantidade: 32, color: '#8B5CF6' },
    { faixa: '18-35 anos', quantidade: 89, color: '#F59E0B' },
    { faixa: '36-55 anos', quantidade: 76, color: '#10B981' },
    { faixa: '56+ anos', quantidade: 58, color: '#EF4444' }
];

const participacaoData = [
    { ministerio: 'Louvor', ativos: 25, total: 30 },
    { ministerio: 'Infantil', ativos: 18, total: 20 },
    { ministerio: 'Jovens', ativos: 35, total: 40 },
    { ministerio: 'Diaconia', ativos: 15, total: 18 },
    { ministerio: 'Missões', ativos: 12, total: 15 },
    { ministerio: 'Intercessão', ativos: 20, total: 25 }
];

const presencaData = [
    { semana: 'Sem 1', presentes: 180, total: 300 },
    { semana: 'Sem 2', presentes: 195, total: 300 },
    { semana: 'Sem 3', presentes: 210, total: 300 },
    { semana: 'Sem 4', presentes: 175, total: 300 }
];

const GraficosMembros = () => {
    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-3xl font-bold tracking-tight gradientText">Gráficos de Membros</h2>
                <p className="text-muted-foreground">Análise detalhada da congregação e participação dos membros</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total de Membros</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">320</div>
                        <p className="text-xs text-muted-foreground">
                            +19 novos este mês
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Novos Membros</CardTitle>
                        <UserPlus className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">25</div>
                        <p className="text-xs text-muted-foreground">
                            Este mês
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Taxa de Presença</CardTitle>
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">65.6%</div>
                        <p className="text-xs text-muted-foreground">
                            +3.2% em relação ao mês passado
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Membros Inativos</CardTitle>
                        <UserMinus className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">6</div>
                        <p className="text-xs text-muted-foreground">
                            -2 em relação ao mês passado
                        </p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Crescimento da Congregação</CardTitle>
                        <CardDescription>
                            Evolução mensal de novos membros e total da congregação
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="pl-2">
                        <ChartContainer
                            config={{
                                novos: {
                                    label: "Novos Membros",
                                    color: "#10B981",
                                },
                                total: {
                                    label: "Total",
                                    color: "#3B82F6",
                                },
                            }}
                            className="aspect-[4/3]"
                        >
                            <ChartWrapper>
                                <BarChart
                                    data={crescimentoData}
                                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="mes" />
                                    <YAxis />
                                    <Tooltip />
                                    <Bar dataKey="novos" fill="#10B981" name="Novos Membros" />
                                    <Line 
                                        type="monotone" 
                                        dataKey="total" 
                                        stroke="#3B82F6" 
                                        strokeWidth={2}
                                        name="Total"
                                    />
                                </BarChart>
                                <ChartLegend>
                                    <ChartLegendContent />
                                </ChartLegend>
                            </ChartWrapper>
                        </ChartContainer>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Distribuição por Faixa Etária</CardTitle>
                        <CardDescription>
                            Perfil demográfico da congregação
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="pl-2">
                        <ChartContainer
                            config={{
                                quantidade: {
                                    label: "Membros",
                                    color: "#8B5CF6",
                                },
                            }}
                            className="aspect-[4/3]"
                        >
                            <ChartWrapper>
                                <PieChart>
                                    <Pie
                                        data={faixaEtariaData}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        label={({ faixa, percent }) => `${faixa} ${(percent * 100).toFixed(0)}%`}
                                        outerRadius={80}
                                        fill="#8884d8"
                                        dataKey="quantidade"
                                    >
                                        {faixaEtariaData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ChartWrapper>
                        </ChartContainer>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Participação em Ministérios</CardTitle>
                        <CardDescription>
                            Membros ativos por ministério
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="pl-2">
                        <ChartContainer
                            config={{
                                ativos: {
                                    label: "Ativos",
                                    color: "#10B981",
                                },
                                total: {
                                    label: "Total",
                                    color: "#6B7280",
                                },
                            }}
                            className="aspect-[4/3]"
                        >
                            <ChartWrapper>
                                <BarChart
                                    data={participacaoData}
                                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="ministerio" />
                                    <YAxis />
                                    <Tooltip />
                                    <Bar dataKey="ativos" fill="#10B981" name="Ativos" />
                                    <Bar dataKey="total" fill="#6B7280" name="Total" />
                                </BarChart>
                                <ChartLegend>
                                    <ChartLegendContent />
                                </ChartLegend>
                            </ChartWrapper>
                        </ChartContainer>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Presença Semanal</CardTitle>
                        <CardDescription>
                            Taxa de presença nas últimas semanas
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="pl-2">
                        <ChartContainer
                            config={{
                                presentes: {
                                    label: "Presentes",
                                    color: "#8B5CF6",
                                },
                            }}
                            className="aspect-[4/3]"
                        >
                            <ChartWrapper>
                                <LineChart
                                    data={presencaData}
                                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="semana" />
                                    <YAxis />
                                    <Tooltip />
                                    <Line 
                                        type="monotone" 
                                        dataKey="presentes" 
                                        stroke="#8B5CF6" 
                                        strokeWidth={2}
                                        name="Presentes"
                                    />
                                </LineChart>
                            </ChartWrapper>
                        </ChartContainer>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default GraficosMembros;


import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer } from '@/components/ui/chart';
import { ChartLegend, ChartLegendContent } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { Building, Users, Activity, TrendingUp } from 'lucide-react';
import ChartWrapper from '@/components/ui/chart-wrapper';

const ministeriosData = [
    { nome: 'Louvor', membros: 25, eventos: 8, participacao: 92 },
    { nome: 'Infantil', membros: 18, eventos: 12, participacao: 88 },
    { nome: 'Jovens', membros: 35, eventos: 15, participacao: 85 },
    { nome: 'Diaconia', membros: 15, eventos: 6, participacao: 95 },
    { nome: 'Missões', membros: 12, eventos: 4, participacao: 90 },
    { nome: 'Intercessão', membros: 20, eventos: 10, participacao: 87 }
];

const crescimentoMinisteriosData = [
    { mes: 'Jan', novos: 5, total: 108 },
    { mes: 'Fev', novos: 8, total: 116 },
    { mes: 'Mar', novos: 6, total: 122 },
    { mes: 'Abr', novos: 12, total: 134 },
    { mes: 'Mai', novos: 9, total: 143 },
    { mes: 'Jun', novos: 7, total: 150 }
];

const eventosPorMinisterioData = [
    { mes: 'Jan', louvor: 6, infantil: 8, jovens: 12, diaconia: 4 },
    { mes: 'Fev', louvor: 8, infantil: 10, jovens: 15, diaconia: 5 },
    { mes: 'Mar', louvor: 7, infantil: 12, jovens: 18, diaconia: 6 },
    { mes: 'Abr', louvor: 9, infantil: 14, jovens: 20, diaconia: 7 },
    { mes: 'Mai', louvor: 8, infantil: 16, jovens: 22, diaconia: 8 },
    { mes: 'Jun', louvor: 10, infantil: 18, jovens: 25, diaconia: 9 }
];

const distribuicaoIdadeData = [
    { ministerio: 'Louvor', media: 28, color: '#3B82F6' },
    { ministerio: 'Infantil', media: 35, color: '#8B5CF6' },
    { ministerio: 'Jovens', media: 19, color: '#F59E0B' },
    { ministerio: 'Diaconia', media: 45, color: '#10B981' },
    { ministerio: 'Missões', media: 42, color: '#EF4444' },
    { ministerio: 'Intercessão', media: 52, color: '#6366F1' }
];

const GraficosMinisterios = () => {
    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-3xl font-bold tracking-tight gradientText">Gráficos de Ministérios</h2>
                <p className="text-muted-foreground">Análise detalhada dos ministérios e suas atividades</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total de Ministérios</CardTitle>
                        <Building className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">8</div>
                        <p className="text-xs text-muted-foreground">
                            +1 novo ministério este ano
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Membros Envolvidos</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">150</div>
                        <p className="text-xs text-muted-foreground">
                            47% da congregação
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Eventos Realizados</CardTitle>
                        <Activity className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">185</div>
                        <p className="text-xs text-muted-foreground">
                            Este ano
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Taxa de Participação</CardTitle>
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">89.5%</div>
                        <p className="text-xs text-muted-foreground">
                            +2.1% em relação ao trimestre passado
                        </p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Membros por Ministério</CardTitle>
                        <CardDescription>
                            Distribuição atual de membros nos ministérios
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="pl-2">
                        <ChartContainer
                            config={{
                                membros: {
                                    label: "Membros",
                                    color: "#3B82F6",
                                },
                                participacao: {
                                    label: "Participação (%)",
                                    color: "#10B981",
                                },
                            }}
                            className="aspect-[4/3]"
                        >
                            <ChartWrapper>
                                <BarChart
                                    data={ministeriosData}
                                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="nome" />
                                    <YAxis />
                                    <Tooltip />
                                    <Bar dataKey="membros" fill="#3B82F6" name="Membros" />
                                    <Bar dataKey="participacao" fill="#10B981" name="Participação (%)" />
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
                        <CardTitle>Crescimento dos Ministérios</CardTitle>
                        <CardDescription>
                            Evolução mensal do total de membros em ministérios
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="pl-2">
                        <ChartContainer
                            config={{
                                novos: {
                                    label: "Novos Membros",
                                    color: "#8B5CF6",
                                },
                                total: {
                                    label: "Total",
                                    color: "#F59E0B",
                                },
                            }}
                            className="aspect-[4/3]"
                        >
                            <ChartWrapper>
                                <LineChart
                                    data={crescimentoMinisteriosData}
                                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="mes" />
                                    <YAxis />
                                    <Tooltip />
                                    <Line 
                                        type="monotone" 
                                        dataKey="novos" 
                                        stroke="#8B5CF6" 
                                        strokeWidth={2}
                                        name="Novos Membros"
                                    />
                                    <Line 
                                        type="monotone" 
                                        dataKey="total" 
                                        stroke="#F59E0B" 
                                        strokeWidth={2}
                                        name="Total"
                                    />
                                </LineChart>
                                <ChartLegend>
                                    <ChartLegendContent />
                                </ChartLegend>
                            </ChartWrapper>
                        </ChartContainer>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Eventos por Ministério</CardTitle>
                        <CardDescription>
                            Atividades realizadas mensalmente por cada ministério
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="pl-2">
                        <ChartContainer
                            config={{
                                louvor: {
                                    label: "Louvor",
                                    color: "#3B82F6",
                                },
                                infantil: {
                                    label: "Infantil",
                                    color: "#8B5CF6",
                                },
                                jovens: {
                                    label: "Jovens",
                                    color: "#F59E0B",
                                },
                                diaconia: {
                                    label: "Diaconia",
                                    color: "#10B981",
                                },
                            }}
                            className="aspect-[4/3]"
                        >
                            <ChartWrapper>
                                <BarChart
                                    data={eventosPorMinisterioData}
                                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="mes" />
                                    <YAxis />
                                    <Tooltip />
                                    <Bar dataKey="louvor" stackId="a" fill="#3B82F6" name="Louvor" />
                                    <Bar dataKey="infantil" stackId="a" fill="#8B5CF6" name="Infantil" />
                                    <Bar dataKey="jovens" stackId="a" fill="#F59E0B" name="Jovens" />
                                    <Bar dataKey="diaconia" stackId="a" fill="#10B981" name="Diaconia" />
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
                        <CardTitle>Idade Média por Ministério</CardTitle>
                        <CardDescription>
                            Perfil demográfico dos membros de cada ministério
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="pl-2">
                        <ChartContainer
                            config={{
                                media: {
                                    label: "Idade Média",
                                    color: "#8B5CF6",
                                },
                            }}
                            className="aspect-[4/3]"
                        >
                            <ChartWrapper>
                                <PieChart>
                                    <Pie
                                        data={distribuicaoIdadeData}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        label={({ ministerio, media }) => `${ministerio} (${media} anos)`}
                                        outerRadius={80}
                                        fill="#8884d8"
                                        dataKey="media"
                                    >
                                        {distribuicaoIdadeData.map((entry, index) => (
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
        </div>
    );
};

export default GraficosMinisterios;

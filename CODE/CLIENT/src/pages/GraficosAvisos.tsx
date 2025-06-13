
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer } from '@/components/ui/chart';
import { ChartLegend, ChartLegendContent } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { Bell, Eye, Share, MessageCircle } from 'lucide-react';
import ChartWrapper from '@/components/ui/chart-wrapper';

const avisosData = [
    { mes: 'Janeiro', publicados: 12, visualizacoes: 890, compartilhamentos: 45 },
    { mes: 'Fevereiro', publicados: 15, visualizacoes: 1120, compartilhamentos: 67 },
    { mes: 'Março', publicados: 18, visualizacoes: 1340, compartilhamentos: 78 },
    { mes: 'Abril', publicados: 14, visualizacoes: 1050, compartilhamentos: 52 },
    { mes: 'Maio', publicados: 20, visualizacoes: 1580, compartilhamentos: 95 },
    { mes: 'Junho', publicados: 16, visualizacoes: 1200, compartilhamentos: 72 }
];

const categoriaData = [
    { categoria: 'Eventos', quantidade: 35, color: '#3B82F6' },
    { categoria: 'Devocionais', quantidade: 28, color: '#8B5CF6' },
    { categoria: 'Administrativo', quantidade: 20, color: '#F59E0B' },
    { categoria: 'Urgente', quantidade: 12, color: '#EF4444' },
    { categoria: 'Outros', quantidade: 15, color: '#10B981' }
];

const engajamentoData = [
    { dia: 'Dom', visualizacoes: 180, comentarios: 25, compartilhamentos: 12 },
    { dia: 'Seg', visualizacoes: 120, comentarios: 15, compartilhamentos: 8 },
    { dia: 'Ter', visualizacoes: 140, comentarios: 18, compartilhamentos: 10 },
    { dia: 'Qua', visualizacoes: 160, comentarios: 22, compartilhamentos: 11 },
    { dia: 'Qui', visualizacoes: 135, comentarios: 19, compartilhamentos: 9 },
    { dia: 'Sex', visualizacoes: 145, comentarios: 20, compartilhamentos: 10 },
    { dia: 'Sab', visualizacoes: 165, comentarios: 23, compartilhamentos: 13 }
];

const tempoVisualizacaoData = [
    { periodo: '0-1h', avisos: 25 },
    { periodo: '1-6h', avisos: 45 },
    { periodo: '6-12h', avisos: 35 },
    { periodo: '12-24h', avisos: 20 },
    { periodo: '1-3 dias', avisos: 15 },
    { periodo: '3+ dias', avisos: 10 }
];

const GraficosAvisos = () => {
    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-3xl font-bold tracking-tight gradientText">Gráficos de Avisos</h2>
                <p className="text-muted-foreground">Análise detalhada da publicação e engajamento dos avisos</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total de Avisos</CardTitle>
                        <Bell className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">95</div>
                        <p className="text-xs text-muted-foreground">
                            +16 este mês
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total de Visualizações</CardTitle>
                        <Eye className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">7.180</div>
                        <p className="text-xs text-muted-foreground">
                            +12% em relação ao mês passado
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Compartilhamentos</CardTitle>
                        <Share className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">409</div>
                        <p className="text-xs text-muted-foreground">
                            +8% em relação ao mês passado
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Taxa de Engajamento</CardTitle>
                        <MessageCircle className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">5.7%</div>
                        <p className="text-xs text-muted-foreground">
                            +0.3% em relação ao mês passado
                        </p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Avisos por Mês</CardTitle>
                        <CardDescription>
                            Evolução mensal de publicações e engajamento
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="pl-2">
                        <ChartContainer
                            config={{
                                publicados: {
                                    label: "Publicados",
                                    color: "#3B82F6",
                                },
                                visualizacoes: {
                                    label: "Visualizações",
                                    color: "#8B5CF6",
                                },
                                compartilhamentos: {
                                    label: "Compartilhamentos",
                                    color: "#10B981",
                                },
                            }}
                            className="aspect-[4/3]"
                        >
                            <ChartWrapper>
                                <BarChart
                                    data={avisosData}
                                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="mes" />
                                    <YAxis />
                                    <Tooltip />
                                    <Bar dataKey="publicados" fill="#3B82F6" name="Publicados" />
                                    <Bar dataKey="compartilhamentos" fill="#10B981" name="Compartilhamentos" />
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
                        <CardTitle>Distribuição por Categoria</CardTitle>
                        <CardDescription>
                            Tipos de avisos mais publicados
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="pl-2">
                        <ChartContainer
                            config={{
                                quantidade: {
                                    label: "Avisos",
                                    color: "#8B5CF6",
                                },
                            }}
                            className="aspect-[4/3]"
                        >
                            <ChartWrapper>
                                <PieChart>
                                    <Pie
                                        data={categoriaData}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        label={({ categoria, percent }) => `${categoria} ${(percent * 100).toFixed(0)}%`}
                                        outerRadius={80}
                                        fill="#8884d8"
                                        dataKey="quantidade"
                                    >
                                        {categoriaData.map((entry, index) => (
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
                        <CardTitle>Engajamento por Dia da Semana</CardTitle>
                        <CardDescription>
                            Padrão de visualizações e interações
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="pl-2">
                        <ChartContainer
                            config={{
                                visualizacoes: {
                                    label: "Visualizações",
                                    color: "#F59E0B",
                                },
                                comentarios: {
                                    label: "Comentários",
                                    color: "#8B5CF6",
                                },
                            }}
                            className="aspect-[4/3]"
                        >
                            <ChartWrapper>
                                <BarChart
                                    data={engajamentoData}
                                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="dia" />
                                    <YAxis />
                                    <Tooltip />
                                    <Bar dataKey="visualizacoes" fill="#F59E0B" name="Visualizações" />
                                    <Bar dataKey="comentarios" fill="#8B5CF6" name="Comentários" />
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
                        <CardTitle>Tempo de Primeira Visualização</CardTitle>
                        <CardDescription>
                            Rapidez na visualização após publicação
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="pl-2">
                        <ChartContainer
                            config={{
                                avisos: {
                                    label: "Avisos",
                                    color: "#EF4444",
                                },
                            }}
                            className="aspect-[4/3]"
                        >
                            <ChartWrapper>
                                <LineChart
                                    data={tempoVisualizacaoData}
                                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="periodo" />
                                    <YAxis />
                                    <Tooltip />
                                    <Line 
                                        type="monotone" 
                                        dataKey="avisos" 
                                        stroke="#EF4444" 
                                        strokeWidth={2}
                                        name="Avisos"
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

export default GraficosAvisos;

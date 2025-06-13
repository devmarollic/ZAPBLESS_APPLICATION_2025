
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer } from '@/components/ui/chart';
import { ChartLegend, ChartLegendContent } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { MessageSquare, Send, Users, Clock } from 'lucide-react';
import ChartWrapper from '@/components/ui/chart-wrapper';

const mensagensData = [
    { name: 'Janeiro', enviadas: 340, lidas: 285, respondidas: 120 },
    { name: 'Fevereiro', enviadas: 420, lidas: 380, respondidas: 150 },
    { name: 'Março', enviadas: 380, lidas: 340, respondidas: 140 },
    { name: 'Abril', enviadas: 450, lidas: 400, respondidas: 180 },
    { name: 'Maio', enviadas: 520, lidas: 460, respondidas: 220 },
    { name: 'Junho', enviadas: 480, lidas: 430, respondidas: 200 }
];

const tipoMensagemData = [
    { name: 'Avisos', value: 45, color: '#3B82F6' },
    { name: 'Eventos', value: 30, color: '#8B5CF6' },
    { name: 'Devocionais', value: 15, color: '#F59E0B' },
    { name: 'Outros', value: 10, color: '#10B981' }
];

const horarioData = [
    { hora: '06:00', mensagens: 20 },
    { hora: '08:00', mensagens: 45 },
    { hora: '10:00', mensagens: 65 },
    { hora: '12:00', mensagens: 80 },
    { hora: '14:00', mensagens: 70 },
    { hora: '16:00', mensagens: 85 },
    { hora: '18:00', mensagens: 120 },
    { hora: '20:00', mensagens: 95 },
    { hora: '22:00', mensagens: 30 }
];

const GraficosMensagens = () => {
    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-3xl font-bold tracking-tight gradientText">Gráficos de Mensagens</h2>
                <p className="text-muted-foreground">Análise detalhada do envio e engajamento das mensagens</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Enviadas</CardTitle>
                        <Send className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">2.590</div>
                        <p className="text-xs text-muted-foreground">
                            +8% em relação ao mês passado
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Taxa de Leitura</CardTitle>
                        <MessageSquare className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">89.5%</div>
                        <p className="text-xs text-muted-foreground">
                            +2.3% em relação ao mês passado
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Taxa de Resposta</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">42.1%</div>
                        <p className="text-xs text-muted-foreground">
                            +5.2% em relação ao mês passado
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Tempo Médio Resposta</CardTitle>
                        <Clock className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">2.3h</div>
                        <p className="text-xs text-muted-foreground">
                            -15min em relação ao mês passado
                        </p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Mensagens por Mês</CardTitle>
                        <CardDescription>
                            Evolução mensal de envio, leitura e resposta das mensagens
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="pl-2">
                        <ChartContainer
                            config={{
                                enviadas: {
                                    label: "Enviadas",
                                    color: "#3B82F6",
                                },
                                lidas: {
                                    label: "Lidas",
                                    color: "#8B5CF6",
                                },
                                respondidas: {
                                    label: "Respondidas",
                                    color: "#10B981",
                                },
                            }}
                            className="aspect-[4/3]"
                        >
                            <ChartWrapper>
                                <BarChart
                                    data={mensagensData}
                                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip />
                                    <Bar dataKey="enviadas" fill="#3B82F6" name="Enviadas" />
                                    <Bar dataKey="lidas" fill="#8B5CF6" name="Lidas" />
                                    <Bar dataKey="respondidas" fill="#10B981" name="Respondidas" />
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
                        <CardTitle>Distribuição por Tipo</CardTitle>
                        <CardDescription>
                            Categorias de mensagens mais enviadas
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="pl-2">
                        <ChartContainer
                            config={{
                                value: {
                                    label: "Mensagens",
                                    color: "#8B5CF6",
                                },
                            }}
                            className="aspect-[4/3]"
                        >
                            <ChartWrapper>
                                <PieChart>
                                    <Pie
                                        data={tipoMensagemData}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                        outerRadius={80}
                                        fill="#8884d8"
                                        dataKey="value"
                                    >
                                        {tipoMensagemData.map((entry, index) => (
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

            <Card>
                <CardHeader>
                    <CardTitle>Horários de Maior Engajamento</CardTitle>
                    <CardDescription>
                        Mensagens enviadas por horário do dia
                    </CardDescription>
                </CardHeader>
                <CardContent className="pl-2">
                    <ChartContainer
                        config={{
                            mensagens: {
                                label: "Mensagens",
                                color: "#F59E0B",
                            },
                        }}
                        className="aspect-[4/3]"
                    >
                        <ChartWrapper>
                            <LineChart
                                data={horarioData}
                                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                            >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="hora" />
                                <YAxis />
                                <Tooltip />
                                <Line 
                                    type="monotone" 
                                    dataKey="mensagens" 
                                    stroke="#F59E0B" 
                                    strokeWidth={2}
                                    name="Mensagens"
                                />
                            </LineChart>
                        </ChartWrapper>
                    </ChartContainer>
                </CardContent>
            </Card>
        </div>
    );
};

export default GraficosMensagens;

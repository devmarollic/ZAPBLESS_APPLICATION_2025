
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import ChartWrapper from '@/components/ui/chart-wrapper';
import { ChartLegend, ChartLegendContent } from '@/components/ui/chart';

const acessosData = [
    { name: 'Janeiro', acessos: 65 },
    { name: 'Fevereiro', acessos: 75 },
    { name: 'Março', acessos: 85 },
    { name: 'Abril', acessos: 75 },
    { name: 'Maio', acessos: 95 },
    { name: 'Junho', acessos: 105 },
    { name: 'Julho', acessos: 90 },
    { name: 'Agosto', acessos: 110 },
    { name: 'Setembro', acessos: 120 },
    { name: 'Outubro', acessos: 100 },
    { name: 'Novembro', acessos: 95 },
    { name: 'Dezembro', acessos: 90 },
];

const dispositivos = [
    { name: 'Desktop', valor: 45 },
    { name: 'Mobile', valor: 55 },
];

const GraficosAcesso = () => {
    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Gráficos de Acesso</h2>
                <p className="text-muted-foreground">
                    Análise de acessos ao sistema da igreja
                </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Acessos por Mês</CardTitle>
                        <CardDescription>
                            Visão anual dos acessos ao sistema
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="pl-2">
                        <ChartContainer
                            config={{
                                acessos: {
                                    label: "Acessos",
                                    color: "#3B82F6",
                                },
                            }}
                            className="aspect-[4/3]"
                        >
                            <ChartWrapper>
                                <BarChart
                                    data={acessosData}
                                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip />
                                    <Bar dataKey="acessos" fill="#3B82F6" name="Acessos" />
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
                        <CardTitle>Acessos por Dispositivo</CardTitle>
                        <CardDescription>
                            Proporção de acessos por tipo de dispositivo
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {dispositivos.map((item) => (
                                <div key={item.name} className="flex items-center">
                                    <div className="w-[60%] mr-4">
                                        <div className="text-sm font-medium">{item.name}</div>
                                    </div>
                                    <div className="w-full">
                                        <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
                                            <div
                                                className="h-full bg-blue-500"
                                                style={{ width: `${item.valor}%` }}
                                            />
                                        </div>
                                        <div className="text-xs text-muted-foreground mt-1 text-right">
                                            {item.valor}%
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default GraficosAcesso;

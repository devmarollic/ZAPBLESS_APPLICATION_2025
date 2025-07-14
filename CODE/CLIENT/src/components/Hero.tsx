
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Hero = () => {
    const navigate = useNavigate();

    return (
        <section className="pt-32 pb-20 px-4 md:px-8 relative overflow-hidden bg-gradient-to-br from-white to-zapBlue-50">
            <div className="absolute inset-0 bg-church-pattern opacity-20 z-0"></div>
            <div className="max-w-7xl mx-auto relative z-10">
                <div className="grid md:grid-cols-2 gap-12 items-center">
                    <div className="space-y-6 text-center md:text-left">
                        <span className="inline-block px-4 py-2 rounded-full bg-zapPurple-100 text-zapPurple-700 font-medium text-sm">
                            Conectando sua igreja via WhatsApp
                        </span>
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
                            Comunique-se com seus fiéis pelo{" "}
                            <span className="gradientText">WhatsApp</span> de forma simples
                        </h1>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto md:mx-0">
                            O ZapBless é um dashboard completo para igrejas que desejam se
                            conectar com seus membros via WhatsApp. Envie notificações sobre
                            cultos, eventos e muito mais.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                            <Button
                                className="rounded-full text-lg px-8 py-6 bg-gradient-to-r from-zapBlue-600 to-zapPurple-600 hover:from-zapBlue-700 hover:to-zapPurple-700 shadow-lg hover:shadow-xl transition-all"
                                onClick={() => navigate('/register')}
                            >
                                Teste Grátis por 14 Dias
                            </Button>
                            <Button
                                variant="outline"
                                className="rounded-full text-lg px-8 py-6 border-zapBlue-600 text-zapBlue-600 hover:bg-zapBlue-50 z-10"
                                onClick={() => {
                                    window.open('https://calendly.com/devfullstack-marollic', '_blank');
                                }}
                            >
                                Agendar Demonstração
                            </Button>
                        </div>
                        <div className="text-sm text-gray-500">
                            <p>Não é necessário cartão de crédito. Comece a usar agora mesmo.</p>
                        </div>
                    </div>
                    <div className="relative">
                        <div className="absolute inset-0 bg-gradient-radial from-zapPurple-400/20 to-transparent rounded-full blur-3xl"></div>
                        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden relative">
                            <div className="bg-gradient-to-r from-zapBlue-500 to-zapPurple-500 p-4 text-white">
                                <h3 className="font-semibold">Dashboard ZapBless</h3>
                            </div>
                            <div className="p-4 space-y-4">
                                <div className="bg-gray-50 p-3 rounded-lg">
                                    <h4 className="font-medium text-zapBlue-700 mb-2">Próximos Eventos</h4>
                                    <div className="space-y-2">
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm">Culto de Domingo</span>
                                            <span className="text-xs bg-zapBlue-100 text-zapBlue-700 px-2 py-1 rounded">10:00</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm">Reunião de Jovens</span>
                                            <span className="text-xs bg-zapPurple-100 text-zapPurple-700 px-2 py-1 rounded">19:00</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm">Estudo Bíblico</span>
                                            <span className="text-xs bg-zapGold-100 text-zapGold-700 px-2 py-1 rounded">Ter 20:00</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <div className="bg-zapBlue-50 p-3 rounded-lg flex-1 text-center">
                                        <div className="text-2xl font-bold text-zapBlue-700">152</div>
                                        <div className="text-xs text-gray-600">Membros</div>
                                    </div>
                                    <div className="bg-zapPurple-50 p-3 rounded-lg flex-1 text-center">
                                        <div className="text-2xl font-bold text-zapPurple-700">12</div>
                                        <div className="text-xs text-gray-600">Ministérios</div>
                                    </div>
                                    <div className="bg-zapGold-50 p-3 rounded-lg flex-1 text-center">
                                        <div className="text-2xl font-bold text-zapGold-700">5</div>
                                        <div className="text-xs text-gray-600">Eventos</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                    <div className="p-4">
                        <div className="font-bold text-3xl text-zapBlue-600">500+</div>
                        <div className="text-gray-600">Igrejas Atendidas</div>
                    </div>
                    <div className="p-4">
                        <div className="font-bold text-3xl text-zapPurple-600">50.000+</div>
                        <div className="text-gray-600">Membros Conectados</div>
                    </div>
                    <div className="p-4">
                        <div className="font-bold text-3xl text-zapBlue-600">98%</div>
                        <div className="text-gray-600">Taxa de Satisfação</div>
                    </div>
                    <div className="p-4">
                        <div className="font-bold text-3xl text-zapPurple-600">1M+</div>
                        <div className="text-gray-600">Mensagens Enviadas</div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;

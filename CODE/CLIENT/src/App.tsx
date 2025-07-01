
import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useAnalytics } from '@/hooks/use-analytics';
import Index from './pages/Index';
import NotFound from './pages/NotFound';
import DashboardLayout from './components/DashboardLayout';
import Dashboard from './pages/Dashboard';
import Calendario from './pages/Calendario';
import Eventos from './pages/Eventos';
import EventoNovo from './pages/EventoNovo';
import EventosRecorrentes from './pages/EventosRecorrentes';
import Membros from './pages/Membros';
import MembroNovo from './pages/MembroNovo';
import MembroEditar from './pages/MembroEditar';
import EnviarMensagem from './pages/EnviarMensagem';
import StatusMensagens from './pages/StatusMensagens';
import MeusDados from './pages/MeusDados';
import GraficosAcesso from './pages/GraficosAcesso';
import GraficosMensagens from './pages/GraficosMensagens';
import GraficosMembros from './pages/GraficosMembros';
import GraficosAvisos from './pages/GraficosAvisos';
import GraficosMinisterios from './pages/GraficosMinisterios';
import Register from './pages/Register';
import Login from './pages/Login';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import ChangePassword from './pages/ChangePassword';
import Pagamento from './pages/Pagamento';
import PlanSelection from './pages/PlanSelection';
import Ministerios from './pages/Ministerios';
import MinisterioNovo from './pages/MinisterioNovo';
import MinisterioEditar from './pages/MinisterioEditar';
import MinisterioGerenciar from './pages/MinisterioGerenciar';
import MinisterioImportar from './pages/MinisterioImportar';
import MinisterioExportar from './pages/MinisterioExportar';
import Avisos from './pages/Avisos';
import AvisoNovo from './pages/AvisoNovo';
import AvisoGerenciar from './pages/AvisoGerenciar';
import TermosDeServico from './pages/TermosDeServico';
import PoliticaDePrivacidade from './pages/PoliticaDePrivacidade';
import PoliticaDeCookies from './pages/PoliticaDeCookies';
import Sobre from './pages/Sobre';
import Contato from './pages/Contato';
import MeuPlano from './pages/MeuPlano';
import Lembretes from './pages/Lembretes';

import { PlanProvider } from './context/PlanContext';
import { WhatsAppProvider } from './context/WhatsAppContext';
import ProtectedRoute from './components/ProtectedRoute';
import GerenciarUsuarios from './pages/GerenciarUsuarios';

const queryClient = new QueryClient();

// Analytics component to track page views
const AnalyticsProvider = () => {
  useAnalytics();
  return null;
};

const App = () => (
    <QueryClientProvider client={queryClient}>
        <TooltipProvider>
            <PlanProvider>
                <Toaster />
                <Sonner />
                <BrowserRouter>
                    <AnalyticsProvider />
                    <WhatsAppProvider>
                        <Routes>
                            <Route path="/" element={<Index />} />
                            <Route path="/register" element={<Register />} />
                            <Route path="/login" element={<Login />} />
                            <Route path="/forgot-password" element={<ForgotPassword />} />
                            <Route path="/reset-password" element={<ResetPassword />} />
                            <Route path="/plan-selection/:email" element={<PlanSelection />} />
                            <Route path="/pagamento" element={<Pagamento />} />

                            {/* Legal Pages */}
                            <Route path="/termos-de-servico" element={<TermosDeServico />} />
                            <Route path="/politica-de-privacidade" element={<PoliticaDePrivacidade />} />
                            <Route path="/politica-de-cookies" element={<PoliticaDeCookies />} />
                            <Route path="/sobre" element={<Sobre />} />
                            <Route path="/contato" element={<Contato />} />

                            {/* Dashboard Routes - Protected */}
                            <Route element={<ProtectedRoute />}>
                                <Route path="/dashboard" element={<DashboardLayout />}>
                                    <Route index element={<Dashboard />} />

                                    {/* Minha Conta */}
                                    <Route path="meu-plano" element={<MeuPlano />} />
                                    <Route path="meus-dados" element={<MeusDados />} />
                                    <Route path="alterar-senha" element={<ChangePassword />} />
                                    <Route path="gerenciar-usuarios" element={<GerenciarUsuarios />} />

                                    {/* Agenda */}
                                    <Route path="calendario" element={<Calendario />} />
                                    <Route path="eventos" element={<Eventos />} />
                                    <Route path="eventos/novo" element={<EventoNovo />} />
                                    <Route path="eventos/recorrentes" element={<EventosRecorrentes />} />
                                    <Route path="eventos/editar" element={<Dashboard />} />

                                    {/* Membros */}
                                    <Route path="membros" element={<Membros />} />
                                    <Route path="membros/mensagem" element={<EnviarMensagem />} />
                                    <Route path="membros/novo" element={<MembroNovo />} />
                                    <Route path="membros/gerenciar" element={<Dashboard />} />
                                    <Route path="membros/editar/:id" element={<MembroEditar />} />
                                    <Route path="membros/importar" element={<Dashboard />} />
                                    <Route path="membros/exportar" element={<Dashboard />} />

                                    {/* Mensagens */}
                                    <Route path="mensagens/status" element={<StatusMensagens />} />

                                    {/* Avisos */}
                                    <Route path="avisos" element={<Avisos />} />
                                    <Route path="avisos/novo" element={<AvisoNovo />} />
                                    <Route path="avisos/gerenciar" element={<AvisoGerenciar />} />
                                    <Route path="avisos/importar" element={<Dashboard />} />
                                    <Route path="avisos/exportar" element={<Dashboard />} />

                                    {/* Ministérios */}
                                    <Route path="ministerios" element={<Ministerios />} />
                                    <Route path="ministerios/novo" element={<MinisterioNovo />} />
                                    <Route path="ministerios/gerenciar" element={<MinisterioGerenciar />} />
                                    <Route path="ministerios/editar/:id" element={<MinisterioEditar />} />
                                    <Route path="ministerios/importar" element={<MinisterioImportar />} />
                                    <Route path="ministerios/exportar" element={<MinisterioExportar />} />

                                    {/* Lembretes */}
                                    <Route path="lembretes" element={<Lembretes />} />

                                    {/* Dashboard/Gráficos */}
                                    <Route path="graficos/acesso" element={<GraficosAcesso />} />
                                    <Route path="graficos/mensagens" element={<GraficosMensagens />} />
                                    <Route path="graficos/membros" element={<GraficosMembros />} />
                                    <Route path="graficos/ministerios" element={<GraficosMinisterios />} />
                                    <Route path="graficos/avisos" element={<GraficosAvisos />} />
                                </Route>
                            </Route>

                            {/* Catch-all route */}
                            <Route path="*" element={<NotFound />} />
                        </Routes>
                    </WhatsAppProvider>
                </BrowserRouter>
            </PlanProvider>
        </TooltipProvider>
    </QueryClientProvider>
);

export default App;

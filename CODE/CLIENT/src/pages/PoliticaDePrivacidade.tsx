
import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

const PoliticaDePrivacidade = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-grow container max-w-4xl mx-auto px-4 py-16 mt-16">
        <div className="mb-8">
          <Link to="/">
            <Button variant="ghost" className="flex items-center gap-2">
              <ArrowLeft size={16} />
              <span>Voltar</span>
            </Button>
          </Link>
        </div>
        
        <h1 className="text-3xl font-bold mb-8">Política de Privacidade</h1>
        <div className="prose prose-gray max-w-none">
          <p className="text-gray-600 mb-4">Última atualização: 01 de Maio de 2025</p>
          
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">1. Introdução</h2>
            <p>A ZapBless valoriza a privacidade dos nossos usuários. Esta Política de Privacidade explica como coletamos, usamos, divulgamos e protegemos suas informações pessoais quando você utiliza nosso site e serviços. Por favor, leia esta política cuidadosamente para entender nossas práticas em relação aos seus dados.</p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">2. Informações que Coletamos</h2>
            <h3 className="text-lg font-medium mt-4 mb-2">2.1 Informações Fornecidas Diretamente</h3>
            <p>Podemos coletar as seguintes informações quando você se registra ou usa nossos serviços:</p>
            <ul className="list-disc pl-6 my-4 space-y-2">
              <li>Nome, e-mail, telefone e endereço</li>
              <li>Informações da igreja ou organização</li>
              <li>Detalhes de pagamento (processados por gateways de pagamento seguros)</li>
              <li>Conteúdo que você cria, carrega ou recebe ao usar nossos serviços</li>
            </ul>
            
            <h3 className="text-lg font-medium mt-4 mb-2">2.2 Informações Coletadas Automaticamente</h3>
            <p>Quando você acessa nossos serviços, coletamos automaticamente:</p>
            <ul className="list-disc pl-6 my-4 space-y-2">
              <li>Informações de uso e interação com a plataforma</li>
              <li>Informações do dispositivo (modelo, sistema operacional, etc.)</li>
              <li>Dados de localização aproximada baseada no endereço IP</li>
              <li>Cookies e tecnologias similares conforme detalhado em nossa <Link to="/politica-de-cookies" className="text-zapBlue-600 hover:underline">Política de Cookies</Link></li>
            </ul>
          </section>
          
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">3. Como Utilizamos Suas Informações</h2>
            <p>Utilizamos suas informações para os seguintes fins:</p>
            <ul className="list-disc pl-6 my-4 space-y-2">
              <li>Fornecer, manter e melhorar nossos serviços</li>
              <li>Processar transações e gerenciar contas de usuários</li>
              <li>Comunicar novidades, atualizações e informações importantes</li>
              <li>Personalizar sua experiência na plataforma</li>
              <li>Analisar tendências de uso e melhorar nossos serviços</li>
              <li>Detectar, prevenir e resolver problemas técnicos ou de segurança</li>
            </ul>
          </section>
          
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">4. Compartilhamento de Informações</h2>
            <p>Podemos compartilhar suas informações nas seguintes circunstâncias:</p>
            <ul className="list-disc pl-6 my-4 space-y-2">
              <li>Com provedores de serviços que trabalham em nosso nome (processamento de pagamentos, análises, etc.)</li>
              <li>Para cumprir obrigações legais</li>
              <li>Para proteger os direitos, propriedade ou segurança da ZapBless ou de terceiros</li>
              <li>Durante uma fusão, aquisição ou venda de ativos</li>
            </ul>
            <p>Não vendemos suas informações pessoais a terceiros.</p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">5. Segurança de Dados</h2>
            <p>Implementamos medidas de segurança técnicas, administrativas e físicas para proteger suas informações pessoais contra acesso não autorizado, perda ou alteração. No entanto, nenhum método de transmissão pela internet ou armazenamento eletrônico é 100% seguro, e não podemos garantir segurança absoluta.</p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">6. Seus Direitos</h2>
            <p>De acordo com as leis de proteção de dados aplicáveis, você pode ter os seguintes direitos:</p>
            <ul className="list-disc pl-6 my-4 space-y-2">
              <li>Acessar, corrigir ou excluir seus dados pessoais</li>
              <li>Solicitar portabilidade de seus dados</li>
              <li>Retirar seu consentimento a qualquer momento</li>
              <li>Opor-se ao processamento de seus dados para fins específicos</li>
            </ul>
            <p>Para exercer seus direitos, entre em contato conosco pelo e-mail: privacidade@zapbless.com.br</p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">7. Retenção de Dados</h2>
            <p>Mantemos suas informações pessoais pelo tempo necessário para cumprir os propósitos descritos nesta política, a menos que um período de retenção mais longo seja exigido por lei.</p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">8. Alterações nesta Política</h2>
            <p>Podemos atualizar esta política periodicamente. Notificaremos você sobre alterações significativas através de um aviso em nosso site ou por e-mail antes que as mudanças entrem em vigor.</p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">9. Contato</h2>
            <p>Se você tiver dúvidas sobre esta Política de Privacidade, entre em contato conosco pelo e-mail: privacidade@zapbless.com.br</p>
          </section>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default PoliticaDePrivacidade;

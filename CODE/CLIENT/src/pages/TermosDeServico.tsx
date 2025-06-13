
import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

const TermosDeServico = () => {
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
        
        <h1 className="text-3xl font-bold mb-8">Termos de Serviço</h1>
        <div className="prose prose-gray max-w-none">
          <p className="text-gray-600 mb-4">Última atualização: 23 de Maio de 2023</p>
          
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">1. Introdução</h2>
            <p>Bem-vindo ao ZapBless! Estes Termos de Serviço regem o uso da nossa plataforma, website e serviços oferecidos pela ZapBless. Ao acessar ou usar nossos serviços, você concorda com estes termos. Por favor, leia-os atentamente.</p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">2. Definições</h2>
            <p>"Serviços" refere-se à plataforma ZapBless, incluindo todos os recursos, ferramentas e funcionalidades oferecidas através do nosso website e aplicações.</p>
            <p>"Usuário" refere-se a qualquer pessoa que acesse ou utilize nossos Serviços.</p>
            <p>"Conteúdo" refere-se a todas as informações, dados, textos, mensagens ou outros materiais enviados, publicados ou exibidos através dos nossos Serviços.</p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">3. Uso dos Serviços</h2>
            <p>Ao utilizar nossos Serviços, você declara e garante que:</p>
            <ul className="list-disc pl-6 my-4 space-y-2">
              <li>Tem pelo menos 18 anos ou possui consentimento legal de um responsável.</li>
              <li>Fornecerá informações precisas e atualizadas durante o processo de registro.</li>
              <li>É responsável por manter a segurança da sua conta e senha.</li>
              <li>Não usará os Serviços para fins ilegais ou não autorizados.</li>
              <li>Não tentará interferir no funcionamento adequado da plataforma.</li>
            </ul>
          </section>
          
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">4. Conteúdo do Usuário</h2>
            <p>Você mantém todos os direitos sobre o conteúdo que envia, publica ou exibe em nossa plataforma. No entanto, ao fornecer conteúdo, você nos concede uma licença mundial, não exclusiva e isenta de royalties para usar, modificar, executar publicamente, exibir publicamente e distribuir seu conteúdo em conexão com os nossos Serviços.</p>
            <p>Você é o único responsável pelo conteúdo que publica e pelas consequências de compartilhá-lo.</p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">5. Privacidade</h2>
            <p>Nossa <Link to="/politica-de-privacidade" className="text-zapBlue-600 hover:underline">Política de Privacidade</Link> descreve como coletamos, usamos e compartilhamos suas informações. Ao usar nossos Serviços, você concorda com a coleta e uso de informações de acordo com esta política.</p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">6. Limitações de Responsabilidade</h2>
            <p>A ZapBless não será responsável por quaisquer danos indiretos, incidentais, especiais, consequenciais ou punitivos, ou quaisquer perdas de lucros ou receitas, seja incorridos direta ou indiretamente, ou quaisquer perdas de dados, uso, boa vontade ou outras perdas intangíveis.</p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">7. Alterações nos Termos</h2>
            <p>Reservamo-nos o direito de modificar ou substituir estes termos a qualquer momento. Notificaremos os usuários sobre mudanças significativas pelo menos 30 dias antes de entrarem em vigor. O uso contínuo dos nossos Serviços após tais alterações constitui sua aceitação dos novos termos.</p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">8. Lei Aplicável</h2>
            <p>Estes termos serão regidos e interpretados de acordo com as leis do Brasil, sem considerar as disposições de conflito de leis.</p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">9. Contato</h2>
            <p>Se você tiver dúvidas sobre estes Termos de Serviço, entre em contato conosco pelo e-mail: suporte@zapbless.com.br</p>
          </section>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default TermosDeServico;

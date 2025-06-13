
import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

const PoliticaDeCookies = () => {
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
        
        <h1 className="text-3xl font-bold mb-8">Política de Cookies</h1>
        <div className="prose prose-gray max-w-none">
          <p className="text-gray-600 mb-4">Última atualização: 23 de Maio de 2023</p>
          
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">1. Introdução</h2>
            <p>Esta Política de Cookies explica como a ZapBless utiliza cookies e tecnologias similares para reconhecer você quando visita nosso site e utiliza nossos serviços. Ela explica o que são essas tecnologias, por que as usamos e suas opções em relação a elas.</p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">2. O que são Cookies?</h2>
            <p>Cookies são pequenos arquivos de dados armazenados no seu dispositivo (computador, tablet ou celular) quando você visita um site. São amplamente utilizados para fazer os sites funcionarem de maneira mais eficiente e fornecer informações aos proprietários do site.</p>
            <p>Cookies permitem que um site "lembre" de suas ações ou preferências ao longo do tempo, ou para identificar você em visitas subsequentes.</p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">3. Tipos de Cookies que Utilizamos</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium">Cookies Necessários</h3>
                <p>São essenciais para navegar pelo site e utilizar seus recursos, como acesso a áreas seguras. Sem esses cookies, não podemos fornecer os serviços solicitados.</p>
              </div>
              
              <div>
                <h3 className="text-lg font-medium">Cookies de Preferências</h3>
                <p>Permitem que o site lembre informações que mudam a aparência ou o comportamento do site, como seu idioma preferido ou a região em que você está.</p>
              </div>
              
              <div>
                <h3 className="text-lg font-medium">Cookies Estatísticos</h3>
                <p>Ajudam a entender como os visitantes interagem com o site, coletando e relatando informações anonimamente. Isso nos ajuda a melhorar o site.</p>
              </div>
              
              <div>
                <h3 className="text-lg font-medium">Cookies de Marketing</h3>
                <p>São usados para rastrear visitantes em sites. A intenção é exibir anúncios relevantes e envolventes para o usuário individual.</p>
              </div>
            </div>
          </section>
          
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">4. Cookies de Terceiros</h2>
            <p>Além dos nossos próprios cookies (cookies primários), podemos utilizar diversos serviços de terceiros que nos ajudam a analisar como o site é usado e otimizar sua experiência. Estes terceiros podem definir seus próprios cookies em seu dispositivo:</p>
            <ul className="list-disc pl-6 my-4 space-y-2">
              <li>Google Analytics (análise de uso)</li>
              <li>Google Tag Manager (gerenciamento de tags)</li>
              <li>Facebook Pixel (marketing e análise)</li>
              <li>Hotjar (análise de experiência do usuário)</li>
            </ul>
          </section>
          
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">5. Como Gerenciar Cookies</h2>
            <p>Você pode controlar e gerenciar cookies de várias maneiras. Lembre-se que remover ou bloquear cookies pode impactar sua experiência de usuário e partes do nosso site podem não funcionar corretamente.</p>
            
            <h3 className="text-lg font-medium mt-4 mb-2">Configurações do Navegador</h3>
            <p>A maioria dos navegadores permite que você veja quais cookies você tem e que você os exclua ou bloqueie. Aqui estão links para instruções nos navegadores mais populares:</p>
            <ul className="list-disc pl-6 my-4 space-y-2">
              <li><a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer" className="text-zapBlue-600 hover:underline">Google Chrome</a></li>
              <li><a href="https://support.mozilla.org/pt-BR/kb/limpe-cookies-e-dados-de-sites-no-firefox" target="_blank" rel="noopener noreferrer" className="text-zapBlue-600 hover:underline">Mozilla Firefox</a></li>
              <li><a href="https://support.apple.com/pt-br/guide/safari/sfri11471/mac" target="_blank" rel="noopener noreferrer" className="text-zapBlue-600 hover:underline">Safari</a></li>
              <li><a href="https://support.microsoft.com/pt-br/help/17442/windows-internet-explorer-delete-manage-cookies" target="_blank" rel="noopener noreferrer" className="text-zapBlue-600 hover:underline">Internet Explorer</a></li>
              <li><a href="https://support.microsoft.com/pt-br/microsoft-edge/excluir-cookies-no-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09" target="_blank" rel="noopener noreferrer" className="text-zapBlue-600 hover:underline">Microsoft Edge</a></li>
            </ul>
          </section>
          
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">6. Do Not Track</h2>
            <p>Alguns navegadores têm um recurso "Do Not Track" (DNT) que sinaliza aos sites que você não deseja ser rastreado. Como não há um padrão aceito sobre como responder aos sinais DNT, nosso site atualmente não responde aos sinais DNT do navegador.</p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">7. Atualizações em Nossa Política de Cookies</h2>
            <p>Podemos atualizar esta Política de Cookies periodicamente para refletir, por exemplo, mudanças nas tecnologias que usamos ou por outros motivos operacionais, legais ou regulatórios. Recomendamos que você visite periodicamente esta página para se manter informado sobre quaisquer atualizações.</p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">8. Contato</h2>
            <p>Se você tiver dúvidas sobre o uso de cookies em nosso site, entre em contato conosco pelo e-mail: privacidade@zapbless.com.br</p>
          </section>
          
          <div className="mt-12 border-t border-gray-200 pt-8">
            <p>Para saber mais sobre como protegemos seus dados pessoais, consulte nossa <Link to="/politica-de-privacidade" className="text-zapBlue-600 hover:underline">Política de Privacidade</Link>.</p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default PoliticaDeCookies;

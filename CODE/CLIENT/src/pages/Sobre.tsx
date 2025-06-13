
import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

const Sobre = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-grow container max-w-6xl mx-auto px-4 py-16 mt-16">
        <div className="mb-8">
          <Link to="/">
            <Button variant="ghost" className="flex items-center gap-2">
              <ArrowLeft size={16} />
              <span>Voltar</span>
            </Button>
          </Link>
        </div>
        
        <h1 className="text-3xl font-bold mb-8">Sobre o ZapBless</h1>
        
        {/* Missão e Visão */}
        <section className="mb-16">
          <div className="grid md:grid-cols-2 gap-10">
            <div>
              <h2 className="text-2xl font-semibold mb-4 text-zapBlue-600">Nossa Missão</h2>
              <p className="text-gray-700 mb-4">
                O ZapBless nasceu com a missão de conectar igrejas e comunidades de fé com seus membros 
                de maneira eficiente e acessível através da tecnologia. Acreditamos que a comunicação 
                é fundamental para fortalecer os laços entre líderes religiosos e fiéis, e queremos 
                ser a ponte que facilita essa conexão.
              </p>
              <p className="text-gray-700">
                Nosso compromisso é oferecer ferramentas simples e poderosas que permitam às igrejas 
                de todos os tamanhos gerenciar suas comunicações, eventos e membros com facilidade, 
                sem a necessidade de conhecimentos técnicos avançados.
              </p>
            </div>
            <div>
              <h2 className="text-2xl font-semibold mb-4 text-zapPurple-600">Nossa Visão</h2>
              <p className="text-gray-700 mb-4">
                Visualizamos um futuro onde comunidades religiosas possam se concentrar no que realmente 
                importa: suas mensagens, seus membros e sua missão espiritual, enquanto deixam a 
                parte tecnológica conosco.
              </p>
              <p className="text-gray-700">
                Buscamos ser reconhecidos como a plataforma de referência para comunicação e gestão 
                eclesiástica no Brasil, sempre respeitando a diversidade e as particularidades de 
                cada denominação religiosa.
              </p>
            </div>
          </div>
        </section>
        
        {/* Valores */}
        <section className="mb-16">
          <h2 className="text-2xl font-semibold mb-6 text-center">Nossos Valores</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
              <h3 className="text-xl font-medium mb-3 text-zapBlue-600">Simplicidade</h3>
              <p className="text-gray-700">
                Acreditamos que tecnologia deve ser acessível a todos. Por isso, desenvolvemos 
                soluções intuitivas e fáceis de usar, mesmo para quem não tem familiaridade com 
                ferramentas digitais.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
              <h3 className="text-xl font-medium mb-3 text-zapPurple-600">Respeito</h3>
              <p className="text-gray-700">
                Respeitamos a diversidade religiosa e as diferentes formas de expressão da fé. 
                Nossas soluções são adaptáveis às necessidades específicas de cada comunidade.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
              <h3 className="text-xl font-medium mb-3 text-zapGold-600">Confiança</h3>
              <p className="text-gray-700">
                Priorizamos a segurança e a privacidade dos dados. Entendemos a sensibilidade das 
                informações compartilhadas e garantimos o tratamento ético e responsável de todos os dados.
              </p>
            </div>
          </div>
        </section>
        
        {/* Nossa História */}
        <section className="mb-16">
          <h2 className="text-2xl font-semibold mb-6">Nossa História</h2>
          <div className="bg-gray-50 p-8 rounded-lg border border-gray-100">
            <p className="text-gray-700 mb-4">
              A ZapBless surgiu em 2022, quando um grupo de profissionais de tecnologia, também 
              membros ativos de suas comunidades religiosas, identificaram uma dificuldade comum: 
              a comunicação eficiente entre igrejas e seus membros.
            </p>
            <p className="text-gray-700 mb-4">
              Observando que muitas igrejas já usavam o WhatsApp de maneira informal para comunicação, 
              mas sem uma estrutura organizada, nasceu a ideia de criar uma plataforma que pudesse 
              integrar as funcionalidades do aplicativo de mensagens já conhecido por todos, com 
              ferramentas específicas para gestão eclesiástica.
            </p>
            <p className="text-gray-700">
              Desde então, temos crescido e evoluído, sempre ouvindo o feedback de nossos usuários e 
              adaptando nossas soluções para melhor atender às necessidades reais das comunidades de fé 
              em todo o Brasil.
            </p>
          </div>
        </section>
        
        {/* Equipe */}
        <section className="mb-16">
          <h2 className="text-2xl font-semibold mb-8 text-center">Nossa Equipe</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              {
                name: "Carlos Silva",
                role: "Fundador e CEO",
                bio: "Engenheiro de software com mais de 15 anos de experiência e líder de jovens em sua igreja local."
              },
              {
                name: "Márcia Santos",
                role: "Diretora de Produto",
                bio: "Especialista em UX com paixão por criar interfaces intuitivas e acessíveis para todos os públicos."
              },
              {
                name: "Paulo Rodrigues",
                role: "Desenvolvedor Chefe",
                bio: "Programador experiente com foco em segurança de dados e performance de aplicações web."
              },
              {
                name: "Ana Oliveira",
                role: "Suporte ao Cliente",
                bio: "Dedicada a garantir a melhor experiência para nossos usuários com atendimento personalizado."
              }
            ].map((member, index) => (
              <div key={index} className="bg-white p-5 rounded-lg shadow-md border border-gray-100 text-center">
                <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4 overflow-hidden">
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    Foto
                  </div>
                </div>
                <h3 className="text-lg font-medium mb-1">{member.name}</h3>
                <p className="text-zapBlue-600 mb-3">{member.role}</p>
                <p className="text-gray-600 text-sm">{member.bio}</p>
              </div>
            ))}
          </div>
        </section>
        
        {/* Contato */}
        <section>
          <h2 className="text-2xl font-semibold mb-6 text-center">Entre em Contato</h2>
          <div className="bg-gradient-to-r from-zapBlue-50 to-zapPurple-50 p-8 rounded-lg text-center max-w-3xl mx-auto">
            <p className="text-gray-700 mb-6">
              Estamos sempre abertos para ouvir sugestões, esclarecer dúvidas ou conversar sobre como 
              podemos ajudar sua comunidade religiosa.
            </p>
            <div className="space-y-2 mb-6">
              <p><strong>Email:</strong> contato@zapbless.com.br</p>
              <p><strong>Telefone:</strong> (11) 4002-8922</p>
              <p><strong>Endereço:</strong> Av. Paulista, 1000 - São Paulo, SP</p>
            </div>
            <Button className="bg-gradient-to-r from-zapBlue-600 to-zapPurple-600 hover:from-zapBlue-700 hover:to-zapPurple-700 rounded-full">
              Enviar Mensagem
            </Button>
          </div>
        </section>
      </div>
      <Footer />
    </div>
  );
};

export default Sobre;

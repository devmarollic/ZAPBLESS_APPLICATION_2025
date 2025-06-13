
import { Button } from "@/components/ui/button";

const HowItWorks = () => {
  const steps = [
    {
      number: "01",
      title: "Cadastre sua igreja",
      description: "Crie sua conta em minutos e configure as informações básicas da sua igreja para começar.",
      color: "bg-zapBlue-500",
    },
    {
      number: "02",
      title: "Adicione seus membros",
      description: "Importe ou cadastre manualmente os contatos dos membros da sua igreja no sistema.",
      color: "bg-zapPurple-500",
    },
    {
      number: "03",
      title: "Crie grupos e ministérios",
      description: "Organize seus membros em grupos específicos para facilitar a comunicação direcionada.",
      color: "bg-zapBlue-500",
    },
    {
      number: "04",
      title: "Comece a enviar mensagens",
      description: "Envie notificações, lembretes de eventos e mensagens importantes diretamente pelo WhatsApp.",
      color: "bg-zapPurple-500",
    },
  ];

  return (
    <section id="how-it-works" className="section bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Como funciona o ZapBless?
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Nosso processo é simples e projetado para que você possa começar a usar a plataforma em questão de minutos.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {steps.map((step, index) => (
            <div key={index} className="flex gap-6 p-6 bg-white rounded-xl shadow-sm">
              <div>
                <div
                  className={`${step.color} text-white w-14 h-14 rounded-full flex items-center justify-center text-xl font-bold`}
                >
                  {step.number}
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-gradient-to-r from-zapBlue-600 to-zapPurple-600 rounded-2xl p-8 md:p-12 text-white text-center">
          <h3 className="text-2xl md:text-3xl font-bold mb-4">
            Pronto para transformar a comunicação da sua igreja?
          </h3>
          <p className="mb-8 text-white/80 max-w-3xl mx-auto">
            Comece agora mesmo com nosso período de teste gratuito de 14 dias.
            Não é necessário cartão de crédito.
          </p>
          <Button className="bg-white text-zapPurple-600 hover:bg-gray-100 rounded-full text-lg px-8 py-6">
            Começar Agora
          </Button>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;


import { CheckCircle, Users, Calendar, MessageSquare, Heart, Settings } from "lucide-react";

const Features = () => {
  const featureList = [
    {
      icon: <MessageSquare className="h-10 w-10 text-zapBlue-500" />,
      title: "Comunicação Instantânea",
      description: "Envie mensagens para todos os membros da sua igreja ou grupos específicos com apenas alguns cliques.",
      color: "bg-zapBlue-50",
    },
    {
      icon: <Calendar className="h-10 w-10 text-zapPurple-500" />,
      title: "Agenda de Eventos",
      description: "Gerencie todos os eventos da igreja e envie lembretes automáticos para os participantes.",
      color: "bg-zapPurple-50",
    },
    {
      icon: <Users className="h-10 w-10 text-zapBlue-500" />,
      title: "Gestão de Ministérios",
      description: "Organize cada ministério com listas personalizadas e comunicação direcionada para cada grupo.",
      color: "bg-zapBlue-50",
    },
    {
      icon: <Heart className="h-10 w-10 text-zapPurple-500" />,
      title: "Alcance Comunitário",
      description: "Facilite ações sociais e coordene voluntários através de comunicação eficiente.",
      color: "bg-zapPurple-50",
    },
    {
      icon: <CheckCircle className="h-10 w-10 text-zapBlue-500" />,
      title: "Presença e Participação",
      description: "Acompanhe a frequência dos membros em cultos e eventos para fortalecer o engajamento.",
      color: "bg-zapBlue-50",
    },
    {
      icon: <Settings className="h-10 w-10 text-zapPurple-500" />,
      title: "Personalização Total",
      description: "Adapte a plataforma às necessidades específicas da sua igreja com configurações flexíveis.",
      color: "bg-zapPurple-50",
    },
  ];

  return (
    <section id="features" className="section bg-white">
      <div className="text-center space-y-4 mb-16">
        <h2 className="text-3xl md:text-4xl font-bold">
          Recursos que transformam a comunicação da sua igreja
        </h2>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          O ZapBless oferece todas as ferramentas necessárias para conectar sua igreja através do WhatsApp com eficiência e simplicidade.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {featureList.map((feature, index) => (
          <div
            key={index}
            className={`rounded-xl ${feature.color} p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow`}
          >
            <div className="mb-4">{feature.icon}</div>
            <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
            <p className="text-gray-600">{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Features;

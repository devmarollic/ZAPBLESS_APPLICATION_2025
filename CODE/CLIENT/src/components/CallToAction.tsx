
import { Button } from "@/components/ui/button";
import { MessageSquare, Calendar, Users } from "lucide-react";

const CallToAction = () => {
  return (
    <section className="section bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="bg-gradient-to-r from-zapBlue-600 to-zapPurple-600 rounded-2xl overflow-hidden">
          <div className="md:grid md:grid-cols-2">
            <div className="p-8 md:p-12 text-white">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Pronto para transformar a comunicação da sua igreja?
              </h2>
              <p className="text-white/80 mb-8 text-lg">
                Comece agora com nosso período de teste gratuito de 14 dias e veja como o ZapBless pode ajudar a sua comunidade.
              </p>
              
              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-3">
                  <div className="bg-white/10 p-2 rounded-full">
                    <MessageSquare className="h-5 w-5 text-white" />
                  </div>
                  <span>Envio ilimitado de mensagens</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="bg-white/10 p-2 rounded-full">
                    <Calendar className="h-5 w-5 text-white" />
                  </div>
                  <span>Gestão completa de eventos</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="bg-white/10 p-2 rounded-full">
                    <Users className="h-5 w-5 text-white" />
                  </div>
                  <span>Organização de ministérios</span>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button className="bg-white text-zapPurple-600 hover:bg-gray-100 rounded-full px-8 py-6">
                  Começar Teste Grátis
                </Button>
                <Button variant="outline" className="border-white text-white bg-white/10 rounded-full px-8 py-6 z-10">
                  Agendar Demonstração
                </Button>
              </div>
            </div>
            
            <div className="hidden md:block relative">
              <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
              <div className="absolute inset-0 flex items-center justify-center p-8">
                <div className="bg-white rounded-xl shadow-xl overflow-hidden w-full max-w-md">
                  <div className="bg-zapBlue-100 p-4 flex justify-between items-center">
                    <div className="text-zapBlue-800 font-medium">Cultuar App</div>
                    <div className="text-xs bg-zapBlue-600 text-white px-2 py-1 rounded-full">
                      Online
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="mb-4">
                      <h4 className="font-medium">Envie uma mensagem para todos os membros</h4>
                      <div className="bg-gray-100 rounded-lg p-3 mt-2 text-sm text-gray-700">
                        <textarea
                          className="w-full bg-transparent outline-none resize-none"
                          placeholder="Digite sua mensagem aqui..."
                          rows={3}
                          defaultValue="Queridos irmãos, não esqueçam do nosso culto especial neste domingo às 19h! Traga sua família e amigos. Deus tem grandes coisas preparadas para nós!"
                        ></textarea>
                      </div>
                    </div>
                    <Button className="w-full bg-zapBlue-600 hover:bg-zapBlue-700">
                      Enviar Mensagem
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;

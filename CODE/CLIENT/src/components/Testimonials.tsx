
import { Star } from "lucide-react";

const Testimonials = () => {
    const testimonials = [
        {
            quote: "O ZapBless revolucionou a forma como nos comunicamos com os membros da nossa igreja. Conseguimos aumentar em 70% a participação nos eventos.",
            name: "Pr. Lucas Silva",
            title: "Igreja Batista Central",
            image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80",
        },
        {
            quote: "A facilidade de enviar mensagens para ministérios específicos economizou horas do nosso tempo administrativo. Recomendo para todas as igrejas.",
            name: "Pra. Amanda Santos",
            title: "Comunidade da Graça",
            image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80",
        },
        {
            quote: "Nossa igreja cresceu significativamente depois que começamos a usar o ZapBless. A comunicação consistente fez toda a diferença.",
            name: "Pr. Marcos Oliveira",
            title: "Igreja Vida Renovada",
            image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80",
        },
    ];

    return (
        <section id="testimonials" className="section bg-gradient-to-br from-zapBlue-50 to-zapPurple-50">
            <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                    O que dizem as igrejas que já usam o ZapBless
                </h2>
                <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                    Centenas de líderes religiosos já transformaram a comunicação de suas igrejas com nossa plataforma.
                </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                {testimonials.map((testimonial, index) => (
                    <div
                        key={index}
                        className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
                    >
                        <div className="flex gap-1 mb-4">
                            {[...Array(5)].map((_, i) => (
                                <Star
                                    key={i}
                                    className="h-5 w-5 fill-zapGold-400 text-zapGold-400"
                                />
                            ))}
                        </div>
                        <blockquote className="text-gray-700 mb-6">
                            "{testimonial.quote}"
                        </blockquote>
                        <div className="flex items-center gap-4">
                            <div className="h-12 w-12 rounded-full overflow-hidden">
                                <img
                                    src={testimonial.image}
                                    alt={testimonial.name}
                                    className="h-full w-full object-cover"
                                />
                            </div>
                            <div>
                                <div className="font-semibold">{testimonial.name}</div>
                                <div className="text-sm text-gray-500">{testimonial.title}</div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-16 text-center">
                <div className="inline-block bg-white sm:px-6 md:px-8 py-4 rounded-xl shadow-sm border border-gray-100 w-full md:w-auto">
                    <p className="text-lg md:text-xl font-medium text-gray-700 mb-2">
                        Mais de 500 igrejas já usam o ZapBless
                    </p>
                    <div className="flex justify-center items-center space-x-4 md:space-x-6">
                        <div className="h-12 w-12 bg-gray-200 rounded-full"></div>
                        <div className="h-12 w-12 bg-gray-200 rounded-full"></div>
                        <div className="h-12 w-12 bg-gray-200 rounded-full"></div>
                        <div className="h-12 w-12 bg-gray-200 rounded-full"></div>
                        <div className="h-12 w-12 bg-gray-200 rounded-full"></div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Testimonials;

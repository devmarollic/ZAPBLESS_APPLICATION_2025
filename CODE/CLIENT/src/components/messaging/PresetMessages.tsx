
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, Calendar, Heart, Users, Bell, Church } from 'lucide-react';

interface PresetMessage {
    id: string;
    title: string;
    category: 'culto' | 'evento' | 'aniversario' | 'geral' | 'lembrete';
    content: string;
    icon: React.ReactNode;
}

const presetMessages: PresetMessage[] = [
    {
        id: '1',
        title: 'Convite para Culto',
        category: 'culto',
        content: `🙏 Paz do Senhor!

Gostaríamos de convidá-lo(a) para nosso culto de adoração.

📅 Data: [DATA]
⏰ Horário: [HORÁRIO]
📍 Local: [LOCAL]

Venha adorar ao Senhor conosco! Sua presença será uma bênção.

🔥 "Vinde, adoremos e prostremo-nos; ajoelhemos diante do Senhor, que nos criou." - Salmos 95:6`,
        icon: <Church className="h-4 w-4" />
    },
    {
        id: '2',
        title: 'Lembrete de Reunião',
        category: 'lembrete',
        content: `📋 Lembrete Importante!

Não se esqueça da nossa reunião:

📅 Data: [DATA]
⏰ Horário: [HORÁRIO]
📍 Local: [LOCAL]
🎯 Pauta: [ASSUNTO]

Sua participação é fundamental!

Nos vemos lá! 🤝`,
        icon: <Bell className="h-4 w-4" />
    },
    {
        id: '3',
        title: 'Parabéns Aniversário',
        category: 'aniversario',
        content: `🎉 PARABÉNS! 🎂

Hoje é um dia especial - seu aniversário!

Que Deus abençoe sua vida com:
✨ Muita saúde
💕 Amor e paz
🙏 Sabedoria
🎁 Realizações

"Este é o dia que fez o Senhor; regozijemo-nos e alegremo-nos nele!" - Salmos 118:24

Feliz Aniversário! 🥳🎈`,
        icon: <Heart className="h-4 w-4" />
    },
    {
        id: '4',
        title: 'Convite para Evento',
        category: 'evento',
        content: `🎪 CONVITE ESPECIAL!

Você está convidado(a) para nosso evento:

🎯 Evento: [NOME DO EVENTO]
📅 Data: [DATA]
⏰ Horário: [HORÁRIO]
📍 Local: [LOCAL]
🎫 Entrada: [INFORMAÇÕES]

Será um momento abençoado! Não perca!

Para mais informações: [CONTATO]`,
        icon: <Calendar className="h-4 w-4" />
    },
    {
        id: '5',
        title: 'Mensagem de Motivação',
        category: 'geral',
        content: `🌟 Palavra de Encorajamento

"Tudo posso naquele que me fortalece." - Filipenses 4:13

Lembre-se:
🙏 Deus tem o melhor para você
💪 Você é mais forte do que imagina
🎯 Seus sonhos são possíveis
❤️ Você é amado(a)

Tenha uma semana abençoada!

Com carinho, Igreja [NOME DA IGREJA] 💙`,
        icon: <MessageSquare className="h-4 w-4" />
    },
    {
        id: '6',
        title: 'Chamada para Ministério',
        category: 'geral',
        content: `🤝 CHAMADA PARA SERVIR!

Você tem talentos que podem ser usados para a obra de Deus!

Estamos precisando de voluntários para:
• [MINISTÉRIO 1]
• [MINISTÉRIO 2]
• [MINISTÉRIO 3]

"Cada um administre aos outros o dom como recebeu, como bons despenseiros da multiforme graça de Deus." - 1 Pedro 4:10

Interessado(a)? Entre em contato: [CONTATO]`,
        icon: <Users className="h-4 w-4" />
    }
];

interface PresetMessagesProps {
    onSelectMessage: (content: string) => void;
}

const PresetMessages = ({ onSelectMessage }: PresetMessagesProps) => {
    const getCategoryColor = (category: string) => {
        switch (category) {
            case 'culto':
                return 'bg-blue-100 text-blue-800';
            case 'evento':
                return 'bg-green-100 text-green-800';
            case 'aniversario':
                return 'bg-pink-100 text-pink-800';
            case 'lembrete':
                return 'bg-yellow-100 text-yellow-800';
            case 'geral':
                return 'bg-purple-100 text-purple-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getCategoryLabel = (category: string) => {
        const labels = {
            culto: 'Culto',
            evento: 'Evento',
            aniversario: 'Aniversário',
            lembrete: 'Lembrete',
            geral: 'Geral'
        };
        return labels[category as keyof typeof labels] || category;
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-lg">Mensagens Pré-Prontas</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-3 max-h-[400px] overflow-y-auto">
                    {presetMessages.map((message) => (
                        <div
                            key={message.id}
                            className="border rounded-lg p-3 hover:bg-gray-50 transition-colors"
                        >
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                    {message.icon}
                                    <span className="font-medium text-sm">{message.title}</span>
                                </div>
                                <Badge className={getCategoryColor(message.category)}>
                                    {getCategoryLabel(message.category)}
                                </Badge>
                            </div>
                            <p className="text-xs text-gray-600 mb-3 line-clamp-3">
                                {message.content.substring(0, 150)}...
                            </p>
                            <Button
                                size="sm"
                                variant="outline"
                                onClick={() => onSelectMessage(message.content)}
                                className="w-full"
                            >
                                Usar esta mensagem
                            </Button>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
};

export default PresetMessages;

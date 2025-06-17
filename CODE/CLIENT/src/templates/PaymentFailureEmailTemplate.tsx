
import React from 'react';

interface PaymentFailureEmailProps {
  customerName: string;
  planName: string;
  amount: string;
  failureReason?: string;
  retryUrl: string;
  nextAttemptDate?: string;
}

export const PaymentFailureEmailTemplate: React.FC<PaymentFailureEmailProps> = ({
  customerName,
  planName,
  amount,
  failureReason,
  retryUrl,
  nextAttemptDate
}) => {
  return (
    <div style={{
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      lineHeight: '1.6',
      color: '#333333',
      maxWidth: '600px',
      margin: '0 auto',
      backgroundColor: '#ffffff'
    }}>
      {/* Header */}
      <div style={{
        backgroundColor: '#FEF2F2',
        border: '2px solid #F87171',
        padding: '40px 20px',
        textAlign: 'center',
        borderRadius: '8px 8px 0 0'
      }}>
        <h1 style={{
          color: '#1F2937',
          margin: '0 0 10px 0',
          fontSize: '28px',
          fontWeight: 'bold'
        }}>
          <span style={{ color: '#3B82F6' }}>Zap</span>
          <span style={{ color: '#8B5CF6' }}>Bless</span>
        </h1>
        <p style={{
          color: '#DC2626',
          margin: '0',
          fontSize: '16px',
          fontWeight: '600'
        }}>
          ⚠️ Problema no Pagamento
        </p>
      </div>

      {/* Content */}
      <div style={{ padding: '40px 30px' }}>
        <div style={{
          backgroundColor: '#FEF2F2',
          border: '2px solid #F87171',
          borderRadius: '8px',
          padding: '20px',
          marginBottom: '30px',
          textAlign: 'center'
        }}>
          <div style={{
            fontSize: '48px',
            marginBottom: '10px'
          }}>⚠️</div>
          <h2 style={{
            color: '#DC2626',
            margin: '0 0 10px 0',
            fontSize: '24px'
          }}>
            Não Foi Possível Processar o Pagamento
          </h2>
          <p style={{
            color: '#B91C1C',
            margin: '0',
            fontSize: '16px'
          }}>
            Sua assinatura pode ser suspensa em breve se o pagamento não for realizado.
          </p>
        </div>

        <p style={{ fontSize: '18px', marginBottom: '30px' }}>
          Olá <strong>{customerName}</strong>,
        </p>

        <p style={{ marginBottom: '25px' }}>
          Infelizmente, não conseguimos processar o pagamento da sua assinatura do plano <strong>{planName}</strong>. 
          Para continuar aproveitando todos os recursos do ZapBless, é necessário regularizar o pagamento.
        </p>

        {/* Payment Details */}
        <div style={{
          backgroundColor: '#FEF2F2',
          border: '1px solid #FECACA',
          borderRadius: '8px',
          padding: '25px',
          marginBottom: '30px'
        }}>
          <h3 style={{
            color: '#991B1B',
            margin: '0 0 20px 0',
            fontSize: '18px'
          }}>
            Detalhes da Tentativa de Pagamento
          </h3>
          
          <div style={{ marginBottom: '15px' }}>
            <span style={{ color: '#7F1D1D', display: 'inline-block', width: '140px' }}>Plano:</span>
            <strong>{planName}</strong>
          </div>
          
          <div style={{ marginBottom: '15px' }}>
            <span style={{ color: '#7F1D1D', display: 'inline-block', width: '140px' }}>Valor:</span>
            <strong>{amount}</strong>
          </div>
          
          {failureReason && (
            <div style={{ marginBottom: '15px' }}>
              <span style={{ color: '#7F1D1D', display: 'inline-block', width: '140px' }}>Motivo:</span>
              <strong style={{ color: '#DC2626' }}>{failureReason}</strong>
            </div>
          )}
          
          <div>
            <span style={{ color: '#7F1D1D', display: 'inline-block', width: '140px' }}>Status:</span>
            <span style={{
              backgroundColor: '#FEE2E2',
              color: '#DC2626',
              padding: '4px 12px',
              borderRadius: '20px',
              fontSize: '14px',
              fontWeight: '600'
            }}>
              Falhou
            </span>
          </div>
        </div>

        {/* Solutions */}
        <div style={{
          backgroundColor: '#FFFBEB',
          border: '1px solid #FCD34D',
          borderRadius: '8px',
          padding: '25px',
          marginBottom: '30px'
        }}>
          <h3 style={{
            color: '#92400E',
            margin: '0 0 15px 0',
            fontSize: '18px'
          }}>
            🔧 Como Resolver
          </h3>
          
          <ul style={{
            margin: '0',
            paddingLeft: '20px',
            color: '#92400E'
          }}>
            <li style={{ marginBottom: '8px' }}>Verifique se há saldo suficiente em sua conta</li>
            <li style={{ marginBottom: '8px' }}>Confirme se os dados do cartão estão corretos</li>
            <li style={{ marginBottom: '8px' }}>Entre em contato com seu banco se necessário</li>
            <li>Atualize sua forma de pagamento no painel administrativo</li>
          </ul>
        </div>

        {/* Urgency Notice */}
        <div style={{
          backgroundColor: '#FEF2F2',
          border: '1px solid #FECACA',
          borderRadius: '8px',
          padding: '20px',
          marginBottom: '30px'
        }}>
          <p style={{
            margin: '0',
            color: '#B91C1C',
            fontSize: '16px',
            textAlign: 'center'
          }}>
            <strong>⏰ Ação Necessária:</strong> Regularize o pagamento em até 7 dias para evitar a suspensão da sua conta.
          </p>
          
          {nextAttemptDate && (
            <p style={{
              margin: '10px 0 0 0',
              color: '#7F1D1D',
              fontSize: '14px',
              textAlign: 'center'
            }}>
              Próxima tentativa automática: <strong>{nextAttemptDate}</strong>
            </p>
          )}
        </div>

        {/* CTA Buttons */}
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <a href={retryUrl} style={{
            backgroundColor: '#DC2626',
            color: '#ffffff',
            padding: '15px 30px',
            textDecoration: 'none',
            borderRadius: '8px',
            fontWeight: '600',
            fontSize: '16px',
            display: 'inline-block',
            marginBottom: '15px'
          }}>
            Atualizar Forma de Pagamento
          </a>
          
          <br />
          
          <a href="https://zapbless.com/suporte" style={{
            backgroundColor: '#6B7280',
            color: '#ffffff',
            padding: '12px 25px',
            textDecoration: 'none',
            borderRadius: '6px',
            fontWeight: '500',
            fontSize: '14px',
            display: 'inline-block'
          }}>
            Falar com o Suporte
          </a>
        </div>

        <p>
          Se você acredita que este é um erro ou tem alguma dúvida, nossa equipe de suporte está pronta para ajudar. 
          Responda este email ou entre em contato conosco através dos canais abaixo.
        </p>

        <p style={{ marginBottom: '0' }}>
          Agradecemos sua compreensão e esperamos resolver isso rapidamente! 🙏
        </p>
      </div>

      {/* Footer */}
      <div style={{
        backgroundColor: '#F1F5F9',
        padding: '30px',
        textAlign: 'center',
        borderRadius: '0 0 8px 8px',
        borderTop: '1px solid #E2E8F0'
      }}>
        <p style={{
          margin: '0 0 15px 0',
          fontSize: '14px',
          color: '#64748B'
        }}>
          <strong>ZapBless</strong> - Conectando sua igreja através da tecnologia
        </p>
        
        <p style={{
          margin: '0 0 15px 0',
          fontSize: '14px',
          color: '#64748B'
        }}>
          📧 suporte@zapbless.com | 📱 WhatsApp: (11) 99999-9999
        </p>
        
        <div style={{
          backgroundColor: '#FEF2F2',
          border: '1px solid #FECACA',
          borderRadius: '6px',
          padding: '15px',
          margin: '15px 0'
        }}>
          <p style={{
            margin: '0',
            fontSize: '13px',
            color: '#B91C1C',
            fontWeight: '600'
          }}>
            🚨 IMPORTANTE: Seu acesso pode ser suspenso se o pagamento não for regularizado.
          </p>
        </div>
        
        <p style={{
          margin: '0',
          fontSize: '12px',
          color: '#94A3B8'
        }}>
          Para gerenciar sua assinatura, acesse seu painel administrativo.
          <br />
          Este é um email automático, não responda a esta mensagem.
        </p>
      </div>
    </div>
  );
};

export default PaymentFailureEmailTemplate;

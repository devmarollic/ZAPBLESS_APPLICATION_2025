
import React from 'react';

interface PaymentSuccessEmailProps {
  customerName: string;
  planName: string;
  amount: string;
  nextBillingDate: string;
  invoiceUrl?: string;
}

export const PaymentSuccessEmailTemplate: React.FC<PaymentSuccessEmailProps> = ({
  customerName,
  planName,
  amount,
  nextBillingDate,
  invoiceUrl
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
        backgroundColor: 'linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%)',
        background: 'linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%)',
        padding: '40px 20px',
        textAlign: 'center',
        borderRadius: '8px 8px 0 0'
      }}>
        <h1 style={{
          color: '#ffffff',
          margin: '0',
          fontSize: '28px',
          fontWeight: 'bold'
        }}>
          <span style={{ color: '#60A5FA' }}>Zap</span>
          <span style={{ color: '#A78BFA' }}>Bless</span>
        </h1>
        <p style={{
          color: '#E0E7FF',
          margin: '10px 0 0 0',
          fontSize: '16px'
        }}>
          Pagamento Confirmado ✅
        </p>
      </div>

      {/* Content */}
      <div style={{ padding: '40px 30px' }}>
        <div style={{
          backgroundColor: '#F0FDF4',
          border: '2px solid #16A34A',
          borderRadius: '8px',
          padding: '20px',
          marginBottom: '30px',
          textAlign: 'center'
        }}>
          <div style={{
            fontSize: '48px',
            marginBottom: '10px'
          }}>🎉</div>
          <h2 style={{
            color: '#16A34A',
            margin: '0 0 10px 0',
            fontSize: '24px'
          }}>
            Pagamento Realizado com Sucesso!
          </h2>
          <p style={{
            color: '#15803D',
            margin: '0',
            fontSize: '16px'
          }}>
            Sua assinatura foi ativada e você já pode aproveitar todos os benefícios.
          </p>
        </div>

        <p style={{ fontSize: '18px', marginBottom: '30px' }}>
          Olá <strong>{customerName}</strong>,
        </p>

        <p style={{ marginBottom: '25px' }}>
          Recebemos seu pagamento e sua assinatura do plano <strong>{planName}</strong> foi ativada com sucesso! 
          Agora você tem acesso completo a todas as funcionalidades para fortalecer a comunicação e gestão da sua igreja.
        </p>

        {/* Payment Details */}
        <div style={{
          backgroundColor: '#F8FAFC',
          border: '1px solid #E2E8F0',
          borderRadius: '8px',
          padding: '25px',
          marginBottom: '30px'
        }}>
          <h3 style={{
            color: '#1E293B',
            margin: '0 0 20px 0',
            fontSize: '18px'
          }}>
            Detalhes do Pagamento
          </h3>
          
          <div style={{ marginBottom: '15px' }}>
            <span style={{ color: '#64748B', display: 'inline-block', width: '140px' }}>Plano:</span>
            <strong>{planName}</strong>
          </div>
          
          <div style={{ marginBottom: '15px' }}>
            <span style={{ color: '#64748B', display: 'inline-block', width: '140px' }}>Valor Pago:</span>
            <strong style={{ color: '#16A34A' }}>{amount}</strong>
          </div>
          
          <div style={{ marginBottom: '15px' }}>
            <span style={{ color: '#64748B', display: 'inline-block', width: '140px' }}>Próxima Cobrança:</span>
            <strong>{nextBillingDate}</strong>
          </div>
          
          <div>
            <span style={{ color: '#64748B', display: 'inline-block', width: '140px' }}>Status:</span>
            <span style={{
              backgroundColor: '#DCFCE7',
              color: '#16A34A',
              padding: '4px 12px',
              borderRadius: '20px',
              fontSize: '14px',
              fontWeight: '600'
            }}>
              Ativo
            </span>
          </div>
        </div>

        {/* Next Steps */}
        <div style={{
          backgroundColor: '#EFF6FF',
          border: '1px solid #DBEAFE',
          borderRadius: '8px',
          padding: '25px',
          marginBottom: '30px'
        }}>
          <h3 style={{
            color: '#1E40AF',
            margin: '0 0 15px 0',
            fontSize: '18px'
          }}>
            Próximos Passos
          </h3>
          
          <ul style={{
            margin: '0',
            paddingLeft: '20px',
            color: '#1E40AF'
          }}>
            <li style={{ marginBottom: '8px' }}>Acesse sua conta no painel administrativo</li>
            <li style={{ marginBottom: '8px' }}>Configure os ministérios da sua igreja</li>
            <li style={{ marginBottom: '8px' }}>Conecte seu WhatsApp Business</li>
            <li>Comece a enviar mensagens e gerenciar sua comunidade</li>
          </ul>
        </div>

        {/* CTA Button */}
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <a href="https://zapbless.com/dashboard" style={{
            backgroundColor: '#3B82F6',
            color: '#ffffff',
            padding: '15px 30px',
            textDecoration: 'none',
            borderRadius: '8px',
            fontWeight: '600',
            fontSize: '16px',
            display: 'inline-block'
          }}>
            Acessar Painel Administrativo
          </a>
        </div>

        {invoiceUrl && (
          <p style={{ textAlign: 'center', marginBottom: '30px' }}>
            <a href={invoiceUrl} style={{
              color: '#6366F1',
              textDecoration: 'none',
              fontSize: '14px'
            }}>
              📄 Baixar Comprovante de Pagamento
            </a>
          </p>
        )}

        <p>
          Se tiver alguma dúvida ou precisar de ajuda, nossa equipe de suporte está sempre pronta para atendê-lo.
        </p>

        <p style={{ marginBottom: '0' }}>
          Que Deus abençoe abundantemente sua igreja! 🙏
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

export default PaymentSuccessEmailTemplate;

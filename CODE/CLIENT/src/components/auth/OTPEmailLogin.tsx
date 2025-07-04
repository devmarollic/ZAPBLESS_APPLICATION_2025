
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { Mail, ArrowLeft } from 'lucide-react';
import { HttpClient } from '@/lib/http_client';
import { useToast } from '@/hooks/use-toast';

const emailSchema = z.object({
  email: z.string().email({ message: 'Email inválido' }),
});

const otpSchema = z.object({
  otp: z.string().min(6, { message: 'Código deve ter 6 dígitos' }),
});

type EmailFormData = z.infer<typeof emailSchema>;
type OTPFormData = z.infer<typeof otpSchema>;

interface OTPEmailLoginProps {
  onSuccess: () => void;
  onBack: () => void;
}

const OTPEmailLogin: React.FC<OTPEmailLoginProps> = ({ onSuccess, onBack }) => {
  const { toast } = useToast();
  const [step, setStep] = useState<'email' | 'otp'>('email');
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const emailForm = useForm<EmailFormData>({
    resolver: zodResolver(emailSchema),
  });

  const otpForm = useForm<OTPFormData>({
    resolver: zodResolver(otpSchema),
  });

  const sendOTP = async (data: EmailFormData) => {
    setIsLoading(true);
    try {
      await HttpClient.post('/login/send-otp', { email: data.email });
      setEmail(data.email);
      setStep('otp');
      toast({
        title: 'Código enviado',
        description: 'Verifique seu email para o código de verificação',
      });
    } catch (error) {
      toast({
        title: 'Erro ao enviar código',
        description: 'Tente novamente em alguns minutos',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const verifyOTP = async (data: OTPFormData) => {
    setIsLoading(true);
    try {
      await HttpClient.post('/login/verify-otp', {
        email,
        otp: data.otp,
      });
      toast({
        title: 'Login realizado com sucesso',
        description: 'Você será redirecionado para o dashboard',
      });
      onSuccess();
    } catch (error) {
      toast({
        title: 'Código inválido',
        description: 'Verifique o código e tente novamente',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (step === 'email') {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="p-1"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h3 className="text-lg font-semibold">Login com Email</h3>
        </div>

        <form onSubmit={emailForm.handleSubmit(sendOTP)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Input
                id="email"
                type="email"
                placeholder="seuemail@igreja.com"
                className="pl-10"
                {...emailForm.register('email')}
                disabled={isLoading}
              />
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500" />
            </div>
            {emailForm.formState.errors.email && (
              <p className="text-red-500 text-sm">
                {emailForm.formState.errors.email.message}
              </p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-zapBlue-600 to-zapPurple-600 hover:from-zapBlue-700 hover:to-zapPurple-700"
            disabled={isLoading}
          >
            {isLoading ? 'Enviando...' : 'Enviar Código'}
          </Button>
        </form>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => setStep('email')}
          className="p-1"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h3 className="text-lg font-semibold">Digite o Código</h3>
      </div>

      <div className="text-center">
        <p className="text-sm text-gray-600 mb-4">
          Enviamos um código de 6 dígitos para<br />
          <span className="font-medium">{email}</span>
        </p>
      </div>

      <form onSubmit={otpForm.handleSubmit(verifyOTP)} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="otp">Código de Verificação</Label>
          <div className="flex justify-center">
            <InputOTP
              maxLength={6}
              value={otpForm.watch('otp') || ''}
              onChange={(value) => otpForm.setValue('otp', value)}
            >
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>
          </div>
          {otpForm.formState.errors.otp && (
            <p className="text-red-500 text-sm text-center">
              {otpForm.formState.errors.otp.message}
            </p>
          )}
        </div>

        <Button
          type="submit"
          className="w-full bg-gradient-to-r from-zapBlue-600 to-zapPurple-600 hover:from-zapBlue-700 hover:to-zapPurple-700"
          disabled={isLoading}
        >
          {isLoading ? 'Verificando...' : 'Verificar Código'}
        </Button>

        <Button
          type="button"
          variant="ghost"
          className="w-full"
          onClick={() => sendOTP({ email })}
          disabled={isLoading}
        >
          Reenviar código
        </Button>
      </form>
    </div>
  );
};

export default OTPEmailLogin;

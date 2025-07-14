
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { HttpClient } from '@/lib/http_client';

const forgotPasswordSchema = z.object({
    email: z.string().email({ message: 'Email inválido' }),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

const ForgotPassword = () => {
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);
    const [emailSent, setEmailSent] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
        getValues,
    } = useForm<ForgotPasswordFormData>({
        resolver: zodResolver(forgotPasswordSchema),
        defaultValues: {
            email: '',
        },
    });

    const onSubmit = async (data: ForgotPasswordFormData) => {
        setIsLoading(true);

        try {
            await HttpClient.getDefault().post('/login/reset-password', { email: data.email });
            
            setEmailSent(true);
            toast({
                title: 'Email enviado',
                description: 'Verifique sua caixa de entrada para redefinir sua senha',
            });
        } catch (error) {
            toast({
                title: 'Erro ao enviar email',
                description: 'Não foi possível enviar o email. Tente novamente mais tarde.',
                variant: 'destructive',
            });
        } finally {
            setIsLoading(false);
        }
    };

    if (emailSent) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
                <Card className="w-full max-w-md">
                    <CardHeader className="text-center">
                        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                            <CheckCircle className="h-6 w-6 text-green-600" />
                        </div>
                        <CardTitle className="text-2xl font-bold text-gray-900">
                            Email enviado!
                        </CardTitle>
                        <CardDescription>
                            Enviamos um link de recuperação para <strong>{getValues('email')}</strong>
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="text-sm text-gray-600 text-center">
                            <p>Verifique sua caixa de entrada e spam.</p>
                            <p>O link expira em 24 horas.</p>
                        </div>
                        
                        <div className="flex flex-col space-y-2">
                            <Button variant="outline" onClick={() => setEmailSent(false)}>
                                Reenviar email
                            </Button>
                            <Button variant="ghost" asChild>
                                <Link to="/login" className="flex items-center justify-center">
                                    <ArrowLeft className="mr-2 h-4 w-4" />
                                    Voltar para login
                                </Link>
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
            <Card className="w-full max-w-md">
                <CardHeader className="text-center">
                    <div className="mx-auto mb-4">
                        <h2 className="text-3xl font-bold text-gray-900">
                            <span className="text-zapPurple-600">Zap</span>
                            <span className="text-zapBlue-600">Bless</span>
                        </h2>
                    </div>
                    <CardTitle className="text-2xl font-bold text-gray-900">
                        Recuperar senha
                    </CardTitle>
                    <CardDescription>
                        Digite seu email para receber o link de recuperação
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-gray-700">
                                Email
                            </Label>
                            <div className="relative">
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="seuemail@igreja.com"
                                    className={`pl-10 ${errors.email ? "border-red-500" : ""}`}
                                    {...register("email")}
                                    disabled={isLoading}
                                />
                                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500" />
                            </div>
                            {errors.email && (
                                <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                            )}
                        </div>

                        <Button
                            type="submit"
                            className="w-full bg-gradient-to-r from-zapBlue-600 to-zapPurple-600 hover:from-zapBlue-700 hover:to-zapPurple-700 rounded-full"
                            disabled={isLoading}
                        >
                            {isLoading ? "Enviando..." : "Enviar link de recuperação"}
                        </Button>
                    </form>

                    <div className="mt-6 text-center">
                        <Link 
                            to="/login" 
                            className="text-zapBlue-600 hover:text-zapBlue-500 flex items-center justify-center text-sm"
                        >
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Voltar para login
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default ForgotPassword;

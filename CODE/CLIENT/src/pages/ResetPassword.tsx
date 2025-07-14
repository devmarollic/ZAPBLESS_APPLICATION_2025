
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff, Lock, CheckCircle, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { HttpClient } from '@/lib/http_client';
import { AuthenticationService } from '@/lib/authentication_service';

const resetPasswordSchema = z.object({
    password: z.string().min(6, { message: 'Senha deve ter no mínimo 6 caracteres' }),
    confirmPassword: z.string().min(6, { message: 'Confirmação de senha é obrigatória' }),
}).refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
});

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

const ResetPassword = () => {
    const { toast } = useToast();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [tokenValid, setTokenValid] = useState<boolean | null>(null);
    const [passwordReset, setPasswordReset] = useState(false);

    const token = searchParams.get('code');

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<ResetPasswordFormData>({
        resolver: zodResolver(resetPasswordSchema),
        defaultValues: {
            password: '',
            confirmPassword: '',
        },
    });

    useEffect(() => {
        // Verificar se o token é válido
        const verifyToken = async () => {
            if (!token) {
                setTokenValid(false);
                return;
            }

            try {
                let response = await HttpClient.getDefault().get<{ access_token: string, refresh_token: string }>('/login/exchange-code?code=' + token);

                AuthenticationService.updateTokens(response.access_token, response.refresh_token);
                
                // Para demonstração, considerar token válido se tiver mais de 10 caracteres
                setTokenValid(token.length > 10);
            } catch (error) {
                setTokenValid(false);
            }
        };

        verifyToken();
    }, [token]);

    const onSubmit = async (data: ResetPasswordFormData) => {
        setIsLoading(true);

        try {
            await HttpClient.getDefault().post('/login/update-password?access_token=' + AuthenticationService.getAccessToken(), { newPassword: data.password });
            
            setPasswordReset(true);
            toast({
                title: 'Senha redefinida',
                description: 'Sua senha foi redefinida com sucesso',
            });

            // Redirecionar para login após 3 segundos
            setTimeout(() => {
                navigate('/login');
            }, 3000);
        } catch (error) {
            toast({
                title: 'Erro ao redefinir senha',
                description: 'Não foi possível redefinir a senha. Tente novamente.',
                variant: 'destructive',
            });
        } finally {
            setIsLoading(false);
        }
    };

    // Token inválido ou expirado
    if (tokenValid === false) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
                <Card className="w-full max-w-md">
                    <CardHeader className="text-center">
                        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                            <AlertTriangle className="h-6 w-6 text-red-600" />
                        </div>
                        <CardTitle className="text-2xl font-bold text-gray-900">
                            Link expirado
                        </CardTitle>
                        <CardDescription>
                            Este link de recuperação expirou ou é inválido
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="text-sm text-gray-600 text-center">
                            <p>Por favor, solicite um novo link de recuperação.</p>
                        </div>
                        
                        <div className="flex flex-col space-y-2">
                            <Button asChild>
                                <Link to="/forgot-password">
                                    Solicitar novo link
                                </Link>
                            </Button>
                            <Button variant="ghost" asChild>
                                <Link to="/login">
                                    Voltar para login
                                </Link>
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    // Senha redefinida com sucesso
    if (passwordReset) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
                <Card className="w-full max-w-md">
                    <CardHeader className="text-center">
                        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                            <CheckCircle className="h-6 w-6 text-green-600" />
                        </div>
                        <CardTitle className="text-2xl font-bold text-gray-900">
                            Senha redefinida!
                        </CardTitle>
                        <CardDescription>
                            Sua senha foi redefinida com sucesso
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="text-sm text-gray-600 text-center">
                            <p>Você será redirecionado para a tela de login em alguns segundos.</p>
                        </div>
                        
                        <Button asChild className="w-full">
                            <Link to="/login">
                                Ir para login
                            </Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    // Carregando verificação do token
    if (tokenValid === null) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
                <Card className="w-full max-w-md">
                    <CardContent className="p-6">
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-zapBlue-600 mx-auto"></div>
                            <p className="mt-4 text-gray-600">Verificando link...</p>
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
                        Nova senha
                    </CardTitle>
                    <CardDescription>
                        Digite sua nova senha
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="password" className="text-gray-700">
                                Nova senha
                            </Label>
                            <div className="relative">
                                <Input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    className={`pl-10 ${errors.password ? "border-red-500" : ""}`}
                                    {...register("password")}
                                    disabled={isLoading}
                                />
                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500" />
                                <button
                                    type="button"
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? (
                                        <EyeOff className="h-5 w-5" />
                                    ) : (
                                        <Eye className="h-5 w-5" />
                                    )}
                                </button>
                            </div>
                            {errors.password && (
                                <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="confirmPassword" className="text-gray-700">
                                Confirmar nova senha
                            </Label>
                            <div className="relative">
                                <Input
                                    id="confirmPassword"
                                    type={showConfirmPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    className={`pl-10 ${errors.confirmPassword ? "border-red-500" : ""}`}
                                    {...register("confirmPassword")}
                                    disabled={isLoading}
                                />
                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500" />
                                <button
                                    type="button"
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                >
                                    {showConfirmPassword ? (
                                        <EyeOff className="h-5 w-5" />
                                    ) : (
                                        <Eye className="h-5 w-5" />
                                    )}
                                </button>
                            </div>
                            {errors.confirmPassword && (
                                <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>
                            )}
                        </div>

                        <Button
                            type="submit"
                            className="w-full bg-gradient-to-r from-zapBlue-600 to-zapPurple-600 hover:from-zapBlue-700 hover:to-zapPurple-700 rounded-full"
                            disabled={isLoading}
                        >
                            {isLoading ? "Redefinindo..." : "Redefinir senha"}
                        </Button>
                    </form>

                    <div className="mt-6 text-center">
                        <Link 
                            to="/login" 
                            className="text-zapBlue-600 hover:text-zapBlue-500 text-sm"
                        >
                            Voltar para login
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default ResetPassword;

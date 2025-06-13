
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff, Mail } from 'lucide-react';
import { HttpClient } from '@/lib/http_client';
import { AuthenticationService } from '@/lib/authentication_service';
import { useToast } from '@/hooks/use-toast';
import { Link } from 'react-router-dom';
import { AuthenticationResult } from '@/lib/authentication_result';
import { ErrorConstants } from '@/lib/error_contants';
import { usePlanContext } from '@/context/PlanContext';

const loginSchema = z.object({
    email: z.string().email({ message: 'Email inválido' }),
    password: z.string().min(6, { message: 'Senha deve ter no mínimo 6 caracteres' }),
});

type Subscription = {
    id: string;
    planId: string;
    periodId: string;
}

type LoginFormData = z.infer<typeof loginSchema>;

const Login = () => {
    const navigate = useNavigate();
    const { toast } = useToast();
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const { setSelectedPlan, setIsAnnual, setSubscriptionId } = usePlanContext();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: '',
            password: '',
        },
    });

    const getSubscriptionByEmail = async (email: string) => {
        const response = await HttpClient.get<Subscription>('/subscriptions/email/' + email);

        setSelectedPlan(response.planId);
        setIsAnnual(response.periodId === 'annual');
        setSubscriptionId(response.id);
    }

    const onSubmit = async (data: LoginFormData) => {
        setIsLoading(true);

        try {
            const response = await HttpClient.post<AuthenticationResult>('/login', {
                email: data.email,
                password: data.password,
            });

            AuthenticationService.authenticate(response, response.user.user_metadata.first_name);

            toast({
                title: 'Login realizado com sucesso',
                description: 'Você será redirecionado para o dashboard',
            });

            navigate('/dashboard');
        } catch (error) {
            if ( error.message === ErrorConstants.SUBSCRIPTION_NOT_FOUND ) {
                await getSubscriptionByEmail(data.email);
                navigate('/pagamento');
            }
            else if ( error.message === ErrorConstants.PERMISSION_VALIDATION_ERROR ) {
                toast({
                    title: 'Erro ao fazer login',
                    description: 'Você não tem permissão para acessar o sistema',
                    variant: 'destructive',
                });
            }
            else if ( error.message === ErrorConstants.USER_NOT_FOUND_OR_INSUFFICIENT_PERMISSIONS ) {
                toast({
                    title: 'Erro ao fazer login',
                    description: 'Verifique suas credenciais e tente novamente',
                    variant: 'destructive',
                });
            }
            else
            {
                toast({
                    title: 'Alguma coisa deu errado!',
                    description: 'Tente novamente mais tarde',
                    variant: 'destructive',
                });
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
            <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-6 md:p-8">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">
                        <span className="text-zapPurple-600">Zap</span>
                        <span className="text-zapBlue-600">Bless</span>
                    </h2>
                    <p className="text-gray-600">Entre na sua conta para continuar</p>
                </div>

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

                    <div className="space-y-2">
                        <Label htmlFor="password" className="text-gray-700">
                            Senha
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

                    <div className="flex items-center justify-between">
                        <div className="text-sm">
                            <a href="#" className="text-zapBlue-600 hover:text-zapBlue-500">
                                Esqueceu sua senha?
                            </a>
                        </div>
                    </div>

                    <Button
                        type="submit"
                        className="w-full bg-gradient-to-r from-zapBlue-600 to-zapPurple-600 hover:from-zapBlue-700 hover:to-zapPurple-700 rounded-full"
                        disabled={isLoading}
                    >
                        {isLoading ? "Entrando..." : "Entrar"}
                    </Button>
                </form>

                <div className="mt-6 text-center">
                    <p className="text-sm text-gray-600">
                        Ainda não tem uma conta?{" "}
                        <Link to="/register" className="text-zapBlue-600 hover:text-zapBlue-500">
                            Registre-se
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;

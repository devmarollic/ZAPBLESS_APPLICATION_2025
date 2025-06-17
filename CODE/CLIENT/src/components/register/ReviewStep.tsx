
import { usePlanContext } from '@/context/PlanContext';
import { ChurchInfo, AdminInfo } from '@/types/register';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface ReviewStepProps {
    churchInfo: ChurchInfo;
    adminInfo: AdminInfo;
}

const ReviewStep = ({ churchInfo, adminInfo }: ReviewStepProps) => {
    const { planByIdMap, isLoading, selectedPlan, isAnnual } = usePlanContext();

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (planByIdMap[selectedPlan] === undefined) {
        return <div>Nenhum plano selecionado</div>;
    }

    return (
        <div className="space-y-6">
            <h2 className="text-xl font-semibold text-center mb-6">
                Revise suas informações
            </h2>

            <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                    <h3 className="text-lg font-medium text-zapBlue-600 border-b pb-2">
                        Dados da Igreja
                    </h3>

                    {churchInfo.imagePreview && (
                        <div className="rounded-lg overflow-hidden h-40 w-full">
                            <img
                                src={churchInfo.imagePreview}
                                alt="Church"
                                className="w-full h-full object-cover"
                            />
                        </div>
                    )}

                    <div className="space-y-2">
                        <div>
                            <span className="font-medium">Nome:</span>{' '}
                            <span>{churchInfo.name}</span>
                        </div>
                        <div>
                            <span className="font-medium">Endereço:</span>{' '}
                            <span>
                                {churchInfo.addressLine1}
                                {churchInfo.addressLine2 ? `, ${churchInfo.addressLine2}` : ''}
                            </span>
                        </div>
                        <div>
                            <span className="font-medium">Cidade:</span>{' '}
                            <span>{churchInfo.cityCode}</span>
                        </div>
                        <div>
                            <span className="font-medium">Estado:</span>{' '}
                            <span>{churchInfo.stateCode}</span>
                        </div>
                        <div>
                            <span className="font-medium">País:</span>{' '}
                            <span>{churchInfo.countryCode}</span>
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    <h3 className="text-lg font-medium text-zapPurple-600 border-b pb-2">
                        Dados do Administrador
                    </h3>

                    <div className="space-y-2">
                        <div>
                            <span className="font-medium">Nome:</span>{' '}
                            <span>{adminInfo.firstName} {adminInfo.lastName}</span>
                        </div>
                        <div>
                            <span className="font-medium">Email:</span>{' '}
                            <span>{adminInfo.email}</span>
                        </div>
                        <div>
                            <span className="font-medium">Data de Nascimento:</span>{' '}
                            <span>
                                {adminInfo.birthDate
                                    ? format(adminInfo.birthDate, "PPP", { locale: ptBR })
                                    : "Não informado"}
                            </span>
                        </div>
                        <div>
                            <span className="font-medium">Gênero:</span>{' '}
                            <span>
                                {adminInfo.genderId === "male"
                                    ? "Masculino"
                                    : adminInfo.genderId === "female"
                                        ? "Feminino"
                                        : "Outro"}
                            </span>
                        </div>
                        <div>
                            <span className="font-medium">Telefone:</span>{' '}
                            <span>
                                {adminInfo.phonePrefix} {adminInfo.phoneNumber}
                            </span>
                        </div>
                    </div>

                    <h3 className="text-lg font-medium text-zapGold-600 border-b pb-2 mt-6">
                        Plano Selecionado
                    </h3>

                    <div className="p-4 rounded-lg bg-gradient-to-r from-zapBlue-50 to-zapPurple-50 border border-zapPurple-100">
                        <div className="flex justify-between items-center">
                            <div>
                                <h4 className="font-semibold text-zapPurple-700">{planByIdMap[selectedPlan].name}</h4>
                                <p className="text-sm text-zapPurple-600">Pagamento {isAnnual ? 'anual' : 'mensal'}</p>
                            </div>
                            <div className="text-right">
                                <span className="text-xl font-bold text-zapPurple-700">
                                    R${isAnnual ? planByIdMap[selectedPlan].annualPrice : planByIdMap[selectedPlan].monthlyPrice}
                                </span>
                                <span className="text-sm text-zapPurple-600">
                                    {isAnnual ? ' / ano' : ' / mês'}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg mt-6">
                <p className="text-sm text-blue-700">
                    Ao clicar em "Finalizar cadastro", você concorda com nossos Termos de Serviço e Política de Privacidade.
                </p>
            </div>
        </div>
    );
};

export default ReviewStep;

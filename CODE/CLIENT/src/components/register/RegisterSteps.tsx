
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

interface RegisterStepsProps {
    steps: string[];
    currentStep: number;
}

const RegisterSteps = ({ steps, currentStep }: RegisterStepsProps) => {
    return (
        <div className="flex justify-center">
            <ol className="flex items-center w-full">
                {steps.map((step, index) => (
                    <li
                        key={index}
                        className={cn(
                            "flex items-center relative",
                            index < steps.length - 1
                                ? "w-full"
                                : "flex-initial"
                        )}
                    >
                        <div className="flex flex-col items-center">
                            <span
                                className={cn(
                                    "flex items-center justify-center w-8 h-8 rounded-full text-sm border-2 font-semibold",
                                    index < currentStep
                                        ? "bg-zapPurple-600 text-white border-zapPurple-600"
                                        : index === currentStep
                                            ? "border-zapPurple-600 text-zapPurple-600"
                                            : "border-gray-300 text-gray-400"
                                )}
                            >
                                {index < currentStep ? (
                                    <Check className="h-4 w-4" />
                                ) : (
                                    index + 1
                                )}
                            </span>
                            <span
                                className={cn(
                                    "text-xs mt-1",
                                    index <= currentStep ? "text-zapPurple-600" : "text-gray-400"
                                )}
                            >
                                {step}
                            </span>
                        </div>
                        {index < steps.length - 1 && (
                            <div
                                className={cn(
                                    "flex-1 h-0.5 mx-2",
                                    index < currentStep ? "bg-zapPurple-600" : "bg-gray-300"
                                )}
                            ></div>
                        )}
                    </li>
                ))}
            </ol>
        </div>
    );
};

export default RegisterSteps;

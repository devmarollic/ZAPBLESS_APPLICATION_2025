
import React from 'react';
import { Input } from '@/components/ui/input';

interface PhoneInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export const PhoneInput = React.forwardRef<HTMLInputElement, PhoneInputProps>(
  ({ value, onChange, placeholder = "(00) 0 0000-0000", className, ...props }, ref) => {
    const formatPhoneNumber = (value: string) => {
      // Remove tudo que não é dígito
      const cleaned = value.replace(/\D/g, '');
      
      // Aplica a máscara (99) 9 9999-9999
      if (cleaned.length <= 2) {
        return cleaned;
      } else if (cleaned.length <= 3) {
        return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2)}`;
      } else if (cleaned.length <= 7) {
        return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 3)} ${cleaned.slice(3)}`;
      } else {
        return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 3)} ${cleaned.slice(3, 7)}-${cleaned.slice(7, 11)}`;
      }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const formatted = formatPhoneNumber(e.target.value);
      onChange(formatted);
    };

    return (
      <Input
        ref={ref}
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        className={className}
        maxLength={16}
        {...props}
      />
    );
  }
);

PhoneInput.displayName = "PhoneInput";

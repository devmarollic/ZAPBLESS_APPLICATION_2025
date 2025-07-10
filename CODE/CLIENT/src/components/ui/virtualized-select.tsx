import { useState, useMemo, useRef, useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Search, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface VirtualizedSelectProps {
  value?: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  options: Array<{
    value: string;
    label: string;
    subtitle?: string;
  }>;
  maxHeight?: number;
  searchPlaceholder?: string;
}

const VirtualizedSelect = ({
  value,
  onValueChange,
  placeholder,
  disabled,
  options,
  maxHeight = 300,
  searchPlaceholder = "Buscar..."
}: VirtualizedSelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const filteredOptions = useMemo(() => {
    if (!searchTerm) return options;
    
    return options.filter(option =>
      option.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (option.subtitle && option.subtitle.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [options, searchTerm]);

  const selectedOption = useMemo(() => {
    return options.find(option => option.value === value);
  }, [options, value]);

  useEffect(() => {
    if (!isOpen) {
      setSearchTerm('');
      setSelectedIndex(-1);
    }
  }, [isOpen]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < filteredOptions.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev > 0 ? prev - 1 : filteredOptions.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < filteredOptions.length) {
          onValueChange(filteredOptions[selectedIndex].value);
          setIsOpen(false);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        break;
    }
  };

  const handleSelect = (optionValue: string) => {
    onValueChange(optionValue);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <Select open={isOpen} onOpenChange={setIsOpen} value={value} onValueChange={handleSelect}>
        <SelectTrigger 
          disabled={disabled}
          className="w-full"
          onKeyDown={handleKeyDown}
        >
          <SelectValue placeholder={placeholder}>
            {selectedOption && (
              <div className="flex flex-col items-start">
                <span className="font-medium">{selectedOption.label}</span>
                {selectedOption.subtitle && (
                  <span className="text-xs text-muted-foreground">{selectedOption.subtitle}</span>
                )}
              </div>
            )}
          </SelectValue>
        </SelectTrigger>
        
        <SelectContent 
          className="w-full min-w-[300px]"
          onKeyDown={handleKeyDown}
        >
          <div className="p-2 border-b">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={searchPlaceholder}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
                onKeyDown={handleKeyDown}
              />
            </div>
          </div>
          
          <ScrollArea 
            ref={scrollAreaRef}
            className="max-h-[300px]"
            style={{ maxHeight: `${maxHeight}px` }}
          >
            <div className="p-1">
              {filteredOptions.length === 0 ? (
                <div className="px-2 py-4 text-center text-sm text-muted-foreground">
                  Nenhum resultado encontrado
                </div>
              ) : (
                filteredOptions.map((option, index) => (
                  <div
                    key={option.value}
                    className={cn(
                      "relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground",
                      selectedIndex === index && "bg-accent text-accent-foreground",
                      value === option.value && "bg-accent text-accent-foreground"
                    )}
                    onClick={() => handleSelect(option.value)}
                    onMouseEnter={() => setSelectedIndex(index)}
                  >
                    <div className="flex flex-col">
                      <span className="font-medium">{option.label}</span>
                      {option.subtitle && (
                        <span className="text-xs text-muted-foreground">{option.subtitle}</span>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
        </SelectContent>
      </Select>
    </div>
  );
};

export default VirtualizedSelect; 
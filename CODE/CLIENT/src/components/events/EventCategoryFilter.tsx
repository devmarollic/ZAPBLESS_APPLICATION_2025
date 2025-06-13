
import React, { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, ChevronDown } from "lucide-react";

interface EventCategoryFilterProps {
  selectedCategories: string[];
  onCategoriesChange: (categories: string[]) => void;
}

const EventCategoryFilter = ({
  selectedCategories,
  onCategoriesChange,
}: EventCategoryFilterProps) => {
  const categorias = [
    "Cultos",
    "Reuniões",
    "Eventos Especiais",
    "Grupos"
  ];

  const handleCategoryToggle = (category: string) => {
    if (category === 'todas') {
      // If selecting "Todas", clear all other selections
      onCategoriesChange(['todas']);
    } else {
      // If selecting a specific category
      if (selectedCategories.includes(category)) {
        // If removing a category
        const newCategories = selectedCategories.filter(cat => cat !== category);
        if (newCategories.length === 0) {
          // If removing the last category, select "Todas" by default
          onCategoriesChange(['todas']);
        } else {
          // Remove "Todas" from selection when selecting specific categories
          onCategoriesChange(newCategories.filter(cat => cat !== 'todas'));
        }
      } else {
        // If adding a category, make sure to remove "Todas" from the selection
        const newCategories = [...selectedCategories.filter(cat => cat !== 'todas'), category];
        onCategoriesChange(newCategories);
      }
    }
  };

  const getSelectedText = () => {
    if (selectedCategories.includes('todas') || selectedCategories.length === 0) {
      return "Todas";
    }
    
    if (selectedCategories.length === 1) {
      return selectedCategories[0];
    }
    
    return `${selectedCategories.length} selecionadas`;
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="flex items-center gap-1">
          {getSelectedText()}
          <ChevronDown className="h-4 w-4 ml-1" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-48">
        <DropdownMenuLabel>Categorias</DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        <DropdownMenuCheckboxItem 
          checked={selectedCategories.includes('todas')}
          onCheckedChange={() => handleCategoryToggle('todas')}
        >
          Todas
        </DropdownMenuCheckboxItem>
        
        {categorias.map((categoria) => (
          <DropdownMenuCheckboxItem 
            key={categoria}
            checked={selectedCategories.includes(categoria)}
            onCheckedChange={() => handleCategoryToggle(categoria)}
          >
            {categoria}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default EventCategoryFilter;

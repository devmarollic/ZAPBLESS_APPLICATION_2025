
import { Event } from "@/types/event";

export const gerarCalendario = (ano: number = 2025, mes: number = 4) => {
  // Criar um array bidimensional para representar as semanas do mês
  const calendario: Date[][] = [];
  
  // Primeiro dia do mês
  const primeiroDia = new Date(ano, mes, 1);
  
  // Último dia do mês
  const ultimoDia = new Date(ano, mes + 1, 0);
  
  // Dia da semana do primeiro dia (0 = domingo, 1 = segunda, etc.)
  const diaSemanaInicio = primeiroDia.getDay();
  
  // Número de dias no mês
  const diasNoMes = ultimoDia.getDate();
  
  // Criar as semanas
  let semanaAtual: Date[] = [];
  
  // Adicionar dias do mês anterior para completar a primeira semana
  for (let i = diaSemanaInicio - 1; i >= 0; i--) {
    const diaAnterior = new Date(ano, mes, -i);
    semanaAtual.push(diaAnterior);
  }
  
  // Adicionar todos os dias do mês atual
  for (let dia = 1; dia <= diasNoMes; dia++) {
    const dataAtual = new Date(ano, mes, dia);
    semanaAtual.push(dataAtual);
    
    // Se completou a semana (7 dias), adicionar ao calendário e começar nova semana
    if (semanaAtual.length === 7) {
      calendario.push(semanaAtual);
      semanaAtual = [];
    }
  }
  
  // Completar a última semana com dias do próximo mês, se necessário
  if (semanaAtual.length > 0) {
    let diaProximoMes = 1;
    while (semanaAtual.length < 7) {
      const proximaData = new Date(ano, mes + 1, diaProximoMes);
      semanaAtual.push(proximaData);
      diaProximoMes++;
    }
    calendario.push(semanaAtual);
  }
  
  return calendario;
};

export const getEventosPorMes = (eventos: any[], mes: number) => {
  return eventos.filter(evento => evento.data.getMonth() === mes);
};

// New helpers for the list and agenda views
export const agruparEventosPorData = (eventos: any[]) => {
  return eventos.reduce((groups, evento) => {
    const date = evento.data.toLocaleDateString('pt-BR');
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(evento);
    return groups;
  }, {} as Record<string, any[]>);
};

export const ordenarEventosPorData = (eventos: any[]) => {
  return [...eventos].sort((a, b) => a.data.getTime() - b.data.getTime());
};

export const formatarDataParaExibicao = (data: Date) => {
  return data.toLocaleDateString('pt-BR', { 
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
};

export const obterDiaSemana = (data: Date) => {
  const diasSemana = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
  return diasSemana[data.getDay()];
};

// New filters helpers
export const filtrarEventosPorCategoria = (eventos: any[], categoria: string) => {
  if (!categoria || categoria === 'todas') {
    return eventos;
  }
  
  return eventos.filter(evento => {
    switch (categoria.toLowerCase()) {
      case 'cultos':
        return evento.tipo === 'culto';
      case 'reunioes':
        return evento.tipo === 'reuniao';
      case 'eventos especiais':
        return evento.tipo === 'especial';
      case 'grupos':
        return evento.tipo === 'grupo';
      default:
        return true;
    }
  });
};

export const filtrarEventosPorData = (eventos: any[], dataInicio?: Date, dataFim?: Date) => {
  if (!dataInicio && !dataFim) {
    return eventos;
  }
  
  return eventos.filter(evento => {
    if (dataInicio && dataFim) {
      return evento.data >= dataInicio && evento.data <= dataFim;
    } else if (dataInicio) {
      return evento.data >= dataInicio;
    } else if (dataFim) {
      return evento.data <= dataFim;
    }
    return true;
  });
};

export const aplicarFiltros = (
  eventos: Event[], 
  categorias: string[] = [], 
  dataInicio?: Date, 
  dataFim?: Date, 
  mesAtual?: number, 
  anoAtual?: number
) => {

  let eventosFiltrados = [...eventos];
  
  // Filtrar por data
  if (dataInicio || dataFim) {
    const beforeFilter = eventosFiltrados.length;
    console.log('Filtering events by date range:', {
      totalEvents: beforeFilter,
      dataInicio: dataInicio?.toISOString(),
      dataFim: dataFim?.toISOString()
    });
    
    eventosFiltrados = eventosFiltrados.filter(evento => {
      const eventoData = new Date(evento.startAtTimestamp);
      
      if (dataInicio && dataFim) {
        const isInRange = eventoData >= dataInicio && eventoData <= dataFim;
        if (!isInRange) {
          console.log(`Filtering out event "${evento.title}" - date ${eventoData.toISOString()} not in range`);
        }
        return isInRange;
      } else if (dataInicio) {
        return eventoData >= dataInicio;
      } else if (dataFim) {
        return eventoData <= dataFim;
      }
      return true;
    });
    
    console.log('After date filtering:', {
      remainingEvents: eventosFiltrados.length,
      filteredOut: beforeFilter - eventosFiltrados.length
    });
  }
  
  // Filtrar por mês/ano específico se fornecido (comentado porque a API já filtra por data)
  // if (mesAtual !== undefined && anoAtual !== undefined) {
  //   eventosFiltrados = eventosFiltrados.filter(
  //     evento => {
  //       const eventoData = new Date(evento.startAtTimestamp);
  //       return eventoData.getMonth() === mesAtual && eventoData.getFullYear() === anoAtual;
  //     }
  //   );
  // }
  
  // Filtrar por categorias
  if (categorias && categorias.length > 0 && !categorias.includes('todas')) {
    eventosFiltrados = eventosFiltrados.filter(evento => {
      return categorias.some(cat => {
        switch (cat.toLowerCase()) {
          case 'cultos':
            return evento.typeId === 'worship';
          case 'reunioes':
            return evento.typeId === 'meeting';
          case 'eventos especiais':
            return evento.typeId === 'special';
          case 'grupos':
            return evento.typeId === 'group';
          default:
            return evento.typeId?.toLowerCase() === cat.toLowerCase();
        }
      });
    });
  }
  
  return eventosFiltrados;
};

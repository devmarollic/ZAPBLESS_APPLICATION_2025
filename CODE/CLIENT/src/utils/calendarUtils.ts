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
  eventosFiltrados = filtrarEventosPorData(eventosFiltrados, dataInicio, dataFim);
  
  // Filtrar por mês/ano específico se fornecido
  if (mesAtual !== undefined && anoAtual !== undefined) {
    eventosFiltrados = eventosFiltrados.filter(
      evento => new Date(evento.startAtTimestamp).getMonth() === mesAtual && new Date(evento.startAtTimestamp).getFullYear() === anoAtual
    );
  }
  
  // Filtrar por categorias
  if (categorias && categorias.length > 0) {
    eventosFiltrados = eventosFiltrados.filter(evento => 
      categorias.includes('todas') || categorias.some(cat => 
        evento.typeId?.toLowerCase() === cat.toLowerCase() || 
        (evento.statusId === 'is-coming' && cat.toLowerCase() === 'cultos') ||
        (evento.statusId === 'is-coming' && cat.toLowerCase() === 'reunioes') ||
        (evento.statusId === 'is-coming' && cat.toLowerCase() === 'eventos especiais') ||
        (evento.statusId === 'is-coming' && cat.toLowerCase() === 'grupos')
      )
    );
  }
  
  return eventos;
};

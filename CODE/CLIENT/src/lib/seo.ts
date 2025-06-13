
export interface SEOConfig {
  title: string;
  description: string;
  keywords?: string;
  canonical?: string;
  ogImage?: string;
}

export const defaultSEO: SEOConfig = {
  title: 'ZapBless - Conectando sua igreja via WhatsApp',
  description: 'ZapBless é um dashboard de chatbot para igrejas, conecte-se com seus fiéis via WhatsApp de forma simples e eficiente.',
  keywords: 'igreja, whatsapp, chatbot, dashboard, fiéis, membros, avisos, eventos, religião, administração eclesiástica',
  canonical: 'https://zapbless.com',
  ogImage: 'https://lovable.dev/opengraph-image-p98pqg.png'
};

export const pageSEO: Record<string, SEOConfig> = {
  '/': {
    title: 'ZapBless - Conectando sua igreja via WhatsApp',
    description: 'Dashboard completo para igrejas gerenciarem fiéis via WhatsApp. Envie avisos, organize eventos e administre membros de forma simples.',
    keywords: 'igreja, whatsapp, chatbot, dashboard, fiéis, membros, avisos, eventos, religião'
  },
  '/register': {
    title: 'Cadastre sua Igreja - ZapBless',
    description: 'Cadastre sua igreja no ZapBless e comece a se conectar com seus fiéis via WhatsApp hoje mesmo.',
    keywords: 'cadastro igreja, registro, whatsapp igreja, chatbot religioso'
  },
  '/login': {
    title: 'Login - ZapBless',
    description: 'Faça login no ZapBless e acesse o dashboard da sua igreja.',
    keywords: 'login, acesso, dashboard igreja'
  },
  '/dashboard': {
    title: 'Dashboard - ZapBless',
    description: 'Gerencie sua igreja com o dashboard completo do ZapBless. Membros, avisos, eventos e muito mais.',
    keywords: 'dashboard igreja, gerenciamento, membros, avisos, eventos'
  },
  '/dashboard/membros': {
    title: 'Gerenciar Membros - ZapBless',
    description: 'Gerencie os membros da sua igreja de forma simples e organizada.',
    keywords: 'membros igreja, cadastro membros, gerenciar fiéis'
  },
  '/dashboard/eventos': {
    title: 'Eventos da Igreja - ZapBless',
    description: 'Organize e gerencie os eventos da sua igreja com facilidade.',
    keywords: 'eventos igreja, cultos, reuniões, agenda igreja'
  },
  '/dashboard/avisos': {
    title: 'Avisos da Igreja - ZapBless',
    description: 'Envie avisos importantes para os membros da sua igreja via WhatsApp.',
    keywords: 'avisos igreja, comunicação igreja, whatsapp avisos'
  },
  '/sobre': {
    title: 'Sobre o ZapBless',
    description: 'Conheça a história e missão do ZapBless em conectar igrejas com seus fiéis.',
    keywords: 'sobre zapbless, missão, história, empresa'
  },
  '/contato': {
    title: 'Contato - ZapBless',
    description: 'Entre em contato conosco. Estamos aqui para ajudar sua igreja.',
    keywords: 'contato, suporte, ajuda, atendimento'
  }
};

export const updatePageSEO = (path: string) => {
  const seoConfig = pageSEO[path] || defaultSEO;
  
  // Update document title
  document.title = seoConfig.title;
  
  // Update meta description
  const metaDescription = document.querySelector('meta[name="description"]');
  if (metaDescription) {
    metaDescription.setAttribute('content', seoConfig.description);
  }
  
  // Update meta keywords
  const metaKeywords = document.querySelector('meta[name="keywords"]');
  if (metaKeywords && seoConfig.keywords) {
    metaKeywords.setAttribute('content', seoConfig.keywords);
  }
  
  // Update canonical URL
  const canonical = document.querySelector('link[rel="canonical"]');
  if (canonical && seoConfig.canonical) {
    canonical.setAttribute('href', seoConfig.canonical + path);
  }
  
  // Update Open Graph tags
  const ogTitle = document.querySelector('meta[property="og:title"]');
  if (ogTitle) {
    ogTitle.setAttribute('content', seoConfig.title);
  }
  
  const ogDescription = document.querySelector('meta[property="og:description"]');
  if (ogDescription) {
    ogDescription.setAttribute('content', seoConfig.description);
  }
  
  const ogUrl = document.querySelector('meta[property="og:url"]');
  if (ogUrl && seoConfig.canonical) {
    ogUrl.setAttribute('content', seoConfig.canonical + path);
  }
  
  // Update Twitter tags
  const twitterTitle = document.querySelector('meta[name="twitter:title"]');
  if (twitterTitle) {
    twitterTitle.setAttribute('content', seoConfig.title);
  }
  
  const twitterDescription = document.querySelector('meta[name="twitter:description"]');
  if (twitterDescription) {
    twitterDescription.setAttribute('content', seoConfig.description);
  }
  
  const twitterUrl = document.querySelector('meta[name="twitter:url"]');
  if (twitterUrl && seoConfig.canonical) {
    twitterUrl.setAttribute('content', seoConfig.canonical + path);
  }
};

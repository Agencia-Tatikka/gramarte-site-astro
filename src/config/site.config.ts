export interface NavItem {
  label: string;
  href: string;
}

export interface SiteConfig {
  name: string;
  tagline: string;
  description: string;
  url: string;
  routes: {
    blogSlug: string;       // Ex: "artigos" ou "noticias" ou "blog"
    catalogSlug: string;    // Ex: "catalogo" ou "produtos" ou "imoveis" ou "tratamentos"
  };
  contact: {
    phone: string;
    whatsapp: string;       // Formato: 5511999999999
    whatsappMessage?: string;
    email: string;
    address: string;
    webhookUrl?: string;    // Endpoint N8N / Make / CRM para formulário
  };
  socials: {
    instagram?: string;
    linkedin?: string;
    facebook?: string;
    youtube?: string;
  };
  tracking: {
    googleAnalyticsId?: string;
    metaPixelId?: string;
    googleTagManagerId?: string;
    microsoftClarityId?: string;
  };
  database: {
    tursoUrl: string;
    tursoToken: string;
  };
  storage: {
    r2PublicUrl: string;
  };
  features: {
    enableBlog: boolean;
    enableCatalog: boolean;
    enableLgpdBanner: boolean;
  };
  navigation: NavItem[];
}

export const siteConfig: SiteConfig = {
  name: "Gramarte",
  tagline: "Paisagismo & Manutenção Especializada de Condomínios",
  description: "Especialistas em manutenção de áreas verdes, jardinagem e revitalização paisagística para condomínios residenciais em São Paulo, Grande ABC e Alphaville.",
  url: "https://gramarte.com.br",
  routes: {
    blogSlug: "artigos",
    catalogSlug: "catalogo"
  },
  contact: {
    phone: "(11) 94046-6849",
    whatsapp: "5511940466849",
    whatsappMessage: "Olá, Luana! Vim pelo site da Gramarte e gostaria de agendar uma visita técnica gratuita para o meu condomínio.",
    email: "contato@gramarte.com.br",
    address: "São Paulo, Grande ABC, Litoral e Interior - SP, Brasil",
    webhookUrl: ""
  },
  socials: {
    instagram: "https://instagram.com/gramarte.jardinagem",
    linkedin: "",
    facebook: ""
  },
  tracking: {
    googleAnalyticsId: "G-E0YX4H0DFL",
    metaPixelId: "",
    googleTagManagerId: "",
    microsoftClarityId: "yfcmgxlvvt"
  },
  database: {
    tursoUrl: "",
    tursoToken: ""
  },
  storage: {
    r2PublicUrl: ""
  },
  features: {
    enableBlog: true,
    enableCatalog: true,
    enableLgpdBanner: true
  },
  navigation: [
    { label: "Início", href: "/" },
    { label: "Sobre Nós", href: "/sobre" },
    { label: "Serviços", href: "/servicos" },
    { label: "Projetos", href: "/catalogo" },
    { label: "Artigos", href: "/artigos" },
    { label: "Contato", href: "/contato" }
  ]
};

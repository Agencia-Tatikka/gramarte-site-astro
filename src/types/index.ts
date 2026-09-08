/**
 * Entidades do Sistema Tatikka Web Ecosystem
 */

export interface Produto {
  id: string;
  nome: string;
  slug: string;
  categoria: string;
  preco?: string;
  resumo?: string;
  descricaoCompleta?: string;
  imagemPrincipal: string;
  galeriaImagens?: string[];
  especificacoes?: Record<string, string>;
  destaque: boolean;
  status: 'ativo' | 'rascunho' | 'esgotado';
  ordem: number;
  criadoEm: string;
  atualizadoEm: string;
}

export interface Post {
  id: string;
  titulo: string;
  slug: string;
  resumo: string;
  conteudoHtml: string;
  categoria: string;
  tags?: string[];
  imagemCapa: string;
  autorNome: string;
  autorCargo?: string;
  tempoLeitura: string;
  visualizacoes: number;
  status: 'publicado' | 'rascunho';
  publicadoEm: string;
  atualizadoEm: string;
}

export interface Lead {
  id: string;
  nome: string;
  whatsapp: string;
  email: string;
  empresa?: string;
  mensagem?: string;
  origemPagina: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  status: 'novo' | 'atendido' | 'fechado' | 'perdido';
  criadoEm: string;
}

export interface ConfigItem {
  chave: string;
  valor: string;
  tipo: 'string' | 'json' | 'boolean';
  atualizadoEm: string;
}

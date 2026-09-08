/**
 * Schema e Queries do Turso Database (libSQL)
 */
import { getDb } from '../config/database.config';
import type { Produto, Post, Lead } from '../types';

export const SCHEMA_SQL = `
CREATE TABLE IF NOT EXISTS produtos (
    id TEXT PRIMARY KEY,
    nome TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    categoria TEXT NOT NULL,
    preco TEXT,
    resumo TEXT,
    descricao_completa TEXT,
    imagem_principal TEXT NOT NULL,
    galeria_imagens TEXT,
    especificacoes TEXT,
    destaque INTEGER DEFAULT 0,
    status TEXT DEFAULT 'ativo',
    ordem INTEGER DEFAULT 0,
    criado_em TEXT NOT NULL,
    atualizado_em TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS posts (
    id TEXT PRIMARY KEY,
    titulo TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    resumo TEXT NOT NULL,
    conteudo_html TEXT NOT NULL,
    categoria TEXT NOT NULL,
    tags TEXT,
    imagem_capa TEXT NOT NULL,
    autor_nome TEXT NOT NULL,
    autor_cargo TEXT,
    tempo_leitura TEXT DEFAULT '3 min',
    visualizacoes INTEGER DEFAULT 0,
    status TEXT DEFAULT 'publicado',
    publicado_em TEXT NOT NULL,
    atualizado_em TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS leads (
    id TEXT PRIMARY KEY,
    nome TEXT NOT NULL,
    whatsapp TEXT NOT NULL,
    email TEXT NOT NULL,
    empresa TEXT,
    mensagem TEXT,
    origem_pagina TEXT NOT NULL,
    utm_source TEXT,
    utm_medium TEXT,
    utm_campaign TEXT,
    status TEXT DEFAULT 'novo',
    criado_em TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS configs (
    chave TEXT PRIMARY KEY,
    valor TEXT NOT NULL,
    tipo TEXT DEFAULT 'string',
    atualizado_em TEXT NOT NULL
);
`;

/**
 * Inicializa as tabelas no Turso se ainda não existirem
 */
export async function initDbSchema(): Promise<void> {
  const db = getDb();
  await db.executeMultiple(SCHEMA_SQL);
}

/**
 * Busca produtos ativos
 */
export async function getProdutos(options?: { destaqueApenas?: boolean; categoria?: string }): Promise<Produto[]> {
  const db = getDb();
  try {
    let sql = `SELECT * FROM produtos WHERE status = 'ativo'`;
    const args: any[] = [];

    if (options?.destaqueApenas) {
      sql += ` AND destaque = 1`;
    }

    if (options?.categoria && options.categoria !== 'todos') {
      sql += ` AND categoria = ?`;
      args.push(options.categoria);
    }

    sql += ` ORDER BY ordem ASC, criado_em DESC`;
    const result = await db.execute({ sql, args });

    return result.rows.map((row: any) => ({
      id: String(row.id),
      nome: String(row.nome),
      slug: String(row.slug),
      categoria: String(row.categoria),
      preco: row.preco ? String(row.preco) : undefined,
      resumo: row.resumo ? String(row.resumo) : undefined,
      descricaoCompleta: row.descricao_completa ? String(row.descricao_completa) : undefined,
      imagemPrincipal: String(row.imagem_principal),
      galeriaImagens: row.galeria_imagens ? JSON.parse(String(row.galeria_imagens)) : [],
      especificacoes: row.especificacoes ? JSON.parse(String(row.especificacoes)) : {},
      destaque: Boolean(row.destaque),
      status: row.status as any,
      ordem: Number(row.ordem || 0),
      criadoEm: String(row.criado_em),
      atualizadoEm: String(row.atualizado_em)
    }));
  } catch (err) {
    console.warn('⚠️ [TursoDB] Aviso ao buscar produtos (usando fallback se offline):', err);
    return [];
  }
}

/**
 * Busca posts publicados
 */
export async function getPosts(options?: { limit?: number; categoria?: string }): Promise<Post[]> {
  const db = getDb();
  try {
    let sql = `SELECT * FROM posts WHERE status = 'publicado'`;
    const args: any[] = [];

    if (options?.categoria && options.categoria !== 'todas') {
      sql += ` AND categoria = ?`;
      args.push(options.categoria);
    }

    sql += ` ORDER BY publicado_em DESC`;
    if (options?.limit) {
      sql += ` LIMIT ?`;
      args.push(options.limit);
    }

    const result = await db.execute({ sql, args });

    return result.rows.map((row: any) => ({
      id: String(row.id),
      titulo: String(row.titulo),
      slug: String(row.slug),
      resumo: String(row.resumo),
      conteudoHtml: String(row.conteudo_html),
      categoria: String(row.categoria),
      tags: row.tags ? String(row.tags).split(',').map(t => t.trim()) : [],
      imagemCapa: String(row.imagem_capa),
      autorNome: String(row.autor_nome),
      autorCargo: row.autor_cargo ? String(row.autor_cargo) : undefined,
      tempoLeitura: String(row.tempo_leitura || '3 min'),
      visualizacoes: Number(row.visualizacoes || 0),
      status: row.status as any,
      publicadoEm: String(row.publicado_em),
      atualizadoEm: String(row.atualizado_em)
    }));
  } catch (err) {
    console.warn('⚠️ [TursoDB] Aviso ao buscar posts (usando fallback se offline):', err);
    return [];
  }
}

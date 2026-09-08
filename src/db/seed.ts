import { createClient } from '@libsql/client';
import * as dotenv from 'dotenv';
dotenv.config();

const url = process.env.TURSO_DATABASE_URL;
const authToken = process.env.TURSO_AUTH_TOKEN;

if (!url || !authToken) {
  console.error('❌ Erro: TURSO_DATABASE_URL ou TURSO_AUTH_TOKEN não configurados no .env');
  process.exit(1);
}

const client = createClient({ url, authToken });

async function seed() {
  console.log('🚀 1. Criando tabelas no Turso...');
  await client.executeMultiple(`
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
  `);
  console.log('✅ Tabelas criadas com sucesso!');

  console.log('🌱 2. Inserindo dados iniciais (Seed)...');

  // Seed Produtos
  await client.execute({
    sql: `INSERT OR REPLACE INTO produtos (id, nome, slug, categoria, preco, resumo, descricao_completa, imagem_principal, destaque, status, ordem, criado_em, atualizado_em)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    args: [
      'prod-01',
      'Assessoria Empresarial Premium',
      'assessoria-empresarial-premium',
      'Consultoria',
      'Sob Consulta',
      'Diagnóstico estratégico, governança e aceleração operacional para empresas em expansão.',
      'Nossa assessoria empresarial abrange revisão tributária, automação de processos, auditoria financeira e alinhamento societário.',
      'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1200&auto=format&fit=crop',
      1,
      'ativo',
      1,
      new Date().toISOString(),
      new Date().toISOString()
    ]
  });

  await client.execute({
    sql: `INSERT OR REPLACE INTO produtos (id, nome, slug, categoria, preco, resumo, descricao_completa, imagem_principal, destaque, status, ordem, criado_em, atualizado_em)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    args: [
      'prod-02',
      'Blindagem Patrimonial & Holding',
      'blindagem-patrimonial-holding',
      'Jurídico',
      'Sob Consulta',
      'Estruturação societária completa para proteção de ativos familiares e sucessão sem atrito.',
      'Redução legal de carga tributária sobre herança e proteção jurídica completa de bens imóveis e participações.',
      'https://images.unsplash.com/photo-1450133064473-71024230f91b?q=80&w=1200&auto=format&fit=crop',
      1,
      'ativo',
      2,
      new Date().toISOString(),
      new Date().toISOString()
    ]
  });

  // Seed Posts
  await client.execute({
    sql: `INSERT OR REPLACE INTO posts (id, titulo, slug, resumo, conteudo_html, categoria, tags, imagem_capa, autor_nome, autor_cargo, tempo_leitura, publicado_em, atualizado_em)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    args: [
      'post-01',
      'Como Reduzir Custos Operacionais sem Comprometer a Qualidade',
      'como-reduzir-custos-operacionais',
      'Estratégias práticas para enxugar despesas invisíveis e aumentar a margem líquida do seu negócio.',
      '<p>Em tempos de alta competitividade, a eficiência operacional é o diferencial que separa empresas lucrativas daquelas que apenas sobrevivem. Neste artigo, apresentamos os 5 pilares fundamentais da gestão inteligente de custos.</p><h2>1. Mapeamento de Gargalos</h2><p>Identificar onde ocorrem retrabalhos é o primeiro passo para eliminar desperdícios.</p>',
      'Gestão',
      'Finanças, Operações, Eficiência',
      'https://images.unsplash.com/photo-1551836022-d5d88e9218df?q=80&w=1200&auto=format&fit=crop',
      'Equipe Estratégica',
      'Especialistas em Gestão',
      '4 min',
      new Date().toISOString(),
      new Date().toISOString()
    ]
  });

  console.log('✅ Seed inicial concluído com sucesso no Turso!');
}

seed().catch(err => {
  console.error('❌ Erro no seed:', err);
  process.exit(1);
});

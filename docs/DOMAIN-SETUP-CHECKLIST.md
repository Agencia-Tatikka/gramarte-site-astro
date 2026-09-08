# Checklist Canônico de Configuração de Domínio & Multi-Tenant
## Tatikka Web Ecosystem 2026 — Protocolo de Homologação em Produção

Este documento define o roteiro obrigatório de auditoria e validação para a publicação de sites de clientes no ecossistema da **Agência Tatikka**. O workflow `/config-domain` executa a verificação automatizada com base nestes itens.

---

### 📋 1. Isolamento de Repositórios & Código-Fonte
- [ ] **1.1 Repositório Local Padronizado:** O código do site em `projects/[cliente-slug]/repositorios/[nome-do-dominio]` contém apenas o front-end público (`/`, `/sobre`, `/servicos`, `/catalogo`, `/artigos`, `/contato`, `/obrigado`, `/privacidade`).
- [ ] **1.2 Repositório Remoto no GitHub:** Repositório criado sob a organização oficial `https://github.com/Agencia-Tatikka/[nome-do-dominio]`.
- [ ] **1.3 Zero Rotas Administrativas:** O repositório público não expõe código de backend nem rotas `/admin`.
- [ ] **1.4 Repositório Central Tatikka:** O painel administrativo reside e roda exclusivamente no repositório central `projects/tatikka-admin-hub` (`app.tatikka.com`).

---

### 🚀 2. Banco de Dados Turso (libSQL Edge)
- [ ] **2.1 Banco Isolado Criado:** O banco `tatikka-db-[cliente-slug]` está provisionado no grupo `tatikka`.
- [ ] **2.2 Token de Acesso:** Token JWT emitido e configurado com segurança no cofre `.agents/security/.env`.
- [ ] **2.3 Tabelas & Migrations:** As 4 tabelas obrigatórias (`produtos`, `posts`, `leads`, `configs`) foram criadas.
- [ ] **2.4 Seed / Dados Iniciais:** O banco contém os primeiros registros de produtos e posts.

---

### ☁️ 3. Roteamento de DNS na Cloudflare
- [ ] **3.1 Zona Ativa:** O domínio `[cliente.com.br]` está configurado com SSL Completo (Strict) e Nuvem Laranja ativa.
- [ ] **3.2 Domínio Principal (`@` e `www`):** Apontados para o Cloudflare Pages do repositório público.
- [ ] **3.3 Subdomínio Admin (CNAME Multi-Tenant):**
  - **Tipo:** `CNAME`
  - **Nome:** `admin` (ex: `admin.[cliente.com.br]`)
  - **Destino:** `app.tatikka.com`
  - **Proxy:** Ativado na Cloudflare.

---

### 🛡️ 4. Segurança Cloudflare Access (Zero Trust)
- [ ] **4.1 Aplicação Cadastrada:** Aplicação do tipo *Self-Hosted* criada no Cloudflare Zero Trust para `admin.[cliente.com.br]`.
- [ ] **4.2 Política de E-mails:** E-mails autorizados da diretoria do cliente cadastrados na regra de **One-Time PIN (código de 6 dígitos)**.
- [ ] **4.3 Bloqueio de Não-Autorizados:** Acesso negado para qualquer e-mail fora da lista autorizada.

---

### 📧 5. E-mails Corporativos & Entregabilidade (SPF / DKIM / MX)
- [ ] **5.1 Identificação do Provedor de E-mail:**
  - *( ) cPanel / ValueServer*
  - *( ) Google Workspace*
  - *( ) Microsoft 365*
  - *( ) Zoho / Titan / Outro*
- [ ] **5.2 Se cPanel:** Chaves DKIM e registros SPF extraídos via SSH (`scripts/lib/cpanel_ssh.py`) e injetados na Cloudflare DNS.
- [ ] **5.3 Se Externo (Google/MS):** Registros MX e TXT SPF/DKIM do provedor externo preservados sem mutação.

---

### 📦 6. Cloudflare R2 Storage & Mídia
- [ ] **6.1 Particionamento de Pastas:** Pasta `tatikka-relay/[cliente-slug]/` criada no bucket central com subpastas `catalogo/`, `blog/` e `uploads/`.
- [ ] **6.2 Permissão Pública de Leitura:** Domínio público do R2 (`https://r2.tatikka.com.br`) servindo imagens WebP sem erros de CORS.

---

### ✉️ 7. E-mails Transacionais com Brevo (Sendinblue v3)
- [ ] **7.1 Chave de API:** Chave da Brevo configurada e autenticada.
- [ ] **7.2 Teste de Formulário:** Envio de formulário de teste em `/contato` dispara notificação por e-mail para a diretoria do cliente e grava o lead no Turso.
- [ ] **7.3 Redirecionamento:** O formulário redireciona o visitante para a página `/obrigado` disparando eventos no Meta Pixel e Google Analytics.

---

### 🔒 8. Rotina de Backups & Governança
- [ ] **8.1 Registro no Backup Noturno:** Banco de dados do cliente incluído na rotina de dump diário do Turso.
- [ ] **8.2 Registro na Memória PARA:** Registro de lançamento e credenciais anotados na Layer 1 (`memory/life/projects/[cliente-slug]/`).

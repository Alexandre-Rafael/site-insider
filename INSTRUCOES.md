# Insider Mídia — Site + Blog

Este projeto é o site institucional + um blog editável por painel visual.

## Estrutura

```
public/             → site atual (HTML estático servido como está)
  index.html        → home
  sobre/, cases/, contato/, solucoes/, parceiros/
  assets/           → imagens, vídeos, logos
  admin/            → painel Decap CMS (acesso em /admin)
  uploads/          → imagens enviadas pelo CMS

src/
  content/blog/     → cada matéria é um arquivo .md
  content/config.ts → schema dos posts (campos, validação)
  layouts/          → template das páginas Astro
  components/       → Header e Footer compartilhados
  pages/blog/       → lista do blog e página de cada matéria

api/                → funções serverless do Vercel (login GitHub do CMS)
```

## Deploy — Passo a passo

### 1. Criar repositório no GitHub
- Crie um repositório novo (público ou privado).
- Faça `git init`, `git add .`, `git commit`, `git remote add`, `git push` apontando pra esse repositório.

### 2. Conectar ao Vercel
- Em vercel.com → "Add New Project" → importe o repositório do GitHub.
- Vercel detecta Astro automaticamente. Pode deixar todas as configurações padrão.
- Clique em "Deploy". Em ~1 minuto o site está no ar.
- **Anote a URL gerada** (ex: `https://insider-midia.vercel.app`).

### 3. Criar GitHub OAuth App (necessário pro painel `/admin`)
- Vá em https://github.com/settings/developers → "OAuth Apps" → "New OAuth App".
- Preencha:
  - **Application name:** `Insider Mídia CMS`
  - **Homepage URL:** `https://SEU_DOMINIO.vercel.app`
  - **Authorization callback URL:** `https://SEU_DOMINIO.vercel.app/api/callback`
- Clique em "Register application".
- Copie o **Client ID** e gere um **Client Secret** (botão "Generate a new client secret").

### 4. Configurar variáveis no Vercel
No painel do Vercel → Settings → Environment Variables, adicione:
- `OAUTH_CLIENT_ID` = (Client ID do passo 3)
- `OAUTH_CLIENT_SECRET` = (Client Secret do passo 3)

Marque "Production", "Preview" e "Development". Salve.

### 5. Ajustar o `config.yml` do CMS
Edite `public/admin/config.yml` e troque os placeholders:
- `repo: SEU_USUARIO/SEU_REPOSITORIO` → seu usuário e nome do repo no GitHub
- `base_url: https://SEU_DOMINIO.vercel.app` → URL do Vercel
- `site_url`, `display_url`, `logo_url` → mesma URL

Faça commit e push. O Vercel redeploya em ~30s.

### 6. Forçar redeploy (pra que o Vercel "veja" as variáveis novas)
No painel do Vercel → Deployments → clique nos `...` do último deploy → "Redeploy".

### 7. Testar o painel
- Acesse `https://SEU_DOMINIO.vercel.app/admin/`
- Clique em "Login with GitHub" → autorize → você cai na lista de matérias.

## Como o gestor publica uma matéria

1. Acessa `https://SEU_DOMINIO.vercel.app/admin/`
2. Login com a conta GitHub dele (precisa estar como colaborador do repo — adicionar em Settings → Collaborators)
3. Clica em "Matérias do Blog" → "New Matéria"
4. Preenche os campos (título, capa, categoria, corpo) e clica em "Save"
5. Publica clicando em "Publish" → "Publish now"
6. Vercel faz redeploy automático. Em ~1 minuto a matéria aparece em `/blog`.

## Categorias

Definidas em dois lugares (precisa atualizar nos dois se mudar):
- `src/content/config.ts` (linha `CATEGORIAS`)
- `public/admin/config.yml` (campo `category` → `options`)

Categorias atuais:
- Cases de Sucesso
- Marketing Digital
- Tráfego Pago
- Branding
- Bastidores

## Rodar local (opcional)

Precisa de Node.js 18+:

```bash
npm install
npm run dev
```

Abre em `http://localhost:4321`.

O painel `/admin` não funciona em local sem rodar um proxy OAuth — teste sempre na Vercel.

## Domínio próprio (depois)

No Vercel → Settings → Domains → adiciona o domínio.
Aponta o DNS conforme as instruções (CNAME ou A record).
Atualiza o `config.yml` e a OAuth App do GitHub com o novo domínio.

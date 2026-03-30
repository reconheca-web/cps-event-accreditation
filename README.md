# CPS Event Accreditation

**Sistema de Credenciamento de Eventos — Centro Paula Souza**

> **Propriedade:** Agência Reconheça — web.sys@agenciareconheca.com.br

Plataforma web progressiva (PWA) para gerenciamento completo do credenciamento de participantes em eventos institucionais do Centro Paula Souza. Desenvolvido para o **Encontro de Gestores CPS 2025**.

---

## Visão Geral

O sistema cobre todo o ciclo de credenciamento de um evento presencial:

1. **Inscrição pública** — formulário de cadastro com validação em tempo real, seleção de unidade (ETEC/FATEC) e aceite de termos.
2. **Painel administrativo** — aprovação/rejeição de inscrições, busca, filtros por status, edição inline e reenvio de QR Code via WhatsApp.
3. **Check-in por QR Code** — leitura de QR Code pela câmera do dispositivo para registro de presença no local do evento.
4. **Dashboard de acompanhamento** — indicadores em tempo real: total de inscritos, aprovados, rejeitados e check-ins realizados.
5. **Informações do evento** — página pública com detalhes do evento, localização, estacionamento, restaurantes, farmácias e shoppings próximos com links para Google Maps e Waze.
6. **Exportação de dados** — download de relatórios em CSV e Excel (XLSX).

---

## Tecnologias

| Camada | Tecnologia |
|---|---|
| **Framework** | React 18 + TypeScript |
| **Build** | Vite 5 (SWC) |
| **Estilização** | Tailwind CSS 3 + shadcn/ui (Radix UI) |
| **Estado & Cache** | TanStack React Query |
| **Formulários** | React Hook Form + Zod |
| **Backend** | Supabase (PostgreSQL + Auth + REST API) |
| **QR Code** | html5-qrcode |
| **Planilhas** | SheetJS (xlsx) |
| **Gráficos** | Recharts |
| **PWA** | vite-plugin-pwa (offline-first, instalável) |
| **Roteamento** | React Router DOM v6 |

---

## Estrutura do Projeto

```
src/
├── components/         # Componentes reutilizáveis (Header, Footer, QRCodeScanner, RegisterForm...)
│   └── ui/             # Componentes base shadcn/ui
├── data/               # Dados estáticos (listas de unidades ETEC/FATEC)
├── hooks/              # Custom hooks (useMutations, use-mobile, use-toast)
├── lib/                # Clientes e configurações (Supabase, React Query, PWA)
├── pages/              # Páginas da aplicação
│   ├── Index.tsx       # Landing page + formulário de inscrição
│   ├── Login.tsx       # Autenticação administrativa
│   ├── Admin.tsx       # Painel de gestão de inscrições
│   ├── ScannerPage.tsx # Leitor de QR Code para check-in
│   ├── Dashboard.tsx   # Dashboard de acompanhamento
│   └── InfoEvento.tsx  # Informações úteis do evento
├── types/              # Tipagens TypeScript (Supabase, inscrições)
├── utils/              # Utilitários de validação
└── App.tsx             # Rotas e layout principal
```

---

## Pré-requisitos

- **Node.js** 18+ e **npm** 9+
- Conta no **Supabase** com o projeto configurado

---

## Configuração

1. **Clone o repositório**

```bash
git clone https://github.com/sua-org/cps-event-accreditation.git
cd cps-event-accreditation
```

2. **Instale as dependências**

```bash
npm install
```

3. **Configure as variáveis de ambiente**

Crie um arquivo `.env` na raiz do projeto a partir do exemplo:

```bash
cp .env.example .env
```

Preencha com as credenciais do seu projeto Supabase:

```
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua-anon-key
```

4. **Inicie o servidor de desenvolvimento**

```bash
npm run dev
```

A aplicação estará disponível em `http://localhost:5173`.

---

## Scripts Disponíveis

| Comando | Descrição |
|---|---|
| `npm run dev` | Inicia o servidor de desenvolvimento |
| `npm run build` | Gera o build de produção |
| `npm run build:dev` | Gera o build em modo desenvolvimento |
| `npm run preview` | Pré-visualiza o build de produção |
| `npm run lint` | Executa o linter (ESLint) |

---

## Rotas da Aplicação

| Rota | Acesso | Descrição |
|---|---|---|
| `/` | Público | Landing page com formulário de inscrição |
| `/info-evento` | Público | Informações do evento e arredores |
| `/login` | Público | Login administrativo |
| `/admin` | Autenticado | Gestão de inscrições e exportações |
| `/scanner` | Autenticado | Leitor de QR Code para check-in |
| `/dashboard` | Público | Dashboard de acompanhamento em tempo real |

---

## Banco de Dados

O sistema utiliza o **Supabase** como backend, com a tabela principal `inscricoes_evento_cps` contendo:

- Dados pessoais (nome, e-mail, telefone)
- Vínculo institucional (tipo e nome da unidade, cargo)
- Controle de fluxo (status da inscrição, check-in, envio de QR Code)
- Flags administrativas (bloqueio por IA, reenvio de QR Code)

A autenticação administrativa é feita via **Supabase Auth** (e-mail e senha).

---

## PWA (Progressive Web App)

A aplicação é instalável em dispositivos móveis e desktops, com suporte a:

- Cache de assets e fontes para uso offline
- Página de fallback offline (`offline.html`)
- Atualização automática com notificação ao usuário

---

## Deploy

O build de produção gera arquivos estáticos otimizados na pasta `dist/`, compatíveis com qualquer serviço de hospedagem (Vercel, Netlify, Cloudflare Pages, etc.):

```bash
npm run build
```

---

## Licença

Este projeto é proprietário e de uso restrito. Todos os direitos reservados.

---

<p align="center">
  Desenvolvido com dedicação por <strong>Agência Reconheça</strong><br>
  CNPJ: 13.520.672/0001-70<br>
  web.sys@agenciareconheca.com.br<br><br>
  <a href="https://www.reconhecasaopaulo.com.br/">reconhecasaopaulo.com.br</a>
</p>

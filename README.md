# ONGConnect

<div align="center">

![ONGConnect Logo](public/logo.png)

Conectando ONGs e voluntários para um impacto social maior.

[![Next.js](https://img.shields.io/badge/Next.js-13-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)
[![Ant Design](https://img.shields.io/badge/Ant%20Design-5-blue)](https://ant.design/)
[![License](https://img.shields.io/badge/license-MIT-green)](LICENSE)

</div>

## 📋 Índice

- [Sobre](#-sobre)
- [Funcionalidades](#-funcionalidades)
- [Tecnologias](#-tecnologias)
- [Começando](#-começando)
  - [Pré-requisitos](#pré-requisitos)
  - [Instalação](#instalação)
  - [Configuração](#configuração)
- [Arquitetura](#-arquitetura)
- [Documentação](#-documentação)
- [Contribuindo](#-contribuindo)
- [Licença](#-licença)

## 🎯 Sobre

O ONGConnect é uma plataforma que visa facilitar a conexão entre ONGs e pessoas interessadas em voluntariado. Nosso objetivo é criar um ambiente onde ações sociais possam ser facilmente organizadas e divulgadas, permitindo que mais pessoas se envolvam em causas importantes.

## ✨ Funcionalidades

### Para ONGs

- 📝 Cadastro e gestão de perfil
- 📅 Criação e gerenciamento de eventos
- 👥 Gestão de voluntários (Ongoing)
- 📊 Dashboard com métricas (Ongoing)
- 📸 Upload de imagens

### Para Voluntários

- 🔍 Busca de ações sociais
- 📱 Inscrição simplificada
- 🗂️ Histórico de participações
- ⭐ Favoritos e recomendações (Ongoing)
- 📞 Contato direto com ONGs (Ongoing)

## 🚀 Tecnologias

### Frontend

- **Next.js 13** - Framework React com SSR
- **TypeScript** - Tipagem estática
- **Ant Design** - Sistema de design
- **NextAuth.js** - Autenticação
- **React Query** - Gerenciamento de estado
- **Axios** - Cliente HTTP

### Backend

- **NestJS** - Framework Node.js
- **Prisma** - ORM
- **PostgreSQL** - Banco de dados
- **JWT** - Autenticação
- **Jest** - Testes

## 🏁 Começando

### Pré-requisitos

- Node.js 18+
- npm ou yarn
- Git
- PostgreSQL 14+
- Docker (opcional)

### Instalação

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/ong-connect.git

# Instale as dependências do frontend
cd ong-connect-frontend
npm install

# Configure o frontend
cp .env.example .env

# Configure o backend
cd backend
npm install

# Configure o backend
cp .env.example .env

# Execute as migrations do Prisma
npx prisma migrate dev

# Em um terminal, inicie o backend
npm run start:dev

# Em outro terminal, volte para o frontend e inicie-o
cd ..
npm run dev
```

### Configuração

#### Frontend (`/`)

1. Crie um arquivo `.env` baseado no `.env.example`
2. Configure as variáveis:

```env
API_URL='http://localhost:3000'
```

#### Backend (`/backend`)

1. Crie um arquivo `.env` baseado no `.env.example`
2. Configure as variáveis:

```env
PORT=3000
JWT_SECRET='sua-chave-secreta'
AWS_ACCESS_KEY_ID=seu-id-de-acesso-da-aws
AWS_SECRET_ACCESS_KEY=sua-chave-de-acesso-da-aws
AWS_REGION=sua-regiao-da-aws
AWS_BUCKET_NAME=ong-connect
```

## 🏗 Arquitetura

```
ong-connect/
├── src/                # Frontend
│   ├── components/     # Componentes reutilizáveis
│   ├── contexts/      # Contextos React
│   ├── hooks/         # Hooks personalizados
│   ├── pages/         # Rotas Next.js
│   ├── services/      # Serviços e API
│   ├── styles/        # Estilos globais
│   ├── types/         # Tipagens TypeScript
│   └── utils/         # Funções utilitárias
│
├── backend/           # Backend
│   ├── src/
│   │   ├── auth/     # Autenticação
│   │   ├── events/   # Módulo de eventos
│   │   ├── users/    # Módulo de usuários
│   │   └── common/   # Código compartilhado
│   │
│   ├── prisma/       # Configuração do banco
│   └── test/         # Testes

```

## 📚 Documentação

Para mais detalhes sobre a implementação, consulte nossa [Wiki](wiki-link) que contém:

- Guia de Estilo
- Padrões de Código
- Fluxo de Trabalho
- Documentação da API

## 🤝 Contribuindo

1. Faça um Fork
2. Crie sua Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a Branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## TODO

* [ ] Adicionar cobertura de testes
* [ ] Adicionar documentação de API
* [ ] Adicionar documentação de arquitetura
* [ ] Adicionar funcionalidade de recuperação de senha]
* [ ] Adicionar funcionalidade de listar voluntários por evento (ONG)
* [ ] Usar coordenadas para localização de eventos
* [ ] Adicionar funcionalidade de favoritar eventos
* [ ] Adicionar funcionalidade de listar eventos próximos

### Padrões de Commits

- `feat`: Nova funcionalidade
- `fix`: Correção de bug
- `docs`: Documentação
- `style`: Formatação
- `refactor`: Refatoração
- `test`: Testes
- `chore`: Tarefas de build

<br/>
<br/>

<div align="center">

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

</div>

---

<div align="center">

Feito com ❤️ pela equipe ONGConnect

</div>
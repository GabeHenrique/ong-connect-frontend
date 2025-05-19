# ONGConnect

<div align="center">

![ONGConnect Logo](public/logo.png)

Conectando ONGs e voluntários para um impacto social maior.

[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-15-black)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-darkblue)](https://react.dev/)
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

- **Next.js 15** - Framework React com SSR
- **TypeScript** - Tipagem estática
- **Ant Design** - Sistema de design
- **NextAuth.js** - Autenticação

## 🏁 Começando

### Pré-requisitos

- Node.js 18+
- yarn (Baixe em [yarnpkg.com](https://yarnpkg.com/))
- Git

### Instalação

```bash
# Clone o repositório
git clone https://github.com/GabeHenrique/ong-connect-frontend

# Entre no diretório
cd ong-connect-frontend

# Instale as dependências
yarn install

# Configure os ambientes
cp .env.example .env

# Inicie o projeto em desenvolvimento
yarn dev
```

### Configuração

1. Crie um arquivo `.env` baseado no `.env.example`
2. Configure as variáveis:

```env
API_URL='http://localhost:3000'
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
* [X] Adicionar documentação de API
* [X] Adicionar documentação de arquitetura
* [X] Adicionar funcionalidade de recuperação de senha
* [X] Adicionar funcionalidade de listar voluntários por evento (ONG)
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

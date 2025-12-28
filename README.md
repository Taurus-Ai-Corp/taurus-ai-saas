<!-- TAURUS AI Badges -->
[![GitHub Sponsors](https://img.shields.io/github/sponsors/Taurus-Ai-Corp?style=flat-square&logo=github&color=EA4AAA)](https://github.com/sponsors/Taurus-Ai-Corp)
[![License](https://img.shields.io/badge/License-MIT-blue?style=flat-square)](LICENSE)
[![Website](https://img.shields.io/badge/Website-taurusai.io-green?style=flat-square)](https://taurusai.io)
[![TypeScript](https://img.shields.io/badge/TypeScript-91%25-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
<!-- /TAURUS AI Badges -->

# Taurus AI SAAS

> Full-stack AI platform powered by OpenCode AI SDK with Hedera blockchain integration

[![Stars](https://img.shields.io/github/stars/Taurus-Ai-Corp/taurus-ai-saas?style=social)](https://github.com/Taurus-Ai-Corp/taurus-ai-saas)

## Features

- **AI Chat** - Interactive conversations with Claude via OpenCode SDK
- **Session Management** - Persistent chat sessions with context preservation
- **Hedera Blockchain** - 17 MCP tools for accounts, tokens, contracts, consensus
- **Multi-Platform** - Web app, API server, and CLI
- **Real-time Streaming** - SSE-based message streaming

## Architecture

```
taurus-ai-saas/
├── packages/
│   ├── core/           # Shared SDK wrapper & Hedera MCP bridge
│   ├── mcp-servers/    # Hedera blockchain MCP server
│   ├── api/            # Fastify backend (sessions, SSE, auth)
│   ├── web/            # Next.js 15 chat interface
│   └── cli/            # Command-line interface
├── docker-compose.yml  # Container deployment
└── opencode.json       # MCP server configuration
```

## Quick Start

### Prerequisites

- Node.js 20+
- npm or pnpm

### Installation

```bash
# Clone the repository
git clone https://github.com/Taurus-Ai-Corp/taurus-ai-saas.git
cd taurus-ai-saas

# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit .env with your API keys
```

### Environment Variables

```env
ANTHROPIC_API_KEY=sk-ant-...
HEDERA_NETWORK=testnet
HEDERA_OPERATOR_ID=0.0.xxxxx
HEDERA_OPERATOR_KEY=302e...
```

### Running the Platform

```bash
# Start API server (port 3001)
cd packages/api && npm run dev

# Start Web app (port 3000)
cd packages/web && npm run dev

# Use CLI
cd packages/cli && npm run dev -- chat
```

## Hedera MCP Tools

17 blockchain tools available:

| Category | Tools |
|----------|-------|
| **Accounts** | Balance queries, account creation |
| **Tokens** | Fungible token creation, transfers, minting |
| **Smart Contracts** | Deployment, execution, state queries |
| **Consensus** | HCS topic creation and messaging |
| **Files** | Network file operations |

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/session` | POST | Create new chat session |
| `/api/session/:id/prompt` | POST | Send message |
| `/api/session/:id/events` | GET | SSE stream |

## Tech Stack

- **Frontend**: Next.js 15, React 19, Zustand
- **Backend**: Fastify, SSE
- **Blockchain**: Hedera Hashgraph SDK
- **AI**: Claude via OpenCode SDK
- **Infrastructure**: Docker, pnpm workspaces

---

## 💖 Support This Project

If you find this project useful, please consider sponsoring:

[![Sponsor TAURUS AI](https://img.shields.io/badge/Sponsor-TAURUS%20AI-EA4AAA?style=for-the-badge&logo=github-sponsors)](https://github.com/sponsors/Taurus-Ai-Corp)

| Tier | Benefits |
|------|----------|
| 🌟 Supporter ($5/mo) | Name in SPONSORS.md |
| 🥉 Bronze ($100/mo) | Logo + Priority support |
| 🥇 Gold ($2,000/mo) | Feature priority + Dedicated support |

[View all sponsorship tiers →](https://github.com/Taurus-Ai-Corp/.github/blob/main/SPONSORS.md)

---

## License

MIT License - see [LICENSE](LICENSE) for details.

---

**TAURUS AI Corp** | [Website](https://taurusai.io) | [GitHub](https://github.com/Taurus-Ai-Corp) | [Contact](mailto:admin@taurusai.io)

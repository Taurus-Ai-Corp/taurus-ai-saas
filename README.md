# Taurus AI SAAS

A full-stack AI platform powered by OpenCode AI SDK with Hedera blockchain integration.

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

## Features

- **AI Chat** - Interactive conversations with Claude via OpenCode SDK
- **Session Management** - Persistent chat sessions with context preservation
- **Hedera Blockchain** - 17 MCP tools for accounts, tokens, contracts, consensus
- **Multi-Platform** - Web app, API server, and CLI
- **Real-time Streaming** - SSE-based message streaming

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

## Packages

### @taurus-ai/core

Shared SDK wrapper with Hedera MCP server bridge.

```typescript
import { HederaMCPServer } from '@taurus-ai/core';

const server = new HederaMCPServer({
  network: 'testnet',
  operatorId: '0.0.xxxxx',
  operatorKey: '302e...'
});
```

### @taurus-ai/api

Fastify backend with session management and SSE streaming.

**Endpoints:**
| Method | Path | Description |
|--------|------|-------------|
| GET | `/health` | Health check |
| GET | `/api/session` | List sessions |
| POST | `/api/session` | Create session |
| GET | `/api/session/:id` | Get session |
| DELETE | `/api/session/:id` | Delete session |
| POST | `/api/session/:id/prompt` | Send message |
| GET | `/api/session/:id/events` | SSE stream |

### @taurus-ai/web

Next.js 15 chat interface with React 19 and Zustand state management.

- Real-time chat with streaming responses
- Session sidebar with history
- Dark mode UI

### @taurus-ai/cli

Command-line interface for terminal-based chat.

```bash
# Interactive chat
taurus chat

# Resume session
taurus chat --session <id>

# Quick prompt
taurus ask "What is 2+2?"

# Session management
taurus session list
taurus session show --id <id>
taurus session delete --id <id>

# Configuration
taurus config show
taurus config set --key apiUrl --value http://localhost:3001
```

## Hedera MCP Tools

The platform includes 17 blockchain tools via MCP:

**Account Operations**
- `hedera_get_account_balance` - Get HBAR balance
- `hedera_get_account_info` - Get account details
- `hedera_create_account` - Create new account

**Token Operations**
- `hedera_create_token` - Create fungible token
- `hedera_get_token_info` - Get token details
- `hedera_transfer_token` - Transfer tokens
- `hedera_associate_token` - Associate token with account
- `hedera_mint_token` - Mint additional tokens

**Smart Contracts**
- `hedera_deploy_contract` - Deploy smart contract
- `hedera_call_contract` - Execute contract function
- `hedera_query_contract` - Query contract state

**Consensus Service**
- `hedera_create_topic` - Create HCS topic
- `hedera_submit_message` - Submit message to topic
- `hedera_get_topic_info` - Get topic details
- `hedera_get_topic_messages` - Get topic messages

**File Service**
- `hedera_create_file` - Create file on network
- `hedera_get_file_contents` - Read file contents

## Docker Deployment

```bash
# Build and run
docker-compose up -d

# View logs
docker-compose logs -f
```

## Development

```bash
# Type checking
npm run typecheck

# Build all packages
npm run build

# Run tests
npm test
```

## License

MIT

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

---

Built by [Taurus AI Corp](https://github.com/Taurus-Ai-Corp)

# AGENTS.md - Coding Guidelines for Taurus AI SAAS

## Build/Lint/Test Commands
- `npm run build` - Build all packages (monorepo via npm workspaces)
- `npm run build --workspace=packages/api` - Build specific package (api/web/core/cli/mcp-servers)
- `npm run dev` - Run all packages in dev mode | `npm run dev --workspace=packages/web` for single package
- `npm run typecheck` - Type-check all packages | `npm run typecheck --workspace=packages/core` for single
- `npm run lint --workspace=packages/web` - Lint web package (Next.js only, no other packages have lint)
- No test framework configured - create tests with Vitest/Jest as `*.test.ts` or `*.spec.ts` files

## Code Style Guidelines
- **TypeScript**: Strict mode enabled, ES2022 target, ESNext modules with `.js` extensions in imports
- **File Headers**: JSDoc comments with description (`/** * Component/Module Description */`)
- **Naming**: camelCase variables/functions, PascalCase types/interfaces/classes/React components
- **Exports**: Named exports preferred, barrel files (`index.ts`) for public APIs, avoid default exports
- **Import Order**: 1) 'dotenv/config' 2) external packages 3) @taurus-ai/* 4) relative paths (./)
- **React**: Functional components, hooks, `'use client'` directive for client components, clsx for classes
- **Types**: Explicit interfaces over types, avoid `any`, use `unknown` when type is uncertain
- **Error Handling**: try/catch with proper logging via fastify.log or console.error, process.exit(1) for fatal

## Cursor/ByteRover Rules (.cursor/rules/byterover-rules.mdc)
- MUST use `byterover-store-knowledge` when learning patterns/solutions/completing tasks
- MUST use `byterover-retrieve-knowledge` before starting tasks to gather context
- Check existing patterns before implementing new functionality to maintain consistency
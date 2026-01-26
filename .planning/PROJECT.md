# Project: OpenWork Integration for TAURUS AI

**Created:** 2026-01-26
**Status:** Active

## Core Value

Transform TAURUS AI's agentic capabilities into a polished, accessible desktop experience using OpenWork, starting with InvestorBot WhatsApp integration and expanding to the full ecosystem.

## What We're Building

Integration of [OpenWork](https://github.com/different-ai/openwork) (open-source Claude Cowork alternative) with TAURUS AI ecosystem to provide:

1. **Desktop GUI** - Tauri-based native app wrapping TAURUS AI agents
2. **WhatsApp Bridge** - Owpenbot integration with InvestorBot for investor/client communication
3. **Skill System** - Installable TAURUS AI capabilities as OpenWork skills
4. **Permission Controls** - Granular approval workflows for financial operations

## Starting Point: InvestorBot

Begin with InvestorBot integration because:
- Already WhatsApp-focused (natural fit with Owpenbot)
- Existing automation workflows ready for desktop GUI
- Clear use case: investor communication and collection automation

## Expansion Path

1. **InvestorBot** → WhatsApp bridge + desktop GUI
2. **LendGrid MSME** → Loan processing workflows
3. **GRIDERA Quantum** → Compliance and security agents
4. **Full Ecosystem** → All products unified in OpenWork

## Technical Context

**OpenWork Stack:**
- Tauri (Rust) + React + TypeScript
- pnpm monorepo
- @opencode-ai/sdk integration
- MIT License

**TAURUS AI Stack:**
- Next.js 14+, React, FastAPI
- Hedera Hashgraph integration
- WhatsApp automation (existing)
- Quantum cryptography (ML-DSA/ML-KEM)

## Constraints

- Must maintain existing TAURUS AI functionality
- WhatsApp bridge should work with current InvestorBot
- Desktop app must run locally (privacy-first)
- Skills must be installable/removable

## Key Decisions

| Date | Decision | Rationale |
|------|----------|-----------|
| 2026-01-26 | Start with InvestorBot | Natural WhatsApp-to-Owpenbot fit |
| 2026-01-26 | Use OpenWork as-is first | Fork later if needed |
| 2026-01-26 | Incremental integration | Minimal viable integration, then expand |

## Success Criteria

- [ ] InvestorBot accessible via OpenWork desktop GUI
- [ ] WhatsApp messages routable through Owpenbot bridge
- [ ] TAURUS AI skills installable in OpenWork
- [ ] Permission controls for financial operations
- [ ] Path to full ecosystem integration clear

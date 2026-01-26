# Roadmap: OpenWork Integration for TAURUS AI

## Overview

Integrate OpenWork (open-source desktop GUI for agentic AI) with TAURUS AI ecosystem, starting with InvestorBot WhatsApp integration. The integration follows a minimal-first approach: establish foundation, connect existing components, then expand to full ecosystem.

## Domain Expertise

- ~/.claude/skills/expertise/with-agent-sdk (agentic development)

## Project Structure Note

This integration will create a dedicated `OPENWORK-INTEGRATION/` directory within the TAURUS AI SAAS ecosystem, designed to:
- Efficiently connect with existing directories (InvestorBot, GRIDERA, etc.)
- Enable future expansion to all ecosystem products
- Maintain clean separation while sharing common utilities

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

- [ ] **Phase 1: Foundation Setup** - Clone OpenWork, establish project structure, configure development environment
- [ ] **Phase 2: Owpenbot Bridge** - Connect Owpenbot WhatsApp bridge with existing InvestorBot
- [ ] **Phase 3: InvestorBot Skills** - Create OpenWork skills for InvestorBot capabilities
- [ ] **Phase 4: Desktop GUI Integration** - Configure Tauri app to surface InvestorBot workflows
- [ ] **Phase 5: Testing & Permissions** - End-to-end testing, permission controls for financial operations
- [ ] **Phase 6: Ecosystem Expansion** - Prepare integration paths for LendGrid, GRIDERA, and other products

## Phase Details

### Phase 1: Foundation Setup
**Goal**: Establish OpenWork development environment and create integration project structure
**Depends on**: Nothing (first phase)
**Research**: Likely (new external project setup)
**Research topics**: OpenWork repo structure, Tauri prerequisites, pnpm workspace configuration
**Plans**: TBD

Key activities:
- Clone OpenWork repository
- Create `OPENWORK-INTEGRATION/` directory in TAURUS ecosystem
- Install dependencies (Node.js, pnpm, Rust, Tauri CLI)
- Verify OpenWork builds and runs locally
- Map connection points to existing TAURUS directories

### Phase 2: Owpenbot Bridge
**Goal**: Connect Owpenbot WhatsApp bridge with existing InvestorBot WhatsApp automation
**Depends on**: Phase 1
**Research**: Likely (external WhatsApp bridge integration)
**Research topics**: Owpenbot API, current InvestorBot WhatsApp implementation, message routing
**Plans**: TBD

Key activities:
- Install and configure Owpenbot
- Map InvestorBot WhatsApp handlers to Owpenbot
- Establish message routing between systems
- Test bidirectional communication

### Phase 3: InvestorBot Skills
**Goal**: Package InvestorBot capabilities as installable OpenWork skills
**Depends on**: Phase 2
**Research**: Likely (OpenWork skill system)
**Research topics**: OpenWork skill format, `.opencode/skills` structure, skill installation flow
**Plans**: TBD

Key activities:
- Define skill manifest for InvestorBot
- Package collection automation as skill
- Package investor communication as skill
- Package EMI reminders as skill
- Test skill installation/removal

### Phase 4: Desktop GUI Integration
**Goal**: Surface InvestorBot workflows in OpenWork desktop application
**Depends on**: Phase 3
**Research**: Unlikely (using established OpenWork patterns)
**Plans**: TBD

Key activities:
- Configure session management for InvestorBot
- Implement real-time progress tracking
- Add permission controls for financial operations
- Create template workflows for common tasks

### Phase 5: Testing & Permissions
**Goal**: End-to-end testing and granular permission controls
**Depends on**: Phase 4
**Research**: Unlikely (internal testing patterns)
**Plans**: TBD

Key activities:
- E2E tests for WhatsApp message flow
- E2E tests for skill execution
- Permission approval workflows for payments
- Security audit of financial operations
- User acceptance testing

### Phase 6: Ecosystem Expansion
**Goal**: Prepare integration architecture for remaining TAURUS products
**Depends on**: Phase 5
**Research**: Likely (architecture planning for scale)
**Research topics**: Multi-product skill architecture, shared utilities, connection patterns
**Plans**: TBD

Key activities:
- Document integration patterns from InvestorBot
- Create skill templates for other products
- Map LendGrid integration points
- Map GRIDERA Quantum integration points
- Design shared utility layer
- Create expansion roadmap

## Ecosystem Connection Map

```
TAURUS AI SAAS ECOSYSTEM/
├── 04-INVESTORBOT/          ← Phase 2-4 primary integration
├── 02-GRIDERA-QUANTUM/      ← Phase 6 expansion
├── 03-INDIGENOUS-PAYMENTS/  ← Phase 6 expansion
├── 01-ASSETGRID-PRIME/      ← Phase 6 expansion
├── 05-REGGUARD/             ← Phase 6 expansion
├── 06-GRID-Pay/             ← Phase 6 expansion
└── OPENWORK-INTEGRATION/    ← NEW: Integration layer
    ├── skills/              ← TAURUS AI skills for OpenWork
    ├── bridge/              ← Owpenbot connection layer
    ├── config/              ← Shared configuration
    └── docs/                ← Integration documentation
```

## Progress

**Execution Order:**
Phases execute in numeric order: 1 → 2 → 3 → 4 → 5 → 6

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Foundation Setup | 0/TBD | Not started | - |
| 2. Owpenbot Bridge | 0/TBD | Not started | - |
| 3. InvestorBot Skills | 0/TBD | Not started | - |
| 4. Desktop GUI Integration | 0/TBD | Not started | - |
| 5. Testing & Permissions | 0/TBD | Not started | - |
| 6. Ecosystem Expansion | 0/TBD | Not started | - |

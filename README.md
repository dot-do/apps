# apps.do - Application Definitions

Application definitions and metadata in MDX format, synced bidirectionally with PostgreSQL database.

## Overview

The **apps repository** stores application definitions as MDX files that automatically sync to the database via GitHub webhooks.

## Quick Start

```bash
# Install dependencies
pnpm install

# Build and validate all MDX files
pnpm build

# Watch mode for development
pnpm dev
```

## Creating an Application

1. Navigate to the `apps/` directory
2. Create a new `.mdx` file with kebab-case name
3. Add frontmatter with required fields:

```mdx
---
title: My App
description: A brief description of the app
platform: web
url: https://myapp.com
type: SaaS
techStack:
  - React
  - TypeScript
  - Node.js
features:
  - User authentication
  - Real-time updates
  - API integration
metadata:
  ns: app
  visibility: public
tags:
  - productivity
  - collaboration
---

# My App

Detailed description of the application...
```

4. Build to validate: `pnpm build`
5. Commit and push - changes automatically sync to database

## Bidirectional Sync

### GitHub → Database (Automatic)
When you push MDX files, a webhook automatically syncs them to the PostgreSQL `things` table.

### Database → GitHub (PR)
When the database is updated directly, a GitHub App creates a pull request with the changes for review.

## Repository Structure

```
apps/
├── apps/           # Application MDX files
├── .velite/        # Generated (gitignored)
├── velite.config.ts
├── package.json
└── CLAUDE.md       # Full documentation
```

## License

MIT

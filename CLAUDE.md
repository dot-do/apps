# CLAUDE.md - apps Repository

## Project Overview

The **apps repository** (apps.do) stores **application definitions and metadata** as MDX files with Zod schema validation via Velite, enabling bidirectional synchronization with the PostgreSQL database.

**Purpose**: Define and manage application entities as version-controlled MDX files that sync automatically to the database.

**Position**: 📝 **Content Layer** - Content source that syncs to db layer

## Architecture

### Content as Code

MDX files in this repository are treated as the canonical source for application definitions. Changes to these files automatically sync to the database via GitHub webhooks.

### Bidirectional Sync

```
GitHub (MDX) ←→ Database (PostgreSQL)

Commit to apps repo → Webhook → Parse MDX → Validate → Upsert to DB
Database change → Queue job → Generate MDX → Create PR → Review → Merge
```

## Directory Structure

```
apps/
├── apps/
│   ├── example-app.mdx
│   └── [app-name].mdx
├── .velite/              # Generated (gitignored)
├── velite.config.ts      # Velite configuration
├── package.json
├── tsconfig.json
├── .gitignore
├── README.md
└── CLAUDE.md            # This file
```

## Development Commands

### Prerequisites

```bash
# Install dependencies
pnpm install
```

### Build & Validate

```bash
# Build and validate all MDX files
pnpm build

# Watch mode for development
pnpm dev

# Type check
pnpm check-types
```

### Working with MDX Files

#### Create New Application

1. Create a new `.mdx` file in `apps/` with kebab-case name
2. Add frontmatter with required fields
3. Write content in Markdown
4. Build to validate: `pnpm build`
5. Commit and push to trigger database sync

#### Example: Create New App

```bash
# Create file
touch apps/task-manager.mdx
```

```mdx
---
title: Task Manager
description: A collaborative task management application
platform: web
url: https://tasks.example.com
type: SaaS
techStack:
  - React
  - TypeScript
  - PostgreSQL
  - Cloudflare Workers
features:
  - Real-time collaboration
  - Task assignments
  - Due dates and reminders
  - Team workspaces
metadata:
  ns: app
  visibility: public
tags:
  - productivity
  - collaboration
  - project-management
---

# Task Manager

A modern, collaborative task management application built for teams.

## Features

### Real-time Collaboration
Work together with your team in real-time with instant updates.

### Task Organization
Organize tasks into projects, set priorities, and track progress.

### Team Workspaces
Create dedicated workspaces for different teams and projects.
```

Build and validate:
```bash
pnpm build
```

Commit:
```bash
git add apps/task-manager.mdx
git commit -m "Add task manager application"
git push
```

The webhook will automatically sync this to the database.

## Schema Validation

The Velite schema for applications is defined in `velite.config.ts`:

### Required Fields
- **title** (string): Application name
- **description** (string): Brief description

### Optional Fields
- **platform** (enum): 'web' | 'mobile' | 'desktop' | 'cli' | 'api'
- **url** (string): Application URL
- **type** (string): Application type (e.g., 'SaaS', 'marketplace')
- **techStack** (array): Technologies used
- **features** (array): Key features
- **metadata**: Namespace and visibility settings
- **tags** (array): Tags for categorization

### Auto-Generated Fields
- **slug**: URL-friendly identifier (from filename)

## Database Sync Process

### MDX → Database (Automatic)

When you commit an MDX file:

1. **GitHub Webhook** fires on push event
2. **API Webhook Handler** receives event (`/api/webhooks/github`)
3. **Signature Validation** verifies HMAC-SHA256 signature
4. **Parse MDX** extracts frontmatter and content
5. **Validate** checks against Zod schema
6. **Upsert** to `things` table in database:
   ```typescript
   {
     ns: 'app',
     id: slug,              // e.g., 'task-manager'
     type: 'App',
     content: mdxContent,   // Markdown content
     data: frontmatter,     // Full frontmatter as JSON
     visibility: metadata.visibility
   }
   ```
7. **Generate Embedding** for semantic search
8. **Log** sync status and errors

### Database → MDX (Pull Request)

When database is updated directly:

1. **Database Trigger** detects change
2. **Queue Job** for sync processing
3. **Generate MDX** from database record
4. **Create Branch** in apps repo (`sync/app/[id]/[timestamp]`)
5. **Commit File** to new branch
6. **Create PR** with details and diff
7. **Human Review** and merge

## File Naming Conventions

- **Kebab-case**: `task-manager.mdx`, `project-tracker.mdx`
- **Descriptive**: Name should indicate the application
- **Unique**: Each file name must be unique
- **No Spaces**: Use hyphens instead

## Code Standards

### MDX Files

```mdx
---
# Frontmatter: YAML format
title: Application Name
description: Brief description
platform: web
url: https://example.com
type: SaaS
techStack:
  - Technology 1
  - Technology 2
features:
  - Feature 1
  - Feature 2
metadata:
  ns: app
  visibility: public
tags:
  - tag1
  - tag2
---

# Application Name

Detailed description in Markdown.

## Sections

Content organized with headers.
```

### TypeScript Configuration

- Strict mode enabled
- ES2022 target
- ESNext modules
- Types checked during build

## Common Tasks

### Bulk Updates

For bulk updates across multiple files:

```bash
# Example: Add tag to all applications
find apps -name "*.mdx" -exec sed -i '' 's/tags:/tags:\n  - new-tag/' {} \;

# Build to validate
pnpm build

# Review changes
git diff

# Commit
git add apps
git commit -m "Add new-tag to all applications"
git push
```

## Webhook Configuration

### GitHub App Setup

The GitHub App (repo.do) is configured to send webhooks to:

**Webhook URL**: `https://repo.do/api/webhooks/github`

**Events**:
- Push events (when commits are pushed)
- Pull request events (when PRs are opened/updated)

**Secret**: Set via environment variable `GITHUB_WEBHOOK_SECRET`

### Webhook Handler

Located in `api` project at `src/routes/webhooks/github.ts`.

## Troubleshooting

### Build Errors

**Schema validation failed**:
- Check frontmatter matches required fields
- Ensure all required fields have values
- Verify enum values are allowed
- Check data types (string vs array)

### Sync Issues

**Webhook not triggering**:
- Check GitHub App installation
- Verify webhook secret is configured
- Check API webhook endpoint is accessible
- Review GitHub webhook delivery logs

**Database not updating**:
- Check API logs for errors
- Verify database connection
- Ensure entity validates against schema
- Check for duplicate keys

## Related Documentation

- **Parent**: [Root CLAUDE.md](../CLAUDE.md) - Multi-repo management
- **Database**: [db/CLAUDE.md](../db/CLAUDE.md) - Database schema and sync
- **API**: [api/CLAUDE.md](../api/CLAUDE.md) - Webhook handler

## External Resources

- **Velite**: https://velite.js.org
- **Zod**: https://zod.dev
- **MDX**: https://mdxjs.com

---

**Last Updated**: 2025-10-03
**Maintained By**: Claude Code
**Repository**: https://github.com/dot-do/apps

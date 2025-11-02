# LMCP Quick Reference

Fast lookup guide for common tasks and API usage.

## CLI Usage

```bash
# Run interactive server toggle
lmcp

# Show help
lmcp --help

# Show version
lmcp --version
```

## File Locations

| File | Path | Purpose |
|------|------|---------|
| Active servers | `~/.claude.json` | Loaded by Claude Desktop |
| Disabled servers | `~/.lmcp.json` | Stored by LMCP |

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `↑` `↓` | Navigate |
| `Space` | Toggle server |
| `a` | Toggle all |
| `i` | Invert selection |
| `Enter` | Apply changes |
| `Ctrl+C` | Cancel |

## Common Tasks

### Enable Specific Servers
1. Run `lmcp`
2. Use `Space` to select desired servers
3. Press `Enter`

### Disable All Servers
1. Run `lmcp`
2. Press `a` to deselect all
3. Press `Enter`

### Test Single Server
1. Run `lmcp`
2. Deselect all except one server
3. Press `Enter`
4. Restart Claude Desktop

## API Quick Reference

### Import Modules

```typescript
// UI functions
import { showServerToggleUI, createServerToggleItems } from './ui.js';

// Manager functions
import { toggleMcpServers } from './manager.js';

// Config functions
import { getAllMcpServers, readClaudeConfig, writeClaudeConfig } from './config.js';

// Types
import type { McpServer, ClaudeConfig, ServerToggleItem } from './types.js';
```

### Get All Servers

```typescript
import { getAllMcpServers } from './config.js';

const { active, disabled } = getAllMcpServers();
console.log(`Active: ${Object.keys(active).join(', ')}`);
console.log(`Disabled: ${Object.keys(disabled).join(', ')}`);
```

### Toggle Servers Programmatically

```typescript
import { toggleMcpServers } from './manager.js';

// Enable only github and context7
toggleMcpServers(['github', 'context7']);
```

### Read Configuration

```typescript
import { readClaudeConfig } from './config.js';

const config = readClaudeConfig();
const servers = config.mcpServers || {};
```

### Write Configuration

```typescript
import { writeClaudeConfig } from './config.js';

const config = {
  mcpServers: {
    github: {
      command: "npx",
      args: ["-y", "@modelcontextprotocol/server-github"]
    }
  }
};

writeClaudeConfig(config);
```

## Type Definitions

### McpServer

```typescript
interface McpServer {
  command: string;           // Required: command to run
  args?: string[];          // Optional: command arguments
  env?: Record<string, string>;  // Optional: environment variables
}
```

### ClaudeConfig

```typescript
interface ClaudeConfig {
  mcpServers?: Record<string, McpServer>;  // Server configurations
}
```

### ServerToggleItem

```typescript
interface ServerToggleItem {
  name: string;    // Display name with styling
  value: string;   // Server identifier
  checked: boolean;  // Selection state
}
```

## Error Handling

### User Cancellation

```typescript
import { showServerToggleUI } from './ui.js';

try {
  const selected = await showServerToggleUI();
} catch (error) {
  if (error.message.includes("User force closed")) {
    console.log("Cancelled by user");
  }
}
```

### File I/O Errors

```typescript
import { writeClaudeConfig } from './config.js';

try {
  writeClaudeConfig(config);
} catch (error) {
  console.error("Failed to write config:", error);
  // Error is logged and re-thrown
}
```

## Development Commands

```bash
# Install dependencies
pnpm install

# Development mode
pnpm dev

# Build
pnpm build

# Run built version
pnpm start

# Lint
pnpm lint

# Auto-fix linting
pnpm lint:fix

# Format code
pnpm format

# Type check
pnpm typecheck

# Link globally
pnpm link --global

# Unlink
pnpm unlink --global
```

## Configuration File Format

### Active Servers (~/.claude.json)

```json
{
  "mcpServers": {
    "server-name": {
      "command": "command-to-run",
      "args": ["arg1", "arg2"],
      "env": {
        "VAR_NAME": "value"
      }
    }
  }
}
```

### Example Server Configurations

```json
{
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_TOKEN": "ghp_xxxxx"
      }
    },
    "context7": {
      "command": "npx",
      "args": ["-y", "@context7/mcp-server"]
    },
    "playwright": {
      "command": "npx",
      "args": ["-y", "@playwright/mcp-server"]
    },
    "postgres": {
      "command": "docker",
      "args": ["run", "-it", "postgres-mcp"]
    }
  }
}
```

## Troubleshooting

| Problem | Solution |
|---------|----------|
| "No MCP servers found" | Create `~/.claude.json` with server configs |
| Changes not reflected | Restart Claude Desktop |
| Permission errors | Check file permissions: `chmod 644 ~/.claude.json` |
| Build fails | Run `pnpm install` and try again |
| Command not found | Run `pnpm link --global` |

## Exit Codes

| Code | Meaning |
|------|---------|
| 0 | Success or user cancellation |
| 1 | Error (config write failed, etc.) |

## Links

- [Full Documentation](./README.md)
- [Architecture](./ARCHITECTURE.md)
- [API Reference](./API_REFERENCE.md)
- [Contributing](./CONTRIBUTING.md)
- [GitHub](https://github.com/loneexile/lmcp)
- [MCP Docs](https://modelcontextprotocol.io)

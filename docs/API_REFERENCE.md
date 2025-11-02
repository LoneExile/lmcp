# API Reference

Complete reference documentation for LMCP modules, functions, and types.

## Table of Contents

- [Module: index](#module-index)
- [Module: ui](#module-ui)
- [Module: manager](#module-manager)
- [Module: config](#module-config)
- [Module: types](#module-types)

---

## Module: index

Main entry point for the LMCP CLI application.

**File:** `src/index.ts`

### Description

Sets up the Commander.js CLI program, handles user interaction flow, and provides global error handling for the application.

### Usage

```bash
# Run the CLI tool
lmcp

# Show help information
lmcp --help

# Show version
lmcp --version
```

### Error Handling

The module catches and handles:
- **User Cancellation** (Ctrl+C): Displays "Cancelled" and exits gracefully
- **Other Errors**: Displays error message in red and exits with code 1

---

## Module: ui

Interactive user interface components for server selection.

**File:** `src/ui.ts`

### Functions

#### `createServerToggleItems()`

Creates an array of formatted server toggle items for the interactive UI.

**Signature:**
```typescript
function createServerToggleItems(): ServerToggleItem[]
```

**Returns:** `ServerToggleItem[]`
- Array of server items sorted alphabetically by server name

**Behavior:**
1. Retrieves all servers from both active and disabled configurations
2. Formats active servers with green checkmark (✓) and "(active)" label
3. Formats disabled servers with red cross (✗) and "(disabled)" label
4. Marks active servers as checked by default
5. Sorts results alphabetically by server name

**Example:**
```typescript
import { createServerToggleItems } from './ui.js';

const items = createServerToggleItems();
console.log(items);
// Output:
// [
//   { name: "✓ context7 (active)", value: "context7", checked: true },
//   { name: "✓ github (active)", value: "github", checked: true },
//   { name: "✗ docker-mcp (disabled)", value: "docker-mcp", checked: false }
// ]
```

---

#### `showServerToggleUI()`

Displays the interactive checkbox UI and returns user's selection.

**Signature:**
```typescript
async function showServerToggleUI(): Promise<string[]>
```

**Returns:** `Promise<string[]>`
- Array of server names that the user selected

**Throws:**
- May throw if user force-closes the prompt (Ctrl+C)

**Behavior:**
1. Calls `createServerToggleItems()` to get server list
2. If no servers found, displays warning and returns empty array
3. Displays checkbox interface with instructions
4. Waits for user selection
5. Returns array of selected server names

**UI Controls:**
- `↑` `↓` - Navigate through servers
- `Space` - Toggle individual server
- `a` - Toggle all servers
- `i` - Invert current selection
- `Enter` - Submit selection
- `Ctrl+C` - Cancel (throws error)

**Example:**
```typescript
import { showServerToggleUI } from './ui.js';

try {
  const selected = await showServerToggleUI();
  console.log(`User selected: ${selected.join(', ')}`);
  // Output: "User selected: github, context7"
} catch (error) {
  console.log('User cancelled');
}
```

---

## Module: manager

Server toggle business logic and configuration redistribution.

**File:** `src/manager.ts`

### Functions

#### `toggleMcpServers()`

Toggles MCP servers between active and disabled states based on user selection.

**Signature:**
```typescript
function toggleMcpServers(selectedServers: string[]): void
```

**Parameters:**
- `selectedServers` (`string[]`) - Array of server names that should be active

**Returns:** `void`

**Side Effects:**
- Writes to `~/.claude.json` (active servers)
- Writes to `~/.lmcp.json` (disabled servers)
- Prints status messages to console
- Exits process with code 1 on error

**Behavior:**
1. Retrieves all servers from both configurations
2. Reads current configuration files
3. Initializes `mcpServers` objects if they don't exist
4. Clears both configurations' `mcpServers`
5. Iterates through all servers:
   - If server in `selectedServers`, moves to `~/.claude.json` (prints green "✓ Enabled")
   - Otherwise, moves to `~/.lmcp.json` (prints red "✗ Disabled")
6. Writes both configuration files
7. Displays summary with counts of active and disabled servers

**Error Handling:**
- Catches write errors
- Displays error message in red
- Exits process with code 1

**Example:**
```typescript
import { toggleMcpServers } from './manager.js';

toggleMcpServers(['github', 'context7']);
// Console output:
// ✓ Enabled: github
// ✓ Enabled: context7
// ✗ Disabled: playwright
// ✗ Disabled: postgres
//
// Configuration updated successfully!
// Active servers: 2
// Disabled servers: 2
```

---

## Module: config

Configuration file management and I/O operations.

**File:** `src/config.ts`

### Constants

#### `CLAUDE_CONFIG_PATH`

Path to Claude Desktop configuration file.

```typescript
const CLAUDE_CONFIG_PATH: string = join(homedir(), ".claude.json")
```

**Value:** `~/.claude.json`

---

#### `LMCP_CONFIG_PATH`

Path to LMCP disabled servers configuration file.

```typescript
const LMCP_CONFIG_PATH: string = join(homedir(), ".lmcp.json")
```

**Value:** `~/.lmcp.json`

---

### Functions

#### `readClaudeConfig()`

Reads and parses the Claude Desktop configuration file.

**Signature:**
```typescript
function readClaudeConfig(): ClaudeConfig
```

**Returns:** `ClaudeConfig`
- Parsed configuration object
- Empty object `{}` if file doesn't exist

**Error Handling:**
- Returns empty object if file doesn't exist
- Logs error to console and returns empty object on parse failure

**Example:**
```typescript
import { readClaudeConfig } from './config.js';

const config = readClaudeConfig();
console.log(config.mcpServers);
// Output: { github: {...}, context7: {...} }
```

---

#### `readLmcpConfig()`

Reads and parses the LMCP configuration file containing disabled servers.

**Signature:**
```typescript
function readLmcpConfig(): ClaudeConfig
```

**Returns:** `ClaudeConfig`
- Parsed configuration object
- Empty object `{}` if file doesn't exist

**Error Handling:**
- Returns empty object if file doesn't exist
- Logs error to console and returns empty object on parse failure

**Example:**
```typescript
import { readLmcpConfig } from './config.js';

const config = readLmcpConfig();
console.log(config.mcpServers);
// Output: { playwright: {...}, postgres: {...} }
```

---

#### `writeClaudeConfig()`

Writes configuration to the Claude Desktop configuration file.

**Signature:**
```typescript
function writeClaudeConfig(config: ClaudeConfig): void
```

**Parameters:**
- `config` (`ClaudeConfig`) - Configuration object to write

**Returns:** `void`

**Throws:**
- Re-throws error after logging if write operation fails

**Behavior:**
- Serializes config to JSON with 2-space indentation
- Writes to `~/.claude.json`

**Example:**
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

---

#### `writeLmcpConfig()`

Writes configuration to the LMCP configuration file.

**Signature:**
```typescript
function writeLmcpConfig(config: ClaudeConfig): void
```

**Parameters:**
- `config` (`ClaudeConfig`) - Configuration object to write

**Returns:** `void`

**Throws:**
- Re-throws error after logging if write operation fails

**Behavior:**
- Serializes config to JSON with 2-space indentation
- Writes to `~/.lmcp.json`

**Example:**
```typescript
import { writeLmcpConfig } from './config.js';

const config = {
  mcpServers: {
    playwright: {
      command: "npx",
      args: ["-y", "@playwright/mcp-server"]
    }
  }
};

writeLmcpConfig(config);
```

---

#### `getAllMcpServers()`

Retrieves all MCP servers from both active and disabled configurations.

**Signature:**
```typescript
function getAllMcpServers(): {
  active: Record<string, any>;
  disabled: Record<string, any>;
}
```

**Returns:** Object containing:
- `active` (`Record<string, any>`) - Servers from `~/.claude.json`
- `disabled` (`Record<string, any>`) - Servers from `~/.lmcp.json`

**Behavior:**
1. Reads Claude config file
2. Reads LMCP config file
3. Extracts `mcpServers` from each (or empty object if undefined)
4. Returns both in structured object

**Example:**
```typescript
import { getAllMcpServers } from './config.js';

const { active, disabled } = getAllMcpServers();

console.log(`Active servers: ${Object.keys(active).join(', ')}`);
// Output: "Active servers: github, context7"

console.log(`Disabled servers: ${Object.keys(disabled).join(', ')}`);
// Output: "Disabled servers: playwright, postgres"
```

---

## Module: types

TypeScript type definitions and interfaces.

**File:** `src/types.ts`

### Interfaces

#### `McpServer`

Represents an MCP (Model Context Protocol) server configuration.

**Definition:**
```typescript
interface McpServer {
  command: string;
  args?: string[];
  env?: Record<string, string>;
  [key: string]: any;
}
```

**Properties:**

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `command` | `string` | Yes | The command to execute for starting the MCP server |
| `args` | `string[]` | No | Optional arguments to pass to the server command |
| `env` | `Record<string, string>` | No | Optional environment variables for the server process |
| `[key]` | `any` | No | Additional server configuration properties |

**Example:**
```typescript
const githubServer: McpServer = {
  command: "npx",
  args: ["-y", "@modelcontextprotocol/server-github"],
  env: {
    GITHUB_TOKEN: "ghp_xxxxxxxxxxxxx"
  }
};

const simpleServer: McpServer = {
  command: "node",
  args: ["server.js"]
};
```

---

#### `ClaudeConfig`

Claude Desktop configuration file structure.

**Definition:**
```typescript
interface ClaudeConfig {
  mcpServers?: Record<string, McpServer>;
  [key: string]: any;
}
```

**Properties:**

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `mcpServers` | `Record<string, McpServer>` | No | Map of MCP server names to their configurations |
| `[key]` | `any` | No | Additional configuration properties |

**Example:**
```typescript
const config: ClaudeConfig = {
  mcpServers: {
    "github": {
      command: "npx",
      args: ["-y", "@modelcontextprotocol/server-github"]
    },
    "context7": {
      command: "npx",
      args: ["-y", "@context7/mcp-server"]
    }
  }
};
```

---

#### `ServerToggleItem`

Represents a server item in the interactive toggle UI.

**Definition:**
```typescript
interface ServerToggleItem {
  name: string;
  value: string;
  checked: boolean;
}
```

**Properties:**

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `name` | `string` | Yes | Display name with status indicators and styling |
| `value` | `string` | Yes | Actual server name value used for identification |
| `checked` | `boolean` | Yes | Whether the server is currently selected/active |

**Example:**
```typescript
const toggleItem: ServerToggleItem = {
  name: "✓ github (active)",
  value: "github",
  checked: true
};

const disabledItem: ServerToggleItem = {
  name: "✗ playwright (disabled)",
  value: "playwright",
  checked: false
};
```

---

## Type Exports

All types are exported from `src/types.ts` and can be imported as:

```typescript
import type { McpServer, ClaudeConfig, ServerToggleItem } from './types.js';
```

---

## Complete Usage Example

Here's a complete example showing how all modules work together:

```typescript
// Complete workflow example
import { showServerToggleUI } from './ui.js';
import { toggleMcpServers } from './manager.js';
import { getAllMcpServers } from './config.js';

// 1. Get current state
const { active, disabled } = getAllMcpServers();
console.log(`Currently active: ${Object.keys(active).join(', ')}`);

// 2. Show UI and get user selection
const selected = await showServerToggleUI();

// 3. Apply changes
if (selected.length >= 0) {
  toggleMcpServers(selected);
}

// Result: Selected servers moved to ~/.claude.json
//         Unselected servers moved to ~/.lmcp.json
```

---

## File Paths Reference

| Constant | Path | Purpose |
|----------|------|---------|
| `CLAUDE_CONFIG_PATH` | `~/.claude.json` | Active MCP servers loaded by Claude Desktop |
| `LMCP_CONFIG_PATH` | `~/.lmcp.json` | Disabled MCP servers preserved by LMCP |

---

## Exit Codes

| Code | Meaning | Trigger |
|------|---------|---------|
| 0 | Success | Normal execution or user cancellation |
| 1 | Error | Configuration write failure or unexpected error |

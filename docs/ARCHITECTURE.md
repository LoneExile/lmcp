# Architecture Documentation

## System Overview

LMCP (Lightweight MCP Manager) is a CLI tool for managing Claude Desktop's MCP (Model Context Protocol) servers. It provides an interactive interface for toggling servers between active and disabled states while preserving their configurations.

## High-Level Architecture

```mermaid
graph TB
    subgraph "User Interface Layer"
        CLI[CLI Entry Point<br/>index.ts]
        UI[Interactive UI<br/>ui.ts]
    end

    subgraph "Business Logic Layer"
        Manager[Server Manager<br/>manager.ts]
    end

    subgraph "Data Access Layer"
        Config[Configuration Handler<br/>config.ts]
    end

    subgraph "Type Definitions"
        Types[Type Definitions<br/>types.ts]
    end

    subgraph "File System"
        Claude[~/.claude.json<br/>Active Servers]
        LMCP[~/.lmcp.json<br/>Disabled Servers]
    end

    CLI --> UI
    UI --> Manager
    Manager --> Config
    Config --> Claude
    Config --> LMCP

    Types -.-> UI
    Types -.-> Manager
    Types -.-> Config

    style CLI fill:#e1f5ff
    style UI fill:#e1f5ff
    style Manager fill:#fff4e1
    style Config fill:#ffe1e1
    style Claude fill:#e8f5e9
    style LMCP fill:#e8f5e9
```

## Component Diagram

```mermaid
graph LR
    subgraph "src/"
        Index["index.ts<br/><i>CLI Entry & Error Handling</i>"]
        UI["ui.ts<br/><i>Interactive Checkbox UI</i>"]
        Manager["manager.ts<br/><i>Toggle Logic</i>"]
        Config["config.ts<br/><i>File I/O</i>"]
        Types["types.ts<br/><i>TypeScript Interfaces</i>"]
    end

    Index --> UI
    Index --> Manager
    UI --> Config
    Manager --> Config

    UI -.implements.-> Types
    Manager -.implements.-> Types
    Config -.implements.-> Types

    style Index fill:#4a90e2,color:#fff
    style UI fill:#7b68ee,color:#fff
    style Manager fill:#ff6b6b,color:#fff
    style Config fill:#51cf66,color:#fff
    style Types fill:#ffd93d
```

## Sequence Diagram

```mermaid
sequenceDiagram
    actor User
    participant CLI as index.ts
    participant UI as ui.ts
    participant Manager as manager.ts
    participant Config as config.ts
    participant FS as File System

    User->>CLI: Run 'lmcp' command
    CLI->>UI: showServerToggleUI()
    UI->>Config: getAllMcpServers()
    Config->>FS: Read ~/.claude.json
    FS-->>Config: Active servers
    Config->>FS: Read ~/.lmcp.json
    FS-->>Config: Disabled servers
    Config-->>UI: {active, disabled}

    UI->>UI: createServerToggleItems()
    UI->>User: Display checkbox UI
    User->>UI: Select/deselect servers
    User->>UI: Press Enter
    UI-->>CLI: selectedServers[]

    CLI->>Manager: toggleMcpServers(selectedServers)
    Manager->>Config: readClaudeConfig()
    Manager->>Config: readLmcpConfig()
    Config-->>Manager: Current configs

    Manager->>Manager: Redistribute servers
    Manager->>Config: writeClaudeConfig(newConfig)
    Config->>FS: Write ~/.claude.json
    Manager->>Config: writeLmcpConfig(newConfig)
    Config->>FS: Write ~/.lmcp.json

    Manager->>User: Display success message
```

## Data Flow

```mermaid
flowchart TD
    Start([User runs 'lmcp']) --> Load[Load configurations]
    Load --> ReadClaude[Read ~/.claude.json]
    Load --> ReadLMCP[Read ~/.lmcp.json]

    ReadClaude --> Merge[Merge server lists]
    ReadLMCP --> Merge

    Merge --> Display[Display interactive UI]
    Display --> Wait{User makes selection}

    Wait -->|Cancel| Exit([Exit without changes])
    Wait -->|Submit| Redistribute[Redistribute servers]

    Redistribute --> Active[Selected servers → ~/.claude.json]
    Redistribute --> Disabled[Unselected servers → ~/.lmcp.json]

    Active --> Write[Write configurations]
    Disabled --> Write

    Write --> Success([Display success message])
```

## Module Responsibilities

### 1. index.ts (CLI Entry Point)
**Purpose:** Application entry point and command-line interface setup

**Responsibilities:**
- Initialize Commander.js CLI program
- Handle global error catching and user cancellation
- Coordinate UI and manager components
- Provide version and help information

**Dependencies:**
- `commander` - CLI framework
- `chalk` - Terminal string styling
- Internal: `ui.ts`, `manager.ts`

### 2. ui.ts (Interactive User Interface)
**Purpose:** Render interactive checkbox interface for server selection

**Responsibilities:**
- Create formatted server toggle items with status indicators
- Display interactive checkbox UI using Inquirer
- Handle "no servers found" edge case
- Return user's server selection

**Dependencies:**
- `@inquirer/prompts` - Interactive CLI prompts
- `chalk` - Terminal colors and styling
- Internal: `config.ts`, `types.ts`

**Exports:**
- `createServerToggleItems(): ServerToggleItem[]`
- `showServerToggleUI(): Promise<string[]>`

### 3. manager.ts (Server Toggle Logic)
**Purpose:** Core business logic for toggling servers between active/disabled

**Responsibilities:**
- Redistribute servers based on user selection
- Move selected servers to active configuration
- Move unselected servers to disabled configuration
- Display status messages for each server
- Handle configuration write errors

**Dependencies:**
- `chalk` - Status message coloring
- Internal: `config.ts`

**Exports:**
- `toggleMcpServers(selectedServers: string[]): void`

### 4. config.ts (Configuration Management)
**Purpose:** Handle all file I/O operations for configuration files

**Responsibilities:**
- Read/write ~/.claude.json (active servers)
- Read/write ~/.lmcp.json (disabled servers)
- Aggregate servers from both sources
- Handle file existence checks
- Graceful error handling for I/O operations

**Dependencies:**
- Node.js `fs` module
- Node.js `os` module
- Node.js `path` module
- Internal: `types.ts`

**Exports:**
- `readClaudeConfig(): ClaudeConfig`
- `readLmcpConfig(): ClaudeConfig`
- `writeClaudeConfig(config: ClaudeConfig): void`
- `writeLmcpConfig(config: ClaudeConfig): void`
- `getAllMcpServers(): {active, disabled}`

### 5. types.ts (Type Definitions)
**Purpose:** Centralized TypeScript type definitions

**Exports:**
- `McpServer` - Server configuration structure
- `ClaudeConfig` - Claude Desktop config file structure
- `ServerToggleItem` - UI checkbox item structure

## Configuration File Structure

### ~/.claude.json (Active Servers)
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
    }
  }
}
```

### ~/.lmcp.json (Disabled Servers)
```json
{
  "mcpServers": {
    "playwright": {
      "command": "npx",
      "args": ["-y", "@playwright/mcp-server"]
    },
    "postgres": {
      "command": "docker",
      "args": ["run", "postgres-mcp"]
    }
  }
}
```

## Technology Stack

| Component | Technology | Purpose |
|-----------|-----------|---------|
| Language | TypeScript 5.9+ | Type-safe development |
| CLI Framework | Commander 14.x | Command-line interface |
| Interactive Prompts | @inquirer/prompts 7.x | Checkbox UI |
| Terminal Styling | Chalk 5.x | Colored output |
| Build Tool | TypeScript Compiler | Compilation to JavaScript |
| Code Quality | Biome | Linting and formatting |
| Package Manager | pnpm | Dependency management |

## Design Patterns

### 1. Separation of Concerns
Each module has a single, well-defined responsibility:
- UI handles display only
- Manager handles business logic only
- Config handles I/O only

### 2. Dependency Injection
Functions receive dependencies as parameters rather than creating them internally:
```typescript
// config.ts provides data access functions
// manager.ts uses these functions without knowing implementation details
```

### 3. Error Boundary
Top-level error handling in `index.ts` catches and formats all errors:
```typescript
try {
  await showServerToggleUI();
} catch (error) {
  // Handle user cancellation vs. actual errors
}
```

## Security Considerations

1. **File System Access**
   - Only reads/writes to specific home directory files
   - No arbitrary file access
   - Validates file existence before reading

2. **Input Validation**
   - User can only select from existing servers
   - No arbitrary input accepted
   - Server names validated against known configurations

3. **Configuration Preservation**
   - Servers are moved, never deleted
   - Atomic write operations (write entire file at once)
   - Original configurations preserved in backup file

## Performance Characteristics

- **Startup Time:** < 100ms (depends on config file size)
- **Memory Usage:** Minimal (~20MB for Node.js + dependencies)
- **File I/O:** Synchronous operations (configs are small, < 10KB typically)
- **UI Rendering:** Instant for typical use cases (< 20 servers)

## Future Enhancements

Potential architectural improvements:

1. **Async File Operations**
   - Use async fs operations for better performance with large configs

2. **Configuration Validation**
   - JSON schema validation for server configurations
   - Warn about invalid server definitions

3. **Backup System**
   - Create timestamped backups before modifications
   - Allow rollback to previous configurations

4. **Multi-Profile Support**
   - Save and load different server profiles
   - Quick switching between work/personal setups

5. **Server Status Checking**
   - Test if servers are actually running
   - Validate server commands exist on system

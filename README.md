# lmcp

> **L**ightweight **MCP** Manager - A lightweight CLI tool to manage your Claude MCP servers

Toggle [Model Context Protocol (MCP)](https://modelcontextprotocol.io) servers on and off without losing your configurations. Perfect for managing multiple MCP servers and quickly switching between different setups.

## ✨ Features

- 🎯 **Interactive UI** - Intuitive checkbox interface for toggling servers
- 💾 **Configuration Preservation** - Disabled servers are safely stored, not deleted
- ⚡ **Fast Switching** - Quickly enable/disable servers without editing JSON files
- 🔄 **Bulk Operations** - Toggle all servers or invert selection with a single key
- 🎨 **Color-Coded Status** - Visual indicators for active (✓) and disabled (✗) servers
- 🛡️ **Safe Defaults** - Never overwrites your existing configurations

## 📦 Installation

### Global Installation (Recommended)

```bash
npm install -g lmcp
```

### Using npx (No Installation)

```bash
npx lmcp
```

### From Source

```bash
git clone https://github.com/loneexile/lmcp.git
cd lmcp
pnpm install
pnpm build
pnpm link --global
```

## 🚀 Quick Start

Simply run the command:

```bash
lmcp
```

You'll see an interactive interface:

```
❯ lmcp
MCP Server Manager
Select which MCP servers should be active in Claude:

? Toggle MCP servers (active servers will be in ~/.claude.json):
❯◉ ✓ github (active)
 ◉ ✓ context7 (active)
 ◯ ✗ playwright (disabled)
 ◯ ✗ postgres (disabled)
 ◯ ✗ docker-mcp (disabled)

↑↓ navigate • space select • a all • i invert • ⏎ submit
```

### Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `↑` `↓` | Navigate through servers |
| `Space` | Toggle individual server |
| `a` | Toggle all servers |
| `i` | Invert current selection |
| `Enter` | Apply changes |
| `Ctrl+C` | Cancel without changes |

## 💡 How It Works

`lmcp` manages two configuration files:

1. **`~/.claude.json`** - Contains your active MCP servers (loaded by Claude)
2. **`~/.lmcp.json`** - Stores disabled servers (preserved but not loaded)

When you toggle a server:
- ✅ **Enabled** → Server config moved to `~/.claude.json`
- ❌ **Disabled** → Server config moved to `~/.lmcp.json`

Your server configurations are **never deleted**, just moved between files. This means you can freely experiment with different server combinations without losing your setup.

### Example Workflow

```bash
# 1. Run lmcp
lmcp

# 2. Use spacebar to select which servers should be active
#    For example, enable only 'github' and 'context7'

# 3. Press Enter to apply

# Output:
✓ Enabled: github
✓ Enabled: context7
✗ Disabled: playwright
✗ Disabled: postgres

Configuration updated successfully!
Active servers: 2
Disabled servers: 2
```

## 🔧 Use Cases

### Testing Individual Servers
Quickly enable only one server to test its functionality:
```bash
lmcp  # Disable all except the one you want to test
```

### Development vs Production
Maintain separate sets of servers for different environments:
- Development: Enable debugging and testing servers
- Production: Enable only essential, stable servers

### Performance Optimization
Claude loads faster with fewer servers. Disable unused servers to improve startup time.

### Troubleshooting
When Claude behaves unexpectedly, disable all servers and enable them one-by-one to identify the problematic server.

## 📋 Requirements

- **Node.js** 16 or higher
- **Claude Desktop** with an existing `~/.claude.json` configuration file
- **MCP Servers** already configured in `~/.claude.json`

## 🏗️ Project Structure

```
lmcp/
├── src/
│   ├── index.ts      # CLI entry point
│   ├── config.ts     # Configuration file handlers
│   ├── manager.ts    # Server toggle logic
│   ├── ui.ts         # Interactive UI
│   └── types.ts      # TypeScript types
├── openspec/         # OpenSpec documentation
├── package.json
└── README.md
```

## 🛠️ Development

### Setup

```bash
# Clone the repository
git clone https://github.com/loneexile/lmcp.git
cd lmcp

# Install dependencies
pnpm install

# Run in development mode
pnpm dev

# Build for production
pnpm build

# Link for local testing
pnpm link --global
```

### Scripts

```bash
pnpm build        # Compile TypeScript
pnpm dev          # Run in development mode
pnpm lint         # Run Biome linter
pnpm lint:fix     # Fix linting issues
pnpm format       # Format code with Biome
pnpm typecheck    # Type check without building
```

### Code Quality

This project uses:
- **TypeScript** with strict mode
- **Biome** for linting and formatting
- **Tab indentation** and **double quotes**

## 🐛 Troubleshooting

### `No MCP servers found` error

**Cause:** No `~/.claude.json` or `~/.lmcp.json` files exist

**Solution:** Make sure you have Claude Desktop installed and at least one MCP server configured. See [Claude MCP documentation](https://modelcontextprotocol.io/introduction) for setup instructions.

### Changes not reflected in Claude

**Cause:** Claude needs to be restarted to reload configurations

**Solution:** Quit and restart Claude Desktop after making changes.

### Permission errors

**Cause:** Insufficient permissions to read/write config files

**Solution:**
```bash
# Check file permissions
ls -la ~/.claude.json ~/.lmcp.json

# Fix permissions if needed (macOS/Linux)
chmod 644 ~/.claude.json ~/.lmcp.json
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

## 📄 License

[MIT](LICENSE)

## 🔗 Links

- [Repository](https://github.com/loneexile/lmcp)
- [Issues](https://github.com/loneexile/lmcp/issues)
- [Model Context Protocol](https://modelcontextprotocol.io)
- [Claude Desktop](https://claude.ai/download)

## 🌟 Acknowledgments

Inspired by [claude-ext](https://github.com/jacobycwang/claude-ext) by Jacob Wang.

Built for the [Claude Desktop](https://claude.ai) and [Model Context Protocol](https://modelcontextprotocol.io) ecosystem.

---

**Made with ❤️ by [LoneExile](https://github.com/loneexile)**

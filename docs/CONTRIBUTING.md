# Contributing to LMCP

Thank you for your interest in contributing to LMCP! This guide will help you get started with development, testing, and submitting contributions.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Project Structure](#project-structure)
- [Coding Standards](#coding-standards)
- [Testing Guidelines](#testing-guidelines)
- [Submitting Changes](#submitting-changes)
- [Release Process](#release-process)

---

## Code of Conduct

### Our Standards

We are committed to providing a welcoming and inclusive environment. We expect all contributors to:

- Be respectful and considerate in communication
- Accept constructive criticism gracefully
- Focus on what's best for the community
- Show empathy towards other community members

### Unacceptable Behavior

- Harassment, discrimination, or offensive comments
- Personal attacks or trolling
- Publishing others' private information
- Any conduct that would be inappropriate in a professional setting

---

## Getting Started

### Prerequisites

Before you begin, ensure you have:

- **Node.js** 16.x or higher
- **pnpm** (recommended) or npm
- **Git** for version control
- **Claude Desktop** for testing (optional but recommended)
- A text editor (VS Code, Vim, etc.)

### Quick Start

1. **Fork the repository** on GitHub
2. **Clone your fork:**
   ```bash
   git clone https://github.com/YOUR_USERNAME/lmcp.git
   cd lmcp
   ```

3. **Add upstream remote:**
   ```bash
   git remote add upstream https://github.com/loneexile/lmcp.git
   ```

4. **Install dependencies:**
   ```bash
   pnpm install
   ```

5. **Run in development mode:**
   ```bash
   pnpm dev
   ```

---

## Development Setup

### Environment Setup

1. **Create test configuration files:**
   ```bash
   # Create a test Claude config
   cat > ~/.claude.json << 'EOF'
   {
     "mcpServers": {
       "test-server-1": {
         "command": "echo",
         "args": ["test1"]
       },
       "test-server-2": {
         "command": "echo",
         "args": ["test2"]
       }
     }
   }
   EOF
   ```

2. **Link for local testing:**
   ```bash
   pnpm link --global
   ```

3. **Test the CLI:**
   ```bash
   lmcp
   ```

### Development Workflow

```bash
# 1. Create a feature branch
git checkout -b feature/your-feature-name

# 2. Make your changes

# 3. Run linter
pnpm lint

# 4. Fix linting issues automatically
pnpm lint:fix

# 5. Format code
pnpm format

# 6. Type check
pnpm typecheck

# 7. Build the project
pnpm build

# 8. Test manually
pnpm start

# 9. Commit your changes
git add .
git commit -m "feat: add your feature description"

# 10. Push to your fork
git push origin feature/your-feature-name
```

### Available Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Run in development mode with tsx |
| `pnpm build` | Compile TypeScript to JavaScript |
| `pnpm start` | Run the compiled JavaScript |
| `pnpm lint` | Check code with Biome linter |
| `pnpm lint:fix` | Auto-fix linting issues |
| `pnpm format` | Format code with Biome |
| `pnpm typecheck` | Type check without building |

---

## Project Structure

```
lmcp/
├── src/                    # Source TypeScript files
│   ├── index.ts           # CLI entry point
│   ├── ui.ts              # Interactive UI components
│   ├── manager.ts         # Server toggle logic
│   ├── config.ts          # Configuration file I/O
│   └── types.ts           # TypeScript type definitions
├── dist/                   # Compiled JavaScript (generated)
├── docs/                   # Documentation
│   ├── ARCHITECTURE.md    # System architecture
│   ├── API_REFERENCE.md   # API documentation
│   └── CONTRIBUTING.md    # This file
├── openspec/              # OpenSpec specifications
├── package.json           # Package configuration
├── tsconfig.json          # TypeScript configuration
├── biome.json            # Biome configuration
├── README.md             # User documentation
└── LICENSE               # MIT License
```

### Module Responsibilities

- **index.ts** - CLI setup, error handling, program coordination
- **ui.ts** - Interactive checkbox UI, server list formatting
- **manager.ts** - Server redistribution logic, status messages
- **config.ts** - File I/O operations, configuration management
- **types.ts** - TypeScript interfaces and types

---

## Coding Standards

### TypeScript Style Guide

#### 1. Use Tabs for Indentation
```typescript
// ✅ Good
function example() {
	const value = 42;
	return value;
}

// ❌ Bad (spaces)
function example() {
  const value = 42;
  return value;
}
```

#### 2. Use Double Quotes
```typescript
// ✅ Good
const message = "Hello, world!";

// ❌ Bad
const message = 'Hello, world!';
```

#### 3. Explicit Types for Function Parameters
```typescript
// ✅ Good
function processServers(servers: string[]): void {
	// ...
}

// ❌ Bad
function processServers(servers) {
	// ...
}
```

#### 4. Use Interfaces for Object Shapes
```typescript
// ✅ Good
interface ServerConfig {
	name: string;
	command: string;
	args?: string[];
}

// ❌ Bad (type alias for object shapes)
type ServerConfig = {
	name: string;
	command: string;
	args?: string[];
};
```

#### 5. Meaningful Variable Names
```typescript
// ✅ Good
const selectedServerNames = ["github", "context7"];
const activeServerCount = Object.keys(active).length;

// ❌ Bad
const arr = ["github", "context7"];
const cnt = Object.keys(active).length;
```

### Documentation Standards

#### JSDoc Comments

All exported functions must have JSDoc comments:

```typescript
/**
 * Brief description of what the function does
 *
 * Detailed explanation if needed, including algorithm details,
 * side effects, or important behavioral notes.
 *
 * @param paramName - Description of the parameter
 * @param anotherParam - Description of another parameter
 * @returns Description of return value
 * @throws Description of errors that may be thrown
 *
 * @example
 * const result = functionName('example');
 * console.log(result); // Output: expected result
 */
export function functionName(paramName: string, anotherParam: number): string {
	// Implementation
}
```

#### Comment Best Practices

```typescript
// ✅ Good - Explains WHY, not WHAT
// Initialize mcpServers to prevent undefined access when redistributing servers
if (!claudeConfig.mcpServers) {
	claudeConfig.mcpServers = {};
}

// ❌ Bad - States the obvious
// Set mcpServers to empty object
if (!claudeConfig.mcpServers) {
	claudeConfig.mcpServers = {};
}
```

### Error Handling

#### 1. Graceful Degradation
```typescript
// ✅ Good
export function readClaudeConfig(): ClaudeConfig {
	try {
		if (!existsSync(CLAUDE_CONFIG_PATH)) {
			return {}; // Return empty config instead of throwing
		}
		const content = readFileSync(CLAUDE_CONFIG_PATH, "utf-8");
		return JSON.parse(content);
	} catch (error) {
		console.error("Failed to read ~/.claude.json:", error);
		return {}; // Fail gracefully
	}
}
```

#### 2. Descriptive Error Messages
```typescript
// ✅ Good
console.error("Failed to write ~/.claude.json:", error);

// ❌ Bad
console.error("Error:", error);
```

### Import/Export Conventions

```typescript
// ✅ Good - Use .js extension for imports (for ESM)
import { getAllMcpServers } from "./config.js";

// ✅ Good - Use type-only imports for types
import type { ClaudeConfig } from "./types.js";

// ❌ Bad - Missing .js extension
import { getAllMcpServers } from "./config";
```

---

## Testing Guidelines

### Manual Testing Checklist

Before submitting a PR, manually test these scenarios:

#### 1. Basic Functionality
- [ ] Run `lmcp` with existing servers
- [ ] Toggle servers on and off
- [ ] Verify changes in `~/.claude.json`
- [ ] Verify disabled servers in `~/.lmcp.json`

#### 2. Edge Cases
- [ ] Run with no `~/.claude.json` (should show warning)
- [ ] Run with empty `~/.claude.json`
- [ ] Cancel with Ctrl+C (should exit gracefully)
- [ ] Select all servers
- [ ] Deselect all servers

#### 3. Error Scenarios
- [ ] Invalid JSON in config files
- [ ] Permission denied on config files
- [ ] Disk full scenario (if possible)

### Testing Script Example

```bash
#!/bin/bash
# test.sh - Manual testing helper

echo "=== Testing LMCP ==="

# Setup test environment
echo "Creating test configs..."
cat > ~/.claude.json << 'EOF'
{
  "mcpServers": {
    "server-a": {"command": "echo", "args": ["a"]},
    "server-b": {"command": "echo", "args": ["b"]}
  }
}
EOF

# Build and test
echo "Building..."
pnpm build

echo "Running lmcp..."
pnpm start

echo "Checking results..."
cat ~/.claude.json
cat ~/.lmcp.json
```

### Future: Automated Testing

We plan to add automated tests using:
- **Vitest** for unit tests
- **Mock file system** for testing I/O operations
- **Snapshot tests** for UI output

Example test structure (future):
```typescript
import { describe, it, expect, beforeEach } from 'vitest';
import { getAllMcpServers } from './config';

describe('config.ts', () => {
	beforeEach(() => {
		// Setup mock file system
	});

	it('should read active servers from ~/.claude.json', () => {
		const { active } = getAllMcpServers();
		expect(active).toHaveProperty('github');
	});
});
```

---

## Submitting Changes

### Commit Message Guidelines

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

#### Format
```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

#### Types
- **feat**: New feature
- **fix**: Bug fix
- **docs**: Documentation changes
- **style**: Code style changes (formatting, no logic change)
- **refactor**: Code refactoring
- **perf**: Performance improvements
- **test**: Adding or updating tests
- **chore**: Build process or auxiliary tool changes

#### Examples

```bash
# Good commit messages
git commit -m "feat(ui): add color coding for server status"
git commit -m "fix(config): handle missing ~/.claude.json gracefully"
git commit -m "docs: update README with new installation methods"
git commit -m "refactor(manager): extract server redistribution logic"

# Bad commit messages
git commit -m "update code"
git commit -m "fix bug"
git commit -m "WIP"
```

#### Detailed Commit Example
```
feat(ui): add search functionality to server list

- Implement fuzzy search across server names
- Add keyboard shortcut '/' to activate search
- Clear search on Escape key
- Highlight matching text in results

Closes #42
```

### Pull Request Process

#### 1. Before Opening a PR

- [ ] Create a feature branch from `main`
- [ ] Make your changes
- [ ] Run `pnpm lint:fix` to fix linting issues
- [ ] Run `pnpm format` to format code
- [ ] Run `pnpm typecheck` to verify types
- [ ] Run `pnpm build` to ensure it compiles
- [ ] Test manually with `pnpm start`
- [ ] Update documentation if needed
- [ ] Write clear commit messages

#### 2. Opening the PR

**Title Format:**
```
<type>: <brief description>
```

**Example Titles:**
- `feat: add server health check functionality`
- `fix: resolve config corruption on concurrent writes`
- `docs: improve installation instructions`

**PR Description Template:**
```markdown
## Description
Brief description of what this PR does.

## Motivation
Why is this change needed? What problem does it solve?

## Changes
- List of specific changes made
- Another change
- Yet another change

## Testing
How was this tested?
- [ ] Manual testing on macOS
- [ ] Manual testing on Linux
- [ ] Tested edge cases

## Screenshots (if applicable)
[Add screenshots of UI changes]

## Breaking Changes
List any breaking changes, or write "None"

## Related Issues
Closes #123
Related to #456
```

#### 3. PR Review Process

1. **Automated Checks** (future):
   - Linting must pass
   - Type checking must pass
   - Build must succeed

2. **Code Review**:
   - At least one maintainer approval required
   - Address all review comments
   - Make requested changes

3. **Merging**:
   - Squash merge for feature branches
   - Rebase for clean history
   - Delete branch after merge

### Review Response Guidelines

#### Responding to Feedback
```markdown
# ✅ Good response
> Consider extracting this into a separate function

Good idea! I've refactored it in commit abc123.

# ❌ Bad response
> Consider extracting this into a separate function

No, I think it's fine as is.
```

#### Requesting Clarification
```markdown
# ✅ Good
> This function seems too complex

Could you elaborate on which part you find complex?
Is it the nested conditionals, or the overall length?
```

---

## Release Process

### Version Numbers

We follow [Semantic Versioning](https://semver.org/):
- **MAJOR** (1.x.x): Breaking changes
- **MINOR** (x.1.x): New features, backwards compatible
- **PATCH** (x.x.1): Bug fixes, backwards compatible

### Release Checklist

For maintainers:

1. **Update Version**
   ```bash
   # Update version in package.json
   npm version patch  # or minor, or major
   ```

2. **Update Changelog**
   ```markdown
   ## [1.1.0] - 2024-01-15

   ### Added
   - New feature description

   ### Fixed
   - Bug fix description

   ### Changed
   - Breaking change description
   ```

3. **Build and Test**
   ```bash
   pnpm build
   pnpm start  # Manual test
   ```

4. **Commit and Tag**
   ```bash
   git add .
   git commit -m "chore: release v1.1.0"
   git tag v1.1.0
   git push origin main --tags
   ```

5. **Publish to npm**
   ```bash
   npm publish
   ```

6. **Create GitHub Release**
   - Go to GitHub Releases
   - Create release from tag
   - Copy changelog entries
   - Publish release

---

## Additional Resources

### Documentation
- [Architecture Documentation](./ARCHITECTURE.md) - System design and diagrams
- [API Reference](./API_REFERENCE.md) - Complete API documentation
- [README](../README.md) - User-facing documentation

### External Resources
- [Model Context Protocol](https://modelcontextprotocol.io) - MCP specification
- [Claude Desktop](https://claude.ai/download) - Claude Desktop app
- [TypeScript Handbook](https://www.typescriptlang.org/docs/) - TypeScript docs
- [Conventional Commits](https://www.conventionalcommits.org/) - Commit guidelines

### Getting Help

- **Issues**: [GitHub Issues](https://github.com/loneexile/lmcp/issues)
- **Discussions**: [GitHub Discussions](https://github.com/loneexile/lmcp/discussions)
- **Email**: Contact the maintainer directly

---

## Recognition

Contributors will be recognized in:
- GitHub contributors page
- CONTRIBUTORS.md file (if you make significant contributions)
- Release notes

Thank you for contributing to LMCP! 🎉

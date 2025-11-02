# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.0] - 2025-01-15

### Added

- **Comprehensive Documentation** - Complete documentation suite in `/docs` directory
  - Architecture documentation with Mermaid diagrams
  - Complete API reference with examples
  - Contributing guide with coding standards
  - Quick reference guide for common tasks
  - Documentation index for easy navigation

- **JSDoc Comments** - Full inline documentation for all TypeScript modules
  - All functions documented with parameters, returns, and examples
  - Type definitions with property descriptions
  - Module-level documentation

- **GitHub Actions Workflows** - Automated CI/CD pipelines
  - CI workflow for testing on multiple Node.js versions
  - Automated release workflow on version tags
  - Automated npm publishing on releases

- **CHANGELOG.md** - Version history tracking

### Changed

- Updated package.json to include `docs` directory in published package
- Applied Node.js import protocol (`node:`) for built-in modules
- Improved code formatting consistency with Biome

### Improved

- Enhanced README with documentation section
- Better error messages and inline code comments

## [1.0.0] - 2024-01-15

### Added

- Initial release of LMCP (Lightweight MCP Manager)
- Interactive CLI for toggling MCP servers
- Preserve server configurations when disabling
- Color-coded status indicators
- Keyboard shortcuts for bulk operations
- Support for multiple MCP server configurations
- Configuration files:
  - `~/.claude.json` for active servers
  - `~/.lmcp.json` for disabled servers

### Features

- Toggle individual servers on/off
- Select/deselect all servers
- Invert current selection
- Graceful error handling
- User cancellation support (Ctrl+C)

---

[1.1.0]: https://github.com/loneexile/lmcp/compare/v1.0.0...v1.1.0
[1.0.0]: https://github.com/loneexile/lmcp/releases/tag/v1.0.0

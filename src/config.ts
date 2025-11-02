import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";
import type { ClaudeConfig } from "./types.js";

/** Path to Claude Desktop configuration file */
const CLAUDE_CONFIG_PATH = join(homedir(), ".claude.json");
/** Path to LMCP disabled servers configuration file */
const LMCP_CONFIG_PATH = join(homedir(), ".lmcp.json");

/**
 * Reads the Claude Desktop configuration file
 * @returns Parsed Claude configuration object, or empty object if file doesn't exist
 * @throws Logs error to console if parsing fails
 */
export function readClaudeConfig(): ClaudeConfig {
	try {
		if (!existsSync(CLAUDE_CONFIG_PATH)) {
			return {};
		}
		const content = readFileSync(CLAUDE_CONFIG_PATH, "utf-8");
		return JSON.parse(content);
	} catch (error) {
		console.error("Failed to read ~/.claude.json:", error);
		return {};
	}
}

/**
 * Reads the LMCP configuration file containing disabled servers
 * @returns Parsed LMCP configuration object, or empty object if file doesn't exist
 * @throws Logs error to console if parsing fails
 */
export function readLmcpConfig(): ClaudeConfig {
	try {
		if (!existsSync(LMCP_CONFIG_PATH)) {
			return {};
		}
		const content = readFileSync(LMCP_CONFIG_PATH, "utf-8");
		return JSON.parse(content);
	} catch (error) {
		console.error("Failed to read ~/.lmcp.json:", error);
		return {};
	}
}

/**
 * Writes configuration to the Claude Desktop configuration file
 * @param config - The configuration object to write
 * @throws Re-throws error after logging if write operation fails
 */
export function writeClaudeConfig(config: ClaudeConfig): void {
	try {
		writeFileSync(CLAUDE_CONFIG_PATH, JSON.stringify(config, null, 2));
	} catch (error) {
		console.error("Failed to write ~/.claude.json:", error);
		throw error;
	}
}

/**
 * Writes configuration to the LMCP configuration file
 * @param config - The configuration object to write
 * @throws Re-throws error after logging if write operation fails
 */
export function writeLmcpConfig(config: ClaudeConfig): void {
	try {
		writeFileSync(LMCP_CONFIG_PATH, JSON.stringify(config, null, 2));
	} catch (error) {
		console.error("Failed to write ~/.lmcp.json:", error);
		throw error;
	}
}

/**
 * Retrieves all MCP servers from both active and disabled configuration files
 * @returns Object containing active servers from ~/.claude.json and disabled servers from ~/.lmcp.json
 * @example
 * const { active, disabled } = getAllMcpServers();
 * console.log(`Found ${Object.keys(active).length} active servers`);
 */
export function getAllMcpServers(): {
	active: Record<string, any>;
	disabled: Record<string, any>;
} {
	const claudeConfig = readClaudeConfig();
	const lmcpConfig = readLmcpConfig();

	return {
		active: claudeConfig.mcpServers || {},
		disabled: lmcpConfig.mcpServers || {},
	};
}

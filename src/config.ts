import { existsSync, readFileSync, writeFileSync } from "fs";
import { homedir } from "os";
import { join } from "path";
import type { ClaudeConfig } from "./types.js";

const CLAUDE_CONFIG_PATH = join(homedir(), ".claude.json");
const LMCP_CONFIG_PATH = join(homedir(), ".lmcp.json");

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

export function writeClaudeConfig(config: ClaudeConfig): void {
	try {
		writeFileSync(CLAUDE_CONFIG_PATH, JSON.stringify(config, null, 2));
	} catch (error) {
		console.error("Failed to write ~/.claude.json:", error);
		throw error;
	}
}

export function writeLmcpConfig(config: ClaudeConfig): void {
	try {
		writeFileSync(LMCP_CONFIG_PATH, JSON.stringify(config, null, 2));
	} catch (error) {
		console.error("Failed to write ~/.lmcp.json:", error);
		throw error;
	}
}

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

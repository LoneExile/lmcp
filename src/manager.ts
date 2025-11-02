import chalk from "chalk";
import {
	getAllMcpServers,
	readClaudeConfig,
	readLmcpConfig,
	writeClaudeConfig,
	writeLmcpConfig,
} from "./config.js";

/**
 * Toggles MCP servers between active and disabled states
 *
 * This function redistributes servers between ~/.claude.json (active) and ~/.lmcp.json (disabled)
 * based on the user's selection. Selected servers are moved to active configuration, while
 * unselected servers are moved to disabled configuration.
 *
 * @param selectedServers - Array of server names that should be active
 * @throws Exits process with code 1 if configuration write fails
 *
 * @example
 * toggleMcpServers(['github', 'context7']);
 * // Enables 'github' and 'context7', disables all other servers
 */
export function toggleMcpServers(selectedServers: string[]): void {
	const { active, disabled } = getAllMcpServers();
	const claudeConfig = readClaudeConfig();
	const lmcpConfig = readLmcpConfig();

	// Initialize mcpServers if they don't exist
	if (!claudeConfig.mcpServers) {
		claudeConfig.mcpServers = {};
	}
	if (!lmcpConfig.mcpServers) {
		lmcpConfig.mcpServers = {};
	}

	const allServers = { ...active, ...disabled };
	const selectedSet = new Set(selectedServers);

	// Clear both configs' mcpServers
	claudeConfig.mcpServers = {};
	lmcpConfig.mcpServers = {};

	// Distribute servers based on selection
	for (const [serverName, serverConfig] of Object.entries(allServers)) {
		if (selectedSet.has(serverName)) {
			// Server should be active - move to ~/.claude.json
			claudeConfig.mcpServers[serverName] = serverConfig;
			console.log(chalk.green(`✓ Enabled: ${serverName}`));
		} else {
			// Server should be disabled - move to ~/.lmcp.json
			lmcpConfig.mcpServers[serverName] = serverConfig;
			console.log(chalk.red(`✗ Disabled: ${serverName}`));
		}
	}

	// Write updated configs
	try {
		writeClaudeConfig(claudeConfig);
		writeLmcpConfig(lmcpConfig);

		console.log();
		console.log(chalk.blue("Configuration updated successfully!"));
		console.log(
			chalk.gray(
				`Active servers: ${Object.keys(claudeConfig.mcpServers).length}`,
			),
		);
		console.log(
			chalk.gray(
				`Disabled servers: ${Object.keys(lmcpConfig.mcpServers).length}`,
			),
		);
	} catch (error) {
		console.error(chalk.red("Failed to save configuration:"), error);
		process.exit(1);
	}
}

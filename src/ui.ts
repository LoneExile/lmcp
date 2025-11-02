import { checkbox } from "@inquirer/prompts";
import chalk from "chalk";
import { getAllMcpServers } from "./config.js";
import type { ServerToggleItem } from "./types.js";

/**
 * Creates an array of server toggle items for the interactive UI
 *
 * Retrieves all servers from both active and disabled configurations,
 * formats them with appropriate status indicators and colors, and sorts alphabetically.
 *
 * @returns Array of ServerToggleItem objects ready for display in checkbox UI
 *
 * @example
 * const items = createServerToggleItems();
 * // Returns: [
 * //   { name: "✓ context7 (active)", value: "context7", checked: true },
 * //   { name: "✗ docker-mcp (disabled)", value: "docker-mcp", checked: false }
 * // ]
 */
export function createServerToggleItems(): ServerToggleItem[] {
	const { active, disabled } = getAllMcpServers();
	const items: ServerToggleItem[] = [];

	// Add active servers (checked by default)
	for (const [name] of Object.entries(active)) {
		items.push({
			name: `${chalk.green("✓")} ${name} ${chalk.gray("(active)")}`,
			value: name,
			checked: true,
		});
	}

	// Add disabled servers (unchecked by default)
	for (const [name] of Object.entries(disabled)) {
		items.push({
			name: `${chalk.red("✗")} ${name} ${chalk.gray("(disabled)")}`,
			value: name,
			checked: false,
		});
	}

	return items.sort((a, b) => a.value.localeCompare(b.value));
}

/**
 * Displays the interactive server toggle UI and returns user selection
 *
 * Shows a checkbox interface allowing users to select which MCP servers should be active.
 * If no servers are found, displays a warning message and returns empty array.
 *
 * @returns Promise resolving to array of selected server names
 * @throws May throw if user force-closes the prompt (Ctrl+C)
 *
 * @example
 * const selected = await showServerToggleUI();
 * console.log(`User selected: ${selected.join(', ')}`);
 */
export async function showServerToggleUI(): Promise<string[]> {
	const items = createServerToggleItems();

	if (items.length === 0) {
		console.log(
			chalk.yellow("No MCP servers found in ~/.claude.json or ~/.lmcp.json"),
		);
		return [];
	}

	console.log(chalk.blue("MCP Server Manager"));
	console.log(
		chalk.gray("Select which MCP servers should be active in Claude:"),
	);
	console.log();

	const selectedServers = await checkbox({
		message: "Toggle MCP servers (Press Ctrl+C to cancel):",
		choices: items,
		pageSize: 15,
	});

	return selectedServers;
}

#!/usr/bin/env node

import chalk from "chalk";
import { Command } from "commander";
import { toggleMcpServers } from "./manager.js";
import { showServerToggleUI } from "./ui.js";

const program = new Command();

program
	.name("lmcp")
	.description("Claude MCP Server Manager")
	.version("1.0.0")
	.action(async () => {
		try {
			const selectedServers = await showServerToggleUI();
			if (selectedServers.length >= 0) {
				toggleMcpServers(selectedServers);
			}
		} catch (error) {
			// Handle user cancellation (Ctrl+C)
			if (
				error instanceof Error &&
				error.message.includes("User force closed the prompt")
			) {
				console.log(chalk.yellow("\nCancelled"));
				process.exit(0);
			}

			console.error(chalk.red("Error:"), error);
			process.exit(1);
		}
	});

program.parse();

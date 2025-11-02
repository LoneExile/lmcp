#!/usr/bin/env node

/**
 * LMCP - Lightweight MCP Manager
 *
 * A CLI tool for managing Claude Desktop MCP (Model Context Protocol) servers.
 * Allows toggling servers between active and disabled states without losing configurations.
 *
 * @module lmcp
 * @see {@link https://github.com/loneexile/lmcp|GitHub Repository}
 * @see {@link https://modelcontextprotocol.io|Model Context Protocol}
 */

import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import chalk from "chalk";
import { Command } from "commander";
import { toggleMcpServers } from "./manager.js";
import { showServerToggleUI } from "./ui.js";

// Get package.json version
const __dirname = dirname(fileURLToPath(import.meta.url));
const packageJson = JSON.parse(
	readFileSync(join(__dirname, "../package.json"), "utf-8"),
);

const program = new Command();

program
	.name("lmcp")
	.description("Claude MCP Server Manager")
	.version(packageJson.version)
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

/**
 * Represents an MCP (Model Context Protocol) server configuration
 * @interface McpServer
 */
export interface McpServer {
	/** The command to execute for starting the MCP server */
	command: string;
	/** Optional arguments to pass to the server command */
	args?: string[];
	/** Optional environment variables for the server process */
	env?: Record<string, string>;
	/** Additional server configuration properties */
	[key: string]: any;
}

/**
 * Claude Desktop configuration structure
 * @interface ClaudeConfig
 */
export interface ClaudeConfig {
	/** Map of MCP server names to their configurations */
	mcpServers?: Record<string, McpServer>;
	/** Additional configuration properties */
	[key: string]: any;
}

/**
 * Represents a server item in the interactive toggle UI
 * @interface ServerToggleItem
 */
export interface ServerToggleItem {
	/** Display name with status indicators and styling */
	name: string;
	/** Actual server name value used for identification */
	value: string;
	/** Whether the server is currently selected/active */
	checked: boolean;
}

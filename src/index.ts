#!/usr/bin/env node
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  getProjectContextInput,
  getProjectContextHandler,
} from "./tools/getProjectContext.js";

const server = new McpServer({
  name: "context-builder",
  version: "1.0.0",
});

server.registerTool(
  "get_project_context",
  {
    description:
      "Get the project context from package.json, including dependencies, scripts, and other metadata.",
    inputSchema: getProjectContextInput,
  },
  getProjectContextHandler
);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.info("Context Builder MCP Server running on stdio");
}

main().catch((error) => {
  console.error("Fatal error in main():", error);
  process.exit(1);
});

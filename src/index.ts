import "dotenv/config";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  getProjectContextInput,
  getProjectContextHandler,
} from "./tools/getProjectContext.js";
import { getDocUrlInput, getDocUrlHandler } from "./tools/fetchDocs.js";

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

server.registerTool(
  "fetch_docs",
  {
    description:
      "Fetch documentation URLs for a list of packages using the AI client capabilities.",
    inputSchema: getDocUrlInput,
  },
  getDocUrlHandler
);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Context Builder MCP Server running on stdio");
}

main().catch((error) => {
  console.error("Fatal error in main():", error);
  process.exit(1);
});

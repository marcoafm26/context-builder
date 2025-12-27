import "dotenv/config";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { getProjectContextInput, getProjectContextHandler, } from "./tools/getProjectContext.js";
import { getDocUrlInput, getDocUrlHandler } from "./tools/fetchDocs.js";
import { readDocsInput, readDocsHandler } from "./tools/readDocs.js";
import { createAgentContextInput, createAgentContextHandler, } from "./tools/createAgentContext.js";
import { generateAgentContextInput, generateAgentContextHandler, } from "./prompts/generateAgentContext.js";
import { instructionsMetadata, instructionsHandler, } from "./resources/instructions.js";
const server = new McpServer({
    name: "context-builder",
    version: "1.0.0",
});
server.registerTool("get_project_context", {
    description: "Get the project context from package.json, including dependencies, scripts, and other metadata. NOTE: For a complete automated workflow, it is recommended to use the 'generate-agent-context' prompt first.",
    inputSchema: getProjectContextInput,
}, getProjectContextHandler);
server.registerTool("fetch_docs", {
    description: "Fetch documentation URLs for a list of packages using the AI client capabilities. NOTE: For a complete automated workflow, it is recommended to use the 'generate-agent-context' prompt first.",
    inputSchema: getDocUrlInput,
}, getDocUrlHandler);
server.registerTool("read_docs", {
    description: "Read the content of a documentation page from a URL. NOTE: For a complete automated workflow, it is recommended to use the 'generate-agent-context' prompt first.",
    inputSchema: readDocsInput,
}, readDocsHandler);
server.registerTool("create_agent_context", {
    description: "Create an AGENTS.md file with the provided context content. NOTE: For a complete automated workflow, it is recommended to use the 'generate-agent-context' prompt first.",
    inputSchema: createAgentContextInput,
}, createAgentContextHandler);
// --- MCP Prompts ---
server.registerPrompt("generate-agent-context", generateAgentContextInput, generateAgentContextHandler);
// --- MCP Resources ---
server.registerResource("instructions", "resource://instructions", instructionsMetadata, instructionsHandler);
async function main() {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error("Context Builder MCP Server running on stdio");
}
main().catch((error) => {
    console.error("Fatal error in main():", error);
    process.exit(1);
});

import { z } from "zod";
import { GetPromptResult } from "@modelcontextprotocol/sdk/types.js";

export const generateAgentContextInput = {
  title: "Generate Agent Context",
  description:
    "Guides the AI through generating a comprehensive AGENTS.md file by reading documentation.",
  argsSchema: {
    projectName: z.string().optional().describe("The name of the project."),
  },
};

export const generateAgentContextHandler = (args: {
  projectName?: string;
}): GetPromptResult => ({
  title: "generate-agent-context",
  description:
    "Guides the AI through generating a comprehensive AGENTS.md file by reading documentation.",
  messages: [
    {
      role: "user",
      content: {
        type: "text",
        text: `You are a context-building agent for the project ${
          args.projectName || "at the current directory"
        }.
      
Your goal is to generate a comprehensive 'AGENTS.md' file that helps other AI agents understand this codebase.

Please follow these steps:
1. Call 'get_project_context' to identify dependencies, scripts and which node package manager is being used.
2. For the most critical dependencies, call 'fetch_docs' to find official documentation URLs.
3. For each URL found, call 'read_docs' to ingest essential technical details.
4. Write a complete 'AGENTS.md' file including:
   - Project Name & Version.
High-level purpose.
   - Critical dependencies and their core patterns (based on the documentation you read). Like new features of the current version, good practices that you found on the internet and documentation. The goal is to help other AI agents understand this codebase.
   - Important scripts and how to use them (include the command to run them and some examples) using the package manager that was identified in the 'get_project_context' step.
   - Any "Gotchas" or specific instructions for AI agents. Details are appreciated.
5. Finally, call 'create_agent_context' with the consolidated markdown content.

Please start by calling 'get_project_context'.`,
      },
    },
  ],
});

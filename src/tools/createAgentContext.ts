import { z } from "zod";
import { CallToolResult } from "@modelcontextprotocol/sdk/types.js";
import fs from "fs/promises";
import path from "path";

export const createAgentContextInput = {
  content: z
    .string()
    .describe("The full markdown content for the AGENTS.md file."),
  targetPath: z
    .string()
    .optional()
    .describe(
      "Optional path where to save AGENTS.md (defaults to current directory)."
    ),
};

export const createAgentContextHandler = async (args: {
  content: string;
  targetPath?: string;
}): Promise<CallToolResult> => {
  try {
    const filename = "AGENTS.md";
    const fullPath = args.targetPath
      ? path.join(args.targetPath, filename)
      : filename;

    await fs.writeFile(fullPath, args.content, "utf-8");

    return {
      content: [
        {
          type: "text",
          text: `Successfully created ${fullPath}`,
        },
      ],
    };
  } catch (error: any) {
    return {
      content: [
        {
          type: "text",
          text: `Error creating AGENTS.md: ${error.message}`,
        },
      ],
      isError: true,
    };
  }
};

import { z } from "zod";
import fs from "fs/promises";
import path from "path";
import { CallToolResult } from "@modelcontextprotocol/sdk/types.js";

export const getProjectContextInput = {
  projectPath: z
    .string()
    .optional()
    .describe(
      "Path to the project root (optional, defaults to current working directory)."
    ),
};

export async function getProjectContextHandler(args: {
  projectPath?: string;
}): Promise<CallToolResult> {
  const projectPath = args.projectPath || process.cwd();
  const packageJsonPath = path.join(projectPath, "package.json");

  try {
    const fileContent = await fs.readFile(packageJsonPath, "utf-8");
    const packageJson = JSON.parse(fileContent);

    // Extract relevant fields
    const context = {
      name: packageJson.name,
      version: packageJson.version,
      description: packageJson.description,
      packageManager: packageJson.packageManager,
      dependencies: packageJson.dependencies || {},
      devDependencies: packageJson.devDependencies || {},
      scripts: packageJson.scripts || {},
      engines: packageJson.engines || {},
    };

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(context, null, 2),
          annotations: {
            audience: ["assistant"],
          },
        },
      ],
    };
  } catch (error: any) {
    throw new Error(`Failed to read package.json: ${error.message}`);
  }
}

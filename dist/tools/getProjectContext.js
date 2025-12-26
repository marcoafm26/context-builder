import { z } from "zod";
import fs from "fs/promises";
import path from "path";
export const getProjectContextInput = {
    projectPath: z
        .string()
        .optional()
        .describe("Path to the project root (optional, defaults to current working directory)."),
};
export async function getProjectContextHandler(args) {
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
    }
    catch (error) {
        throw new Error(`Failed to read package.json: ${error.message}`);
    }
}

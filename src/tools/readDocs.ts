import { z } from "zod";
import { CallToolResult } from "@modelcontextprotocol/sdk/types.js";

export const readDocsInput = {
  url: z.url().describe("The URL of the documentation to read."),
};

export const readDocsHandler = async (args: {
  url: string;
}): Promise<CallToolResult> => {
  try {
    const response = await fetch(args.url);

    if (!response.ok) {
      throw new Error(`Failed to fetch ${args.url}: ${response.statusText}`);
    }

    const text = await response.text();

    return {
      content: [
        {
          type: "text",
          text: text,
        },
      ],
    };
  } catch (error: any) {
    return {
      content: [
        {
          type: "text",
          text: `Error reading docs from ${args.url}: ${error.message}`,
        },
      ],
      isError: true,
    };
  }
};

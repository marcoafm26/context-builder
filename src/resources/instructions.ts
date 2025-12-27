import { generateAgentContextHandler } from "../prompts/generateAgentContext.js";

export const instructionsMetadata = {
  title: "Server Usage Instructions",
  description: "Crucial instructions on how to use this server effectively.",
};

export const instructionsHandler = async () => ({
  contents: [
    {
      uri: "resource://instructions",
      text: `This server is designed to work as a sequence. To generate a project context, you SHOULD always start by calling the 'generate-agent-context' prompt. Do not call tools individually unless you are performing a manual update or exploring a specific dependency. On going to create the AGENT.md file, insures to use this text: ${JSON.stringify(
        generateAgentContextHandler({})
      )}`,
    },
  ],
});

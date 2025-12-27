# @mabysz/context-builder

**Context Builder** is a Model Context Protocol (MCP) server designed to help AI agents understand your codebase. It automates the process of gathering project metadata, identifying dependencies, fetching official documentation, and generating a comprehensive `AGENTS.md` context file.

This tool is essential for developers who want to give their AI assistants (like Claude, Cursor, or others) deep, accurate knowledge about the specific libraries and tools used in their project, without manual copy-pasting.

## Purpose

The main goal of this MCP server is to bridge the gap between your code and your AI assistant's knowledge base. By generating an `AGENTS.md` file, you provide a standardized "map" of your project that includes:

- **Project Structure**: Name, version, scripts, and package manager details.
- **Dependency Insights**: Validated official documentation URLs for your specific dependencies.
- **Key Concepts**: Critical information extracted directly from documentation to help the AI write better code.

## Prerequisites

This server uses Google's Gemini 2.5 Flash model to intelligently find and summarize documentation. You must have a Gemini API key.

- **Get an API Key**: [Google AI Studio](https://aistudio.google.com/)
- **Environment Variable**: `GEMINI_API_KEY`

## Usage with NPX

You can run this MCP server directly using `npx`. This is the recommended way to use it in your MCP client configuration.

### Cloud / Generic MCP Configuration

Add the following to your MCP settings file (e.g., `claude_desktop_config.json`):

```json
{
  "mcpServers": {
    "context-builder": {
      "command": "npx",
      "args": ["-y", "@mabysz/context-builder"],
      "env": {
        "GEMINI_API_KEY": "your_actual_api_key_here"
      }
    }
  }
}
```

## Tools

This server provides the following tools to your AI assistant:

### 1. `get_project_context`

- **Description**: Analyzes the `package.json` in your current directory.
- **What it does**: Returns the project name, version, dependencies, devDependencies, scripts, and package manager (npm/pnpm/yarn).

### 2. `fetch_docs`

- **Description**: Finds official documentation URLs for a list of package names.
- **What it does**: Uses Google's Gemini AI to intelligently search and return the most relevant documentation URL for each package (e.g., finding the exact documentation site for `zod` or `@modelcontextprotocol/sdk`).

### 3. `read_docs`

- **Description**: Reads and retrieves the content of a documentation page.
- **What it does**: Fetches the HTML/Text content from a given URL so the AI can learn from it.

### 4. `create_agent_context`

- **Description**: Writes the `AGENTS.md` file.
- **What it does**: Saves the consolidated context information to a file named `AGENTS.md` in your project root.

## Recommended Workflow

The most powerful way to use this server is through its **Prompts** or just type 'Help me create a AGENTS.md file' and let the AI do the rest.

### `generate-agent-context`

This prompt orchestrates the entire workflow. When you select this prompt in your AI client, it will successfully guide the AI to:

1.  Read your project context.
2.  Identify key dependencies.
3.  Fetch and read their documentation.
4.  Generate and save the `AGENTS.md` file.

**License**: ISC

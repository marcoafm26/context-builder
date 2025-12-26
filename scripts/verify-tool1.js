import { spawn } from "child_process";
import path from "path";

const serverProcess = spawn("node", ["dist/index.js"], {
  stdio: ["pipe", "pipe", "inherit"],
});

const request = {
  jsonrpc: "2.0",
  id: 1,
  method: "tools/call",
  params: {
    name: "get_project_context",
    arguments: {
      projectPath: process.cwd(),
    },
  },
};

serverProcess.stdin.write(JSON.stringify(request) + "\n");

serverProcess.stdout.on("data", (data) => {
  const response = JSON.parse(data.toString());
  console.log("Response received:");
  console.log(JSON.stringify(response));

  // Basic validation
  if (response.result && response.result.content) {
    const content = JSON.parse(response.result.content[0].text);
    if (content.name === "context-builder") {
      console.log("SUCCESS: Correctly retrieved package.json context");
      process.exit(0);
    }
  }

  console.error("FAILURE: Unexpected response");
  process.exit(1);
});

serverProcess.on("error", (err) => {
  console.error("Server error:", err);
  process.exit(1);
});

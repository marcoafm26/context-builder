import { spawn } from "child_process";

const serverProcess = spawn("node", ["dist/index.js"], {
  stdio: ["pipe", "pipe", "inherit"],
});

const request = {
  jsonrpc: "2.0",
  id: 1,
  method: "tools/call",
  params: {
    name: "fetch_docs",
    arguments: {
      packageNames: ["react", "typescript"],
    },
  },
};

serverProcess.stdout.on("data", (data) => {
  const messages = data.toString().split("\n").filter(Boolean);

  for (const msgStr of messages) {
    try {
      const msg = JSON.parse(msgStr);

      // Handle Sampling Request from Server
      if (msg.method === "sampling/createMessage") {
        console.log(
          "Received sampling request:",
          msg.params.messages[0].content.text
        );

        const response = {
          jsonrpc: "2.0",
          id: msg.id,
          result: {
            role: "assistant",
            content: {
              type: "text",
              text: `https://example.com/docs/${
                msg.params.messages[0].content.text.includes("react")
                  ? "react"
                  : "typescript"
              }`,
            },
            model: "test-model",
          },
        };
        serverProcess.stdin.write(JSON.stringify(response) + "\n");
      }
      // Handle Final Tool Result
      else if (msg.id === 1 && msg.result) {
        console.log("Final Tool Result:");
        console.log(JSON.stringify(msg.result, null, 2));
        process.exit(0);
      }
    } catch (e) {
      // Ignore partial chunks
    }
  }
});

serverProcess.stdin.write(JSON.stringify(request) + "\n");

serverProcess.on("error", (err) => {
  console.error("Server error:", err);
  process.exit(1);
});

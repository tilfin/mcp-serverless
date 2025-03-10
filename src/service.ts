import { InMemoryTransport } from "@modelcontextprotocol/sdk/inMemory.js";
import { Client } from "./client.js";
import { createServer } from "./server.js";
import type { ToolManager } from "./tool-manager.js";

export function createService(toolAggregator: ToolManager): Client {
  const server = createServer(
    {
      name: "MCP Serverless",
      version: "1.0.0",
    },
    toolAggregator,
  );

  const client = new Client({
    name: "MCP Serverless",
    version: "1.0.0",
  });

  const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair();
  client.connect(clientTransport);
  server.connect(serverTransport);

  return client;
}

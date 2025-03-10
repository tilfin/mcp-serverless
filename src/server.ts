import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { type Implementation, ListToolsRequestSchema } from "@modelcontextprotocol/sdk/types.js";
import { CallToolRequestWithContextSchema } from "./schema.js";
import type { ToolManager } from "./tool-manager.js";

export function createServer(serverInfo: Implementation, toolAggregator: ToolManager): Server {
  const server = new Server(serverInfo, {
    capabilities: {
      tools: {},
    },
  });

  server.setRequestHandler(ListToolsRequestSchema, () => toolAggregator.listToolsRequestHandler());
  server.setRequestHandler(CallToolRequestWithContextSchema, (req) => toolAggregator.callToolRequestHandler(req));

  return server;
}

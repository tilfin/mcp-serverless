import type { CallToolRequest, CallToolResult, ListToolsResult } from "@modelcontextprotocol/sdk/types.js";
import type { CallToolRequestParamsWithContext, Tool, Tools } from "./types.js";

export class ToolManager {
  #toolMap: Map<string, Tool>;
  #toolListCache: Tools | null = null;

  constructor() {
    this.#toolMap = new Map<string, Tool>();
  }

  registerTools(tools: Tool[]) {
    for (const tool of tools) {
      this.#toolMap.set(tool.name, tool);
    }
    this.#toolListCache = null;
  }

  async listToolsRequestHandler(): Promise<ListToolsResult> {
    if (this.#toolListCache) {
      return { tools: this.#toolListCache };
    }

    const tools: Tools = [];
    for (const tool of this.#toolMap.values()) {
      tools.push({
        name: tool.name,
        description: tool.description,
        inputSchema: tool.inputSchema,
      });
    }
    this.#toolListCache = tools;
    return { tools };
  }

  async callToolRequestHandler(req: CallToolRequest): Promise<CallToolResult> {
    const tool = this.#toolMap.get(req.params.name);
    if (!tool) {
      throw new Error(`Tool not found: ${req.params.name}`);
    }
    const { ctx = {}, ...restParams } = req.params as CallToolRequestParamsWithContext;
    const content = await tool.toolFunction(restParams.arguments ?? {}, ctx);
    return { content };
  }
}

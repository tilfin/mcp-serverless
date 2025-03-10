import { Client as OrginalClient } from "@modelcontextprotocol/sdk/client/index.js";
import type { RequestOptions } from "@modelcontextprotocol/sdk/shared/protocol.js";
import { CallToolResultSchema, type CompatibilityCallToolResultSchema } from "@modelcontextprotocol/sdk/types.js";
import type { CallToolRequestContext, CallToolRequestParamsWithContext } from "./types";

export interface RequestOptionWithContext extends RequestOptions {
  ctx?: CallToolRequestContext;
}

export class Client extends OrginalClient {
  async callTool(
    params: CallToolRequestParamsWithContext,
    resultSchema: typeof CallToolResultSchema | typeof CompatibilityCallToolResultSchema = CallToolResultSchema,
    options?: RequestOptionWithContext,
  ) {
    return this.request({ method: "tools/call", params }, resultSchema, options);
  }
}

import type { CallToolRequest, CallToolResult, ListToolsResult, ToolSchema } from "@modelcontextprotocol/sdk/types.js";
import type { z } from "zod";

export type Tools = ListToolsResult["tools"];

export type CallToolRequestHandler = (req: CallToolRequest) => Promise<CallToolResult>;
export interface CallToolRequestContext extends Record<string, unknown> {}
export type CallToolRequestParams = CallToolRequest["params"];

export interface CallToolRequestParamsWithContext extends CallToolRequestParams {
  ctx?: CallToolRequestContext;
}

export type CallToolRequestArguments = Exclude<CallToolRequestParams["arguments"], undefined>;
export type CallToolResultContent = CallToolResult["content"];

export type ToolInput = z.infer<typeof ToolSchema.shape.inputSchema>;
export type ToolFunction = (
  args: CallToolRequestArguments,
  ctx: CallToolRequestContext,
) => Promise<CallToolResultContent>;

export interface Tool {
  name: string;
  description: string;
  inputSchema: ToolInput;
  toolFunction: ToolFunction;
}

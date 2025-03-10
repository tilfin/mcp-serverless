import { CallToolRequestSchema } from "@modelcontextprotocol/sdk/types.js";
import { z } from "zod";

export const CallToolRequestWithContextSchema = CallToolRequestSchema.extend({
  ctx: z.record(z.string(), z.any()).optional(),
});

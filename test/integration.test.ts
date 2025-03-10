import assert from "node:assert";
import { describe, test } from "node:test";
import { createService } from "../src/service.js";
import { ToolManager } from "../src/tool-manager.js";
import type { CallToolRequestArguments, CallToolRequestContext } from "../src/types.js";

describe("Serverless Client Integration", () => {
  test("Client should be able to register, list, and call tools", async () => {
    const toolManager = new ToolManager();
    toolManager.registerTools([
      {
        name: "calculator",
        description: "Performs basic arithmetic operations",
        inputSchema: {
          type: "object",
          properties: {
            operation: { type: "string" },
            numbers: { type: "array", items: { type: "number" } },
          },
          required: ["operation", "numbers"],
        },
        toolFunction: async (args: CallToolRequestArguments) => {
          let result = 0;
          if (args?.operation === "add" && Array.isArray(args.numbers)) {
            result = args.numbers.reduce((sum, n) => sum + n, 0);
          }
          return [{ type: "text", text: result.toString() }];
        },
      },
    ]);

    const client = createService(toolManager);

    const { tools } = await client.listTools();
    assert(Array.isArray(tools), "listTools should return tools array");
    assert.deepStrictEqual(tools[0], {
      name: "calculator",
      description: "Performs basic arithmetic operations",
      inputSchema: {
        type: "object",
        properties: {
          operation: { type: "string" },
          numbers: { type: "array", items: { type: "number" } },
        },
        required: ["operation", "numbers"],
      },
    });

    const { content } = await client.callTool({
      name: "calculator",
      arguments: {
        operation: "add",
        numbers: [1, 2, 3, 4],
      },
    });
    assert(Array.isArray(content), "callTool should return content array");
    assert.deepStrictEqual(content[0], { type: "text", text: "10" });
  });

  test("Client's requesting with context, server should receive the context", async () => {
    let receivedContext: CallToolRequestContext | undefined = undefined;

    const toolManager = new ToolManager();
    toolManager.registerTools([
      {
        name: "context",
        description: "Returns the context",
        inputSchema: {
          type: "object",
          properties: {
            foo: { type: "string" },
          },
          required: ["foo"],
        },
        toolFunction: async (args: CallToolRequestArguments, ctx: CallToolRequestContext) => {
          receivedContext = ctx;
          return [{ type: "text", text: args.foo as string }];
        },
      },
    ]);

    const client = createService(toolManager);

    const { content: ctn1 } = await client.callTool({
      name: "context",
      arguments: {
        foo: "arg_foo_val1",
      },
      ctx: { apiKey: "xyz" },
    });
    assert(Array.isArray(ctn1), "callTool should return content array");
    assert.deepStrictEqual(ctn1[0], { type: "text", text: "arg_foo_val1" });
    assert.deepStrictEqual(receivedContext, { apiKey: "xyz" });

    const { content: ctn2 } = await client.callTool({
      name: "context",
      arguments: {
        foo: "arg_foo_val2",
      },
      ctx: { clientId: "client_id", clientSecret: "secret" },
    });
    assert(Array.isArray(ctn2), "callTool should return content array");
    assert.deepStrictEqual(ctn2[0], { type: "text", text: "arg_foo_val2" });
    assert.deepStrictEqual(receivedContext, { clientId: "client_id", clientSecret: "secret" });
  });
});

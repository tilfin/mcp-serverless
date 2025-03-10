#!/usr/bin/env node

import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { createServer, ToolManager } from '../dist/index.js';

// Create a tool manager
const toolManager = new ToolManager();

// Register tools
toolManager.registerTools([
  {
    name: 'calculator',
    description: 'Performs basic arithmetic operations',
    inputSchema: {
      type: 'object',
      properties: {
        operation: { type: "string" },
        numbers: { type: "array", items: { type: "number" } },
      },
      required: ['operation', 'numbers']
    },
    toolFunction: async (params, ctx) => {
      if (ctx.apiKey !== 'xyz') throw new Error('Invalid API Key');

      let result;
      if (params.operation === 'add') {
        result = params.numbers.reduce((sum, n) => sum + n, 0);
      }
      return [{ type: 'text', text: result.toString() }];
    }
  }
]);

// Create a serverless client
const server = createServer({
  name: 'MyServer',
  version: '1.0.0',
}, toolManager);

// Start the server
await server.connect(new StdioServerTransport());

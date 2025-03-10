import { createService, ToolManager } from '../dist/index.js';

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
const client = createService(toolManager);

// List available tools
const toolsList = await client.listTools();
console.dir(toolsList, { depth: 6 });

// Call a tool without context
try {
  await client.callTool({
    name: 'calculator',
    arguments: {
      operation: 'add',
      numbers: [1, 2, 3]
    }
  });
} catch (err) {
  // raise Invalid API key error
  console.error(err.message);
}

// Call a tool with context
const result2 = await client.callTool({
  name: 'calculator',
  arguments: {
    operation: 'add',
    numbers: [1, 2, 3]
  },
  ctx: { apiKey: 'xyz' }
});
console.log('Result:', result2.content[0].text);

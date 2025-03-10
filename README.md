# MCP Serverless

A serverless implementation for the Model Context Protocol (MCP) architecture that enables tool management through a clean interface.

## Overview

This package provides a serverless implementation of the MCP server that allows you to:
- Register and manage tools
- Handle tool-related requests
- Create in-memory client-server connections
- Extend request with context to enable credential transmission from clients

## Installation

```bash
npm install @tilfin/mcp-serverless
```

## Usage

### Tool Registration and create a client for service implements

```typescript
import { createService, ToolManager } from '@tilfin/mcp-serverless';

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
        operation: { type: 'string' },
        numbers: { type: 'array', items: { type: 'number' } }
      },
      required: ['operation', 'numbers']
    },
    toolFunction: async (params, ctx) => {
      if (ctx.apiKey !== 'xyz') throw new Error('Invalid API Key');

      let result;
      if (params.operation === 'add') {
        result = params.numbers.reduce((sum, n) => sum + n, 0);
      }
      return { result };
    }
  }
]);

// Create a serverless client
const client = createService(toolManager);

// List available tools
const toolsList = await client.listTools();

// Call a tool
try {
  const result = await client.callTool({
    name: 'calculator',
    arguments: {
      operation: 'add',
      numbers: [1, 2, 3]
    }
  });
} catch (err) {
  // raise Invalid API Key error
}

// Call a tool with context
const result = await client.callTool({
  name: 'calculator',
  arguments: {
    operation: 'add',
    numbers: [1, 2, 3]
  },
  ctx: { apiKey: 'xyz' }
});
```

## API Reference

### `ToolManager` class

Manages the registration and handling of tools.

### `Tool` Interface

Tools must implement the following interface:

```typescript
interface Tool {
  name: string;
  description: string;
  inputSchema: ToolInput;
  toolFunction: (args: CallToolRequestArguments, ctx: CallToolRequestContext) => Promise<CallToolResultContent>;
}
```

### `createServer(serverInfo, toolManager)`

Creates an MCP server with the given tool manager.

### `createService(toolManager)`

Creates an in-memory client-server setup for serverless operation.

## Examples

### Standard I/O Transport

The package includes examples for using the stdio transports for both client and server communication:

- `StdioClientTransport`: Allows clients to communicate with servers over standard input/output
- `StdioServerTransport`: Enables servers to handle requests through standard input/output

Check out the example implementation:
- Client: [stdio_client.mjs](./example/stdio_client.mjs)
- Server: [stdio_server.mjs](./example/stdio_server.mjs)

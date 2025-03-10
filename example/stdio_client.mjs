#!/usr/bin/env node

import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
import { Client } from '../dist/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const client = new Client({
  name: 'MyClient',
  version: '1.0.0',
});

await client.connect(new StdioClientTransport({
  command: path.resolve(__dirname, "./stdio_server.mjs"),
}));

const { tools } = await client.listTools();
console.info('Available tools:', tools);

try {
  await client.callTool({
    name: 'calculator',
    arguments: {
      operation: 'add',
      numbers: [1, 2, 3]
    }
  });
} catch (err) {
  console.error('Failed to call tool:', err.message);
}

const result2 = await client.callTool({
  name: 'calculator',
  arguments: {
    operation: 'add',
    numbers: [1, 2, 3]
  },
  ctx: { apiKey: 'xyz' }
});
console.info('Result:', result2.content[0].text);

await client.close();

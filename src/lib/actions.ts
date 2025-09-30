'use server';

import vm from 'node:vm';
import db from './db';
import { format } from 'util';

// We don't have a real elasticsearch client, so we'll mock one for the script context
const elasticsearch = {
  search: async (params: any) => {
    console.log('Mock Elasticsearch search with params:', params);
    return {
      hits: {
        total: {
          value: Math.floor(Math.random() * 100),
          relation: 'eq'
        },
        hits: []
      }
    };
  }
};

async function executeScript(
  code: string,
  functionName: string,
  functionArgs: any[],
  expectedReturnType?: 'boolean' | 'void'
): Promise<{ result: any; logs: string[]; error?: string }> {
  const logs: string[] = [];
  
  const customConsole = {
    log: (...args: any[]) => {
      logs.push(format(...args));
      console.log(...args); // Also log to the server console
    },
    error: (...args: any[]) => {
      logs.push(`ERROR: ${format(...args)}`);
      console.error(...args);
    },
    warn: (...args: any[]) => {
      logs.push(`WARN: ${format(...args)}`);
      console.warn(...args);
    },
  };

  const context = {
    db,
    elasticsearch,
    console: customConsole,
    fetch, // Expose fetch for custom webhooks
    setTimeout,
    setInterval,
    clearTimeout,
    clearInterval,
    Promise,
    ...functionArgs.reduce((acc, arg, i) => ({ ...acc, [`arg${i}`]: arg }), {}),
  };
  vm.createContext(context);
  
  const script = new vm.Script(`
    (async () => {
      ${code}
      if (typeof ${functionName} === 'function') {
        const ${functionName}Fn = ${functionName};
        // Redefine the function in the script to accept the context arguments
        const redefinedFn = new Function(...${JSON.stringify(functionArgs.map((_,i) => `arg${i}`))}, \`return (${functionName.toString()})(...arguments)\`);
        return await redefinedFn(...${JSON.stringify(functionArgs.map((_,i) => `arg${i}`))});
      }
      throw new Error('${functionName} function not found in script.');
    })();
  `);

  try {
    const result = await script.runInContext(context, { timeout: 5000 });
    
    if (expectedReturnType === 'boolean' && typeof result !== 'boolean') {
      throw new Error(`Script \`${functionName}\` function must return a boolean.`);
    }

    return { result, logs };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown execution error occurred.';
    console.error('Script execution failed:', error);
    return { result: null, error: errorMessage, logs };
  }
}


export async function executeTestScript(code: string): Promise<{ triggered: boolean, error?: string, logs: string[] }> {
    const { result, logs, error } = await executeScript(code, 'runCheck', [], 'boolean');
    return { triggered: result === true, logs, error };
}

export async function executeWebhookTestScript(code: string): Promise<{ success: boolean; error?: string; logs: string[] }> {
    const mockAlertData = {
        monitorName: 'Test Monitor',
        message: 'This is a test alert message.',
        timestamp: new Date().toISOString(),
    };
    const { logs, error } = await executeScript(code, 'sendNotification', [mockAlertData], 'void');
    return { success: !error, logs, error };
}
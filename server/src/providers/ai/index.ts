import { AIProvider } from './types';
import { MockAIProvider } from './mockProvider';
import { DeepSeekAdapter } from './deepSeekAdapter';
import { env } from '../../config/env';

let providerInstance: AIProvider | null = null;

export const getAIProvider = (): AIProvider => {
  if (providerInstance) {
    return providerInstance;
  }

  if (env?.AI_PROVIDER === 'deepseek' && env?.DEEPSEEK_API_KEY) {
    console.log('🤖 Initializing DeepSeek AI Provider adapter');
    providerInstance = new DeepSeekAdapter();
  } else {
    console.log('🤖 Initializing Mock AI Provider (local development mode)');
    providerInstance = new MockAIProvider();
  }

  return providerInstance;
};

export * from './types';
export * from './mockProvider';
export * from './deepSeekAdapter';

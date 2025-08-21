// React Query Client Configuration

import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 2,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

// Query Keys
export const QUERY_KEYS = {
  HEALTH: ['health'],
  ETH_PRICE: ['oracle', 'eth-price'],
  BTC_PRICE: ['oracle', 'btc-price'],
  WEATHER: (city: string) => ['oracle', 'weather', city],
  SPACE_DATA: (date: string) => ['oracle', 'space', date],
  AI_INFERENCE: (prompt: string) => ['ai', 'inference', prompt],
} as const;
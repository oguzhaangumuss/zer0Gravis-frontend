// Custom hooks for ZeroGravis API

import { useQuery, useMutation } from '@tanstack/react-query';
import { ZeroGravisAPI } from '@/lib/api';
import { QUERY_KEYS } from '@/lib/query-client';
import type { ComputeInferenceRequest } from '@/types/api';

// Health Check Hook
export function useHealth() {
  return useQuery({
    queryKey: QUERY_KEYS.HEALTH,
    queryFn: ZeroGravisAPI.getHealth,
    refetchInterval: 30000, // Refetch every 30 seconds
  });
}

// Oracle Price Feeds
export function useETHPrice() {
  return useQuery({
    queryKey: QUERY_KEYS.ETH_PRICE,
    queryFn: ZeroGravisAPI.getETHPrice,
    refetchInterval: 10000, // Refetch every 10 seconds
  });
}

export function useBTCPrice() {
  return useQuery({
    queryKey: QUERY_KEYS.BTC_PRICE,
    queryFn: ZeroGravisAPI.getBTCPrice,
    refetchInterval: 10000, // Refetch every 10 seconds
  });
}

// Weather Data Hook
export function useWeatherData(city: string, enabled: boolean = true) {
  return useQuery({
    queryKey: QUERY_KEYS.WEATHER(city),
    queryFn: () => ZeroGravisAPI.getWeatherData(city),
    enabled: enabled && !!city,
    refetchInterval: 300000, // Refetch every 5 minutes
  });
}

// Space Data Hook
export function useSpaceData(date: string, enabled: boolean = true) {
  return useQuery({
    queryKey: QUERY_KEYS.SPACE_DATA(date),
    queryFn: () => ZeroGravisAPI.getSpaceData(date),
    enabled: enabled && !!date,
    staleTime: 60 * 60 * 1000, // 1 hour stale time
  });
}

// AI Inference Mutation
export function useAIInference() {
  return useMutation({
    mutationFn: (request: ComputeInferenceRequest) => 
      ZeroGravisAPI.runAIInference(request),
  });
}

// Convenient AI Hook
export function useAskAI() {
  return useMutation({
    mutationFn: ({ prompt, maxTokens = 150 }: { prompt: string; maxTokens?: number }) =>
      ZeroGravisAPI.askAI(prompt, maxTokens),
  });
}
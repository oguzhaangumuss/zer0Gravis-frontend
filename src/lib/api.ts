// ZeroGravis API Client - Backend Integration

import axios from 'axios';
import type {
  ApiResponse,
  OracleCollectRequest,
  AggregatedOracleData,
  ComputeInferenceRequest,
  ComputeInferenceResult,
  HealthStatus
} from '@/types/api';

// API Configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

export class ZeroGravisAPI {
  // Health Check
  static async getHealth(): Promise<HealthStatus> {
    const response = await apiClient.get<HealthStatus>('/health');
    return response.data;
  }

  // Oracle APIs
  static async collectOracleData(request: OracleCollectRequest): Promise<ApiResponse<AggregatedOracleData>> {
    const response = await apiClient.post<ApiResponse<AggregatedOracleData>>(
      '/api/v1/oracle/collect',
      request
    );
    return response.data;
  }

  // Convenient Oracle Methods
  static async getETHPrice(): Promise<ApiResponse<AggregatedOracleData>> {
    return this.collectOracleData({
      sources: ['chainlink'],
      dataType: 'price_feed' as any,
      parameters: {
        symbol: 'ETH/USD'
      }
    });
  }

  static async getBTCPrice(): Promise<ApiResponse<AggregatedOracleData>> {
    return this.collectOracleData({
      sources: ['chainlink'],
      dataType: 'price_feed' as any,
      parameters: {
        symbol: 'BTC/USD'
      }
    });
  }

  static async getWeatherData(city: string): Promise<ApiResponse<AggregatedOracleData>> {
    return this.collectOracleData({
      sources: ['weather'],
      dataType: 'weather' as any,
      parameters: {
        city
      }
    });
  }

  static async getSpaceData(date: string): Promise<ApiResponse<AggregatedOracleData>> {
    return this.collectOracleData({
      sources: ['nasa'],
      dataType: 'space' as any,
      parameters: {
        spaceDataType: 'asteroid',
        date
      }
    });
  }

  // 0G Compute AI
  static async runAIInference(request: ComputeInferenceRequest): Promise<ApiResponse<ComputeInferenceResult>> {
    const response = await apiClient.post<ApiResponse<ComputeInferenceResult>>(
      '/api/v1/compute/inference',
      request
    );
    return response.data;
  }

  // Convenient AI Methods
  static async askAI(prompt: string, maxTokens: number = 150): Promise<ApiResponse<ComputeInferenceResult>> {
    return this.runAIInference({
      prompt,
      model: 'llama-3.1-8b-instant',
      maxTokens,
      temperature: 0.7
    });
  }

  // Multi-source Oracle
  static async getMultiSourceData(sources: string[], dataType: string, parameters: any): Promise<ApiResponse<AggregatedOracleData>> {
    return this.collectOracleData({
      sources,
      dataType: dataType as any,
      parameters
    });
  }
}

export default ZeroGravisAPI;
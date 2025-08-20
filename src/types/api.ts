// ZeroGravis API Types - Backend Integration

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  timestamp: string;
}

// Oracle Types
export enum OracleDataType {
  PRICE_FEED = 'price_feed',
  WEATHER = 'weather',
  SPACE = 'space',
  CRYPTO_METRICS = 'crypto_metrics',
  IOT_SENSOR = 'iot_sensor',
  FINANCIAL = 'financial'
}

export enum ConsensusMethod {
  MAJORITY = 'majority',
  WEIGHTED_AVERAGE = 'weighted_average',
  MEDIAN = 'median',
  AI_CONSENSUS = 'ai_consensus'
}

export interface OracleCollectRequest {
  sources: string[];
  dataType: OracleDataType;
  parameters: Record<string, any>;
  consensusMethod?: ConsensusMethod;
}

export interface OracleDataPoint {
  source: string;
  dataType: string;
  value: any;
  timestamp: number;
  confidence: number;
  metadata?: Record<string, any>;
}

export interface AggregatedOracleData {
  dataType: string;
  sources: string[];
  aggregatedValue: any;
  confidence: number;
  timestamp: number;
  dataPoints: OracleDataPoint[];
  consensusMethod: string;
  executionTime: number;
  sourcesUsed: string[];
  consensusAchieved: boolean;
}

// Compute Types
export interface ComputeInferenceRequest {
  prompt: string;
  model?: string;
  maxTokens?: number;
  temperature?: number;
  parameters?: Record<string, any>;
}

export interface ComputeInferenceResult {
  success: boolean;
  jobId: string;
  result: {
    response: string;
    tokensUsed: number;
    executionTime: number;
    model: string;
    confidence: number;
  };
  txHash: string;
  computeNodeId: string;
  teeVerified: boolean;
}

// Health Check
export interface HealthStatus {
  status: 'healthy' | 'unhealthy';
  timestamp: string;
  version: string;
  service: string;
}

// Price Feed Specific
export interface PriceFeedData {
  symbol: string;
  price: number;
  currency: string;
  change24h: number;
  volume24h: number;
  marketCap: number;
  decimals: number;
  roundId: string;
  updatedAt: number;
}

// Weather Specific
export interface WeatherData {
  location: string;
  temperature: number;
  humidity: number;
  pressure: number;
  windSpeed: number;
  condition: string;
  coordinates: {
    lat: number;
    lon: number;
  };
}

// Space/Asteroid Specific
export interface AsteroidData {
  id: string;
  name: string;
  diameter: {
    min: number;
    max: number;
  };
  closeApproachDate: string;
  velocity: number;
  missDistance: number;
  isPotentiallyHazardous: boolean;
}

export interface SpaceData {
  dataType: string;
  data: AsteroidData[];
  date: string;
  mission: string;
  instrument: string;
}
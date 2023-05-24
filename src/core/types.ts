import type { KoaApp } from '@yunflyjs/yunfly';
export type AnyObject = Record<string, any>;

export interface RedisCommonConfig {
  port: number;
  host: string;
  username?: string;
  password?: string;
  db?: number;
  keepAlive?: number;
  family?: number;
  noDelay?: boolean;
  connectionName?: string;
  dropBufferSupport?: boolean;
  enableReadyCheck?: boolean;
  enableOfflineQueue?: boolean;
  connectTimeout?: number;
  disconnectTimeout?: number;
  commandTimeout?: number;
  autoResubscribe?: number;
  autoResendUnfulfilledCommands?: number;
  lazyConnect?: number;
  tls?: AnyObject;
  keyPrefix?: string;
  retryStrategy?: Function;
  maxRetriesPerRequest?: number;
  reconnectOnError?: Function;
  readOnly?: boolean;
  stringNumbers?: boolean;
  enableAutoPipelining?: boolean;
  autoPipeliningIgnoredCommands?: string[];
  maxScriptsCachingTime?: number;
}

interface RedisClusterCommonConfig {
  clusterRetryStrategy?: Function;
  dnsLookup?: any;
  enableOfflineQueue: boolean;
  enableReadyCheck?: boolean;
  scaleReads?: string;
  maxRedirections?: number;
  retryDelayOnFailover?: number;
  retryDelayOnClusterDown?: number;
  retryDelayOnTryAgain?: number;
  slotsRefreshTimeout?: number;
  slotsRefreshInterval?: number;
  redisOptions?: AnyObject;
}

interface StartupNodesConfig {
  port: number;
  host: string;
}

export interface RedisClusterConfig {
  startupNodes: StartupNodesConfig[];
  options?: RedisClusterCommonConfig;
}

type ApolloConfigFn = (apolloConfig: AnyObject) => RedisConfig | RedisClusterConfig;

export interface PluginOptions {
  app: any;
  koaApp: KoaApp;
  pluginConfig: RedisPluginConfig;
  config: AnyObject;
  apolloConfig: AnyObject;
}

export interface RedisConfig extends RedisCommonConfig {
  enable: boolean;
}

export interface RedisClusterConfig {
  enable: boolean;
  startupNodes: StartupNodesConfig[];
  options?: RedisClusterCommonConfig;
}

export type RedisPluginConfig = RedisConfig | RedisClusterConfig | ApolloConfigFn;

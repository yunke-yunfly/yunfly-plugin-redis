import logger from '@yunflyjs/loggers';
import * as IoRedis from 'ioredis';

import { RedisInitError } from './errors';
import type { RedisClusterConfig, RedisConfig } from './types';

export type RidesConfig = IoRedis.Redis | IoRedis.Cluster;

export let cacheRedis: RidesConfig;

export const redis = new Proxy({}, {
  get: (obj: any, prop: string) => {
    if (cacheRedis) {
      return (cacheRedis as any)[prop]
    } else {
      throw new RedisInitError();
    }
  }
});

/**
 * redis client
 *
 * @export
 * @class Redis
 */
export default class Redis {
  restartTime: number;
  redis: RidesConfig;
  redisConfig: RedisConfig;
  clusterRedisConfig: RedisClusterConfig;
  restartMaxTime: number;
  isCluster: boolean;

  constructor(options: RedisConfig | RedisClusterConfig) {
    // options is redis config
    if ((options as RedisClusterConfig).startupNodes) {
      this.clusterRedisConfig = options as RedisClusterConfig;
    } else if ((options as RedisConfig).host) {
      this.redisConfig = options as RedisConfig;
    } else {
      throw Error('The redis host params is must required.');
    }

    this.isCluster = this.clusterRedisConfig ? true : false;
    this.redis;
  }

  /**
   * init apollo
   *
   * @memberof Redis
   */
  init(): RidesConfig {
    logger.window().info('【redis】: 开始初始化redis服务...');
    return this.run();
  }

  /**
   * init redis client
   *
   * @memberof Redis
   */
  run(): RidesConfig {
    // cluster
    if (this.isCluster) {
      this.redis = this.createClusterRedisClient(this.clusterRedisConfig);
    }
    // default
    else {
      this.redis = this.createRedisClient(this.redisConfig);
    }

    // redis 启动监听信息
    this.watch();

    // cache redis client
    cacheRedis = this.redis;

    return this.redis;
  }

  /**
   * redis client
   *
   * @param {(CreateRedisConfig | string)} options
   */
  createRedisClient(options: RedisConfig): IoRedis.Redis {
    const { port = 6379, host } = options || {};
    if (!port || !host) {
      throw Error('Redis配置有误，prot,host 必须为必填项！');
    }
    return new IoRedis.default(options as IoRedis.RedisOptions);
  }

  /**
   * cluster redis client
   *
   * @param {CreateClusterRedisConfig} options
   * @return {*} `
   */
  createClusterRedisClient(option: RedisClusterConfig): IoRedis.Cluster {
    const { startupNodes, options } = option || {};
    if (!startupNodes || !startupNodes.length) {
      throw Error('Redis Cluster配置有误，prot,host 必须为必填项！');
    }
    return new IoRedis.Cluster(startupNodes, options as IoRedis.ClusterOptions);
  }

  /**
   * watch redis client
   *
   * @param {*} options
   * @param {number} type
   * @memberof Redis
   */
  watch(): void {
    if (!this.redis) return;
    const info = this.isCluster
      ? `cluster config: ${this.clusterRedisConfig.startupNodes}`
      : `config host: ${this.redisConfig.host}, port: ${this.redisConfig.port}`;

    this.redis.on('ready', () => {
      logger.window().info('【redis】: redis服务初始化成功, ', info);
    });

    this.redis.on('error', (err: any) => {
      logger.window().error({
        msg: `【redis】: redis have some error, ${info}`,
        error: err,
      });
      process.exit(1);
    });

    this.redis.on('end', () => {
      logger.window().error(new Error(`【redis】: redis has been shut down, ${info}`));
    });
  }
}



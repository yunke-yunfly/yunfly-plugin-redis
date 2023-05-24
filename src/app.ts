import type { PluginOptions } from './core/types';
import Redis from './core/index';

export { RedisPluginConfig } from './core/types'
export { redis } from './core/index';

/**
 * yunfly redis 插件
 *
 * @export
 * @param {KoaApp} koaApp
 * @param {Config} config
 * @param {ApolloConfig} apolloConfig
 * @returns
 */
export default function yunflyRedis({
  koaApp,
  apolloConfig,
  pluginConfig,
}: PluginOptions): void {
  if (typeof pluginConfig === 'function') {
    // all apollo config
    pluginConfig = pluginConfig(apolloConfig);
  }

  if (!pluginConfig.enable) {
    return;
  }

  const redis = new Redis(pluginConfig).init();
  // 挂载到所有的ctx下
  koaApp.context.redis = redis;
}

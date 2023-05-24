import type {YunkeErrorOptions} from '@yunflyjs/errors';
import { YunkeError } from '@yunflyjs/errors';

export class RedisInitError extends YunkeError {
  constructor(options?: YunkeErrorOptions) {
    super(options);
    this.code = this.code ?? 10201;
    this.message = this.message || '请确保 Redis 初始化已完成！';
  }
}

import { CacheStore } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-yet';

// get REDIS_HOST and REDIS_PORT from .env file
const { REDIS_HOST, REDIS_PORT } = process.env;

// create redisConfig object that holds the cache store configuration
export const redisConfig = {
  isGlobal: true, // make the cache store global
  useFactory: async () => { // create the cache store using cache-manager-redis-yet
    const store = await redisStore({
      socket: {
        host: REDIS_HOST,
        port: +REDIS_PORT,
      },
    });

    return {
      store: store as unknown as CacheStore,
    };
  },
}

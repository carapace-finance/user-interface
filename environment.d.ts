declare namespace NodeJS {
  export interface ProcessEnv {
    TENDERLY_ACCESS_KEY: string;
    NEXT_PUBLIC_TENDERLY_PROJECT: string;
    NEXT_PUBLIC_TENDERLY_USER: string;
    NEXT_PUBLIC_FIRST_POOL_SALT: string;
    UPSTASH_REDIS_REST_URL: string;
    UPSTASH_REDIS_REST_TOKEN: string;
    NEXT_PUBLIC_FATHOM_SITE_ID: string;
    NEXT_PUBLIC_MAINTENANCE: string;
  }
}

declare namespace NodeJS {
  export interface ProcessEnv {
    TENDERLY_ACCESS_KEY: string;
    NEXT_PUBLIC_TENDERLY_PROJECT: string;
    NEXT_PUBLIC_TENDERLY_USER: string;
    NEXT_PUBLIC_FIRST_POOL_SALT: string;
  }
}

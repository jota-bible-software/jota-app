/* eslint-disable */

declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: string
    VUE_ROUTER_MODE: 'hash' | 'history' | 'abstract' | undefined
    VUE_ROUTER_BASE: string | undefined
  }
}

// Global domain detection variable set by domain-handler.js
interface Window {
  JOTA_APP_CONFIG?: {
    isSubdomain: boolean;
    hostname: string;
    basePath: string;
  }
}

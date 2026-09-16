/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Origin the site is served from. See `src/config/site.ts`. */
  readonly VITE_SITE_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

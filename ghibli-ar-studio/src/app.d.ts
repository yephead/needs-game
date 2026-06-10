/// <reference types="svelte" />
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_GHIBLI_API_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

/// <reference types="vite/client" />

/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_API_URL: string;
    // Add other environment variables you're using
  }
  
  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }
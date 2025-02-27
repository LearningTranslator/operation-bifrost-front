/// <reference types="astro/client" />

interface ImportMetaEnv {
	readonly CROWDIN_API_TOKEN: string;
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}
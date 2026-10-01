/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly RESEND_API_KEY?: string;
  readonly RESEND_FROM_EMAIL?: string;
  readonly RESEND_SEGMENT_ID?: string;
  readonly RESEND_AUDIENCE_ID?: string;
  readonly PUBLIC_CF_BEACON_TOKEN?: string;
  readonly PUBLIC_LIST_SIGNUP?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

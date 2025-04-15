import type Client from "@crowdin/crowdin-api-client";
import crowdin, { type Credentials } from "@crowdin/crowdin-api-client";

// credentials
const credentials: Credentials = {
  token: import.meta.env.CROWDIN_API_TOKEN,
};

const { translationStatusApi } = new (crowdin as any).default(
  credentials
) as Client; // why doesn't Crowdin update their SDK typings...

export { translationStatusApi };

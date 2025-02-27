import type Client from '@crowdin/crowdin-api-client';
import crowdin, { type Credentials } from '@crowdin/crowdin-api-client';

// credentials
const credentials: Credentials = {
	token: import.meta.env.CROWDIN_API_TOKEN,
};

const {
	translationStatusApi,
} = new crowdin.default(credentials) as Client;

export {
	translationStatusApi
}
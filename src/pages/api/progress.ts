import type { APIRoute } from 'astro';
import { translationStatusApi } from '../../lib/crowdin';
import type { ResponseList, TranslationStatusModel } from '@crowdin/crowdin-api-client';

export const prerender = false;

declare module '@crowdin/crowdin-api-client' {
	interface TranslationStatus {
		getProjectProgress(projectId: number, options?: { languageIds?: string }): Promise<ResponseList<TranslationStatusModel.LanguageProgress>>;
	}
}

const PROJECT_ID = 483903;

export const GET: APIRoute = async ({ params, request }) => {
	const response = await translationStatusApi.getProjectProgress(PROJECT_ID, {
		languageIds: "th"
	})
	const data = response.data[0].data

	const { total, translated, approved } = data.words

	// calculate percentage
	const translateProgress = (translated / total) * 100
	const approveProgress = (approved / total) * 100

	return new Response(
		JSON.stringify({
			total,
			approved,
			translateProgress,
			approveProgress
		})
	);
}
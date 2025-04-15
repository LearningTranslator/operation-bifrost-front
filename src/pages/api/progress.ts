import type { APIRoute } from "astro";
import { translationStatusApi } from "../../lib/crowdin";
import type {
  ResponseList,
  TranslationStatusModel,
} from "@crowdin/crowdin-api-client";

export const prerender = false;

declare module "@crowdin/crowdin-api-client" {
  interface TranslationStatus {
    getProjectProgress(
      projectId: number,
      options?: { languageIds?: string }
    ): Promise<ResponseList<TranslationStatusModel.LanguageProgress>>;
  }
}

const PROJECT_ID = 483903;

export const GET: APIRoute = async () => {
  const response = await translationStatusApi.getProjectProgress(PROJECT_ID, {
    languageIds: "th",
  });
  const data = response.data[0].data;

  const { total, translated, approved } = data.words;

  // calculate percentage
  let translateProgress = (translated / total) * 100;
  let approveProgress = (approved / total) * 100;

  translateProgress = parseFloat(translateProgress.toFixed(4));
  approveProgress = parseFloat(approveProgress.toFixed(4));

  return new Response(
    JSON.stringify({
      total,
      translated,
      approved,
      translateProgress,
      approveProgress,
    })
  );
};

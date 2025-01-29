import {API_ROUTES} from "@/shared/config";
import {GET} from "@/shared/api";

export const fetchMeta = async (appLabel, modelName) => {
    const response = await GET(API_ROUTES.FETCH_META(appLabel, modelName));
    return response;
};

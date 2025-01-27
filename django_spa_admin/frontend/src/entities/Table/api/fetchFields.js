import {GET} from "@/shared/api/api";
import {API_ROUTES} from "@/shared/config";

export const fetchFields = async (appLabel, modelName) => {
    const response = await GET(API_ROUTES.FETCH_META(appLabel, modelName));
    return response;
};

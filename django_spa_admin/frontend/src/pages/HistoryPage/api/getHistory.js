import {API_ROUTES} from "@/shared/config";
import {GET} from "@/shared/api";

export const getHistory = async (appLabel, modelName, objectId) => {
        const response = await GET(API_ROUTES.HISTORY(appLabel, modelName, objectId))
        return response;
    };

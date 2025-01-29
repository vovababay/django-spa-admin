import {GET} from "@/shared/api";
import {API_ROUTES} from "@/shared/config";

export const getObject = async (appLabel, modelName, objectId) => {
    return await GET(API_ROUTES.FETCH_OBJECT(appLabel, modelName, objectId));
    };
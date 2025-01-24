import {getRequest} from "@/shared/api/api";
import {API} from "@/shared/config/api";

export const fetchFields = async (appLabel, modelName) => {
    const response = await getRequest(API.FETCH_META(appLabel, modelName));
    return response;
};

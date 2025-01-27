import {API_ROUTES} from "@/shared/config";
import {GET} from "@/shared/api";

export const fetchData = async (appLabel) => {
        const response = await GET(API_ROUTES.FETCH_MODELS(appLabel))
        return response;
    };

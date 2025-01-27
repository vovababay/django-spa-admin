import { POST } from '@/shared/api';
import {API_ROUTES} from "@/shared/config";

export const fetchAction = async (appLabel, modelName, actionData) => {
    const response =  await POST(API_ROUTES.FETCH_ACTION_DATA(appLabel, modelName), actionData);
    return response;
};

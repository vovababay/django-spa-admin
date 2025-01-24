import { postRequest } from '@/shared/api/api';
import {API} from "@/shared/config/api";

export const fetchAction = async (appLabel, modelName, actionData) => {
    const response = await postRequest(API.FETCH_ACTION_DATA(appLabel, modelName), actionData);
    return response;
};

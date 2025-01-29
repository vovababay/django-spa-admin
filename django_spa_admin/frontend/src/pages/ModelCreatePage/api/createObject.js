import { POST } from "@/shared/api";
import { API_ROUTES } from "@/shared/config";

export const createObject = async (appLabel, modelName, data) => {
    return await POST(API_ROUTES.CREATE_OBJECT(appLabel, modelName), data);
};
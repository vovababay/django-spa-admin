import {GET} from "@/shared/api";
import {API_ROUTES} from "@/shared/config";


export const getLastActions = async () => {
    return await GET(API_ROUTES.LAST_ACTIONS)
}
import {GET} from "@/shared/api";
import {API_ROUTES} from "@/shared/config";

export const getSideBarData = async () => {
    return await GET(API_ROUTES.SIDE_BAR);
}

import {getSideBarData} from "@/pages/HomePage/api/getSideBar";
import {handle403Error} from "@/shared/api/authService";



export const fetchSideBarData = async () => {
    try {
        return await getSideBarData();
    } catch (error) {
        if (error.is403) {
            handle403Error();
        } else {
            console.error('Error fetching sidebar data:', error);
        }
        throw error;
    }
};

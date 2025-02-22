import { PATCH } from "@/shared/api";

export const updateObject = async (url, data) => {
    return PATCH(url, data);
};

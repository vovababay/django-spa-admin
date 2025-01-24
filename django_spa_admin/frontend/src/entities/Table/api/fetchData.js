import {getRequest, postRequest} from "@/shared/api/api";
import {API} from "@/shared/config/api";

export const fetchData = async (appLabel, modelName, page, pageSize, query = '', sort = []) => {
    const sortParam = sort
        .map(({ columnIndex, order }) => `${order === 'asc' ? '' : '-'}${columnIndex}`)
        .join('.');
    const response = await getRequest(API.FETCH_DATA(appLabel, modelName, page, pageSize, query, sortParam));
    return response;
};

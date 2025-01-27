import {GET} from "@/shared/api";
import {API_ROUTES} from "@/shared/config";

export const fetchData = async (appLabel, modelName, page, pageSize, query = '', sort = []) => {
    const sortParam = sort
        .map(({ columnIndex, order }) => `${order === 'asc' ? '' : '-'}${columnIndex}`)
        .join('.');
    const response =   await GET(API_ROUTES.FETCH_DATA(appLabel, modelName, page, pageSize, query, sortParam));
    return response;
};

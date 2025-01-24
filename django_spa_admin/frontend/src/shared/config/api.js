export const API = {
    FETCH_META: (appLabel, modelName) => `/${appLabel}/${modelName}/meta/`,
    FETCH_DATA: (appLabel, modelName, page, pageSize, query = '', sort = '') =>
        `/${appLabel}/${modelName}/?page=${page}&page_size=${pageSize}&q=${query}&o=${sort}`,
    CALL_ACTION: (appLabel, modelName) => `/${appLabel}/${modelName}/call_action/`,
    FETCH_ACTION_DATA: (appLabel, modelName) => `/${appLabel}/${modelName}/call_action/`
};

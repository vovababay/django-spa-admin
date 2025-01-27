export const API_ROUTES = {
    FETCH_META: (appLabel, modelName) => `/${appLabel}/${modelName}/meta/`,
    FETCH_DATA: (appLabel, modelName, page, pageSize, query = '', sort = '') =>
        `/${appLabel}/${modelName}/?page=${page}&page_size=${pageSize}&q=${query}&o=${sort}`,
    CALL_ACTION: (appLabel, modelName) => `/${appLabel}/${modelName}/call_action/`,
    FETCH_ACTION_DATA: (appLabel, modelName) => `/${appLabel}/${modelName}/call_action/`,
    FETCH_MODELS: (appLabel) => `/${appLabel}/app_models/`,
    FETCH_OBJECT: (appLabel, modelName, objectId) => `/${appLabel}/${modelName}/${objectId}/`,
    CREATE_OBJECT: (appLabel, modelName) => `/${appLabel}/${modelName}/`,
    LOGIN: '/login/',
    SIDE_BAR: '/side_bar/',
    LAST_ACTIONS: '/last_actions/',
};

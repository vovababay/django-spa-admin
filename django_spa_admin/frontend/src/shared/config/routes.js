export const ROUTES = {
    MAIN_PAGE: '/django_spa/admin/',
    DYNAMIC_PAGE: '/django_spa/admin/:appLabel/:modelName/:pk/',
    DYNAMIC_PAGE_EDIT: '/django_spa/admin/:appLabel/:modelName/:pk/change/',
    ADD_OBJECT: (appLabel, modelName) => `/django_spa/admin/${appLabel}/${modelName}/add/`,
    CHANGE_OBJECT: (appLabel, modelName, objectId) => `/django_spa/admin/${appLabel}/${modelName}/${objectId}/change/`,
    LOGOUT: '/django_spa/admin/login/'
};

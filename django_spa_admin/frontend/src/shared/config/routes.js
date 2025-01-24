export const ROUTES = {
    DYNAMIC_PAGE: '/django_spa/admin/:appLabel/:modelName/:pk/',
    DYNAMIC_PAGE_EDIT: '/django_spa/admin/:appLabel/:modelName/:pk/change/',
    ADD_OBJECT: (appLabel, modelName) => `/django_spa/admin/${appLabel}/${modelName}/add/`,
};

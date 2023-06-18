export enum RouteNames {
    HOME = '/',
    DEV_TEST_SCREEN = 'DevTestScreen',
    PROJEKT_LIST_PAGE = '/ci/Projekt',
    PROJEKT_ENTITY_DETAIL = '/ci/Projekt/:projektId',
    CONFIGURATION_ITEM_LIST = '/ci/:entityName',
    CONFIGURATION_ITEM_DETAIL = '/ci/:entityName/:entityId',
    DOCUMENTS_LIST_TAB = '/ci/:entityName/:entityId/documents',
    RELATIONSHIPS_LIST_TAB = '/ci/:entityName/:entityId/relationships',
}

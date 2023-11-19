import { TFunction } from 'i18next'
import { FooterSection } from '@isdd/metais-common/components/footer/FooterSection'
import { FooterMetaList } from '@isdd/metais-common/components/footer/FooterMeta'
import { FooterRouteNames, NavigationSubRoutes, RouteNames } from '@isdd/metais-common/navigation/routeNames'
import { PORTAL_URL } from '@isdd/metais-common/constants'

export const getLoginFooterSection = (t: TFunction): FooterSection[] => {
    const portalSections: FooterSection[] = [
        {
            header: t('footer.metaisServices'),
            columnsCount: 2,
            itemList: [
                {
                    label: t('navMenu.egovComponents'),
                    href: PORTAL_URL + RouteNames.HOW_TO_EGOV_COMPONENTS,
                },
                {
                    label: t('navMenu.lists.standards'),
                    href: PORTAL_URL + NavigationSubRoutes.STANDARDY_ISVS,
                },
                {
                    label: t('navMenu.dataObjects'),
                    href: PORTAL_URL + RouteNames.HOW_TO_DATA_OBJECTS,
                },
                {
                    label: t('navMenu.lists.overviews'),
                    href: PORTAL_URL + NavigationSubRoutes.OVERVIEWS,
                },
                {
                    label: t('navMenu.lists.relationsInspection'),
                    href: PORTAL_URL + NavigationSubRoutes.RELATIONS_INSPECTION,
                },
                {
                    label: t('navMenu.lists.architectonicRepository'),
                    href: PORTAL_URL + NavigationSubRoutes.ARCHITECTONIC_REPOSITORY,
                },
                {
                    label: t('navMenu.lists.educationalCourses'),
                    href: PORTAL_URL + NavigationSubRoutes.EDUCATIONAL_COURSES,
                },
                {
                    label: t('navMenu.lists.assembliesAndReports'),
                    href: PORTAL_URL + RouteNames.REPORTS,
                },
                {
                    label: t('navMenu.lists.totalCostOfOwnership'),
                    href: PORTAL_URL + NavigationSubRoutes.TOTAL_COST_OF_OWNERSHIP,
                },
                {
                    label: t('navMenu.lists.serviceLevelAgreementsWithOperator'),
                    href: PORTAL_URL + NavigationSubRoutes.SERVICE_LEVEL_AGREEMENTS_WITH_OPERATOR,
                },
                {
                    label: t('navMenu.lists.integrationAgreementsOnServiceLevel'),
                    href: PORTAL_URL + NavigationSubRoutes.INTEGRATION_AGREEMENTS_ON_SERVICE_LEVEL,
                },
                {
                    label: t('navMenu.lists.codelists'),
                    href: PORTAL_URL + NavigationSubRoutes.CODELIST,
                },
                {
                    label: t('footer.exceptionsLegislation'),
                    href: FooterRouteNames.EXCEPTIONS_LEGISLATION,
                },
            ],
        },
        {
            header: t('footer.usefulLinks'),
            itemList: [
                {
                    label: t('footer.mediaWiki'),
                    href: PORTAL_URL + RouteNames.MEDIA_WIKI,
                },
                {
                    label: t('navMenu.guides'),
                    href: PORTAL_URL + RouteNames.PREHLADY_A_POSTUPY,
                },
                {
                    label: t('footer.contact'),
                    href: PORTAL_URL + RouteNames.CONTACT,
                },
            ],
        },
    ]

    return portalSections
}

export const getLoginFooterMetaList = (t: TFunction): FooterMetaList[] => {
    const metaList: FooterMetaList[] = [
        {
            label: t('footer.accessibilityDeclaration'),
            href: PORTAL_URL + FooterRouteNames.ACCESSIBILITY_DECLARATION,
        },
        {
            label: t('footer.webResidencyMap'),
            href: PORTAL_URL + FooterRouteNames.WEB_RESIDENCY_MAP,
        },
        {
            label: t('footer.GDPRAndCookies'),
            href: PORTAL_URL + FooterRouteNames.GDPR_AND_COOKIES,
        },
        {
            label: t('footer.technicalOperator'),
            href: PORTAL_URL + FooterRouteNames.TECHNICAL_OPERATOR,
        },
        {
            label: t('footer.contentAdmin'),
            href: PORTAL_URL + FooterRouteNames.CONTENT_ADMIN,
        },
        {
            label: t('footer.RSS'),
            href: PORTAL_URL + FooterRouteNames.RSS,
        },
    ]
    return metaList
}

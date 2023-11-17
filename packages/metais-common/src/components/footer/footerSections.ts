import { TFunction } from 'i18next'

import { FooterSection } from './FooterSection'
import { FooterMetaList } from './FooterMeta'

import { FooterRouteNames, NavigationSubRoutes, RouteNames } from '@isdd/metais-common/navigation/routeNames'

export const getPortalFooterSection = (t: TFunction): FooterSection[] => {
    const portalSections: FooterSection[] = [
        {
            header: t('footer.metaisServices'),
            columnsCount: 2,
            itemList: [
                {
                    label: t('navMenu.egovComponents'),
                    href: RouteNames.HOW_TO_EGOV_COMPONENTS,
                },
                {
                    label: t('navMenu.lists.standards'),
                    href: NavigationSubRoutes.STANDARDY_ISVS,
                },
                {
                    label: t('navMenu.dataObjects'),
                    href: RouteNames.HOW_TO_DATA_OBJECTS,
                },
                {
                    label: t('navMenu.lists.overviews'),
                    href: NavigationSubRoutes.OVERVIEWS,
                },
                {
                    label: t('navMenu.lists.relationsInspection'),
                    href: NavigationSubRoutes.RELATIONS_INSPECTION,
                },
                {
                    label: t('navMenu.lists.architectonicRepository'),
                    href: NavigationSubRoutes.ARCHITECTONIC_REPOSITORY,
                },
                {
                    label: t('navMenu.lists.educationalCourses'),
                    href: NavigationSubRoutes.EDUCATIONAL_COURSES,
                },
                {
                    label: t('navMenu.lists.assembliesAndReports'),
                    href: RouteNames.REPORTS,
                },
                {
                    label: t('navMenu.lists.totalCostOfOwnership'),
                    href: NavigationSubRoutes.TOTAL_COST_OF_OWNERSHIP,
                },
                {
                    label: t('navMenu.lists.serviceLevelAgreementsWithOperator'),
                    href: NavigationSubRoutes.SERVICE_LEVEL_AGREEMENTS_WITH_OPERATOR,
                },
                {
                    label: t('navMenu.lists.integrationAgreementsOnServiceLevel'),
                    href: NavigationSubRoutes.INTEGRATION_AGREEMENTS_ON_SERVICE_LEVEL,
                },
                {
                    label: t('navMenu.lists.codelists'),
                    href: RouteNames.HOW_TO_CODELIST,
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
                    href: RouteNames.MEDIA_WIKI,
                },
                {
                    label: t('navMenu.guides'),
                    href: RouteNames.PREHLADY_A_POSTUPY,
                },
                {
                    label: t('footer.contact'),
                    href: RouteNames.CONTACT,
                },
            ],
        },
    ]

    return portalSections
}

export const getPortalFooterMetaList = (t: TFunction): FooterMetaList[] => {
    const metaList: FooterMetaList[] = [
        {
            label: t('footer.accessibilityDeclaration'),
            href: FooterRouteNames.ACCESSIBILITY_DECLARATION,
        },
        {
            label: t('footer.webResidencyMap'),
            href: FooterRouteNames.WEB_RESIDENCY_MAP,
        },
        {
            label: t('footer.GDPRAndCookies'),
            href: FooterRouteNames.GDPR_AND_COOKIES,
        },
        {
            label: t('footer.technicalOperator'),
            href: FooterRouteNames.TECHNICAL_OPERATOR,
        },
        {
            label: t('footer.contentAdmin'),
            href: FooterRouteNames.CONTENT_ADMIN,
        },
        {
            label: t('footer.RSS'),
            href: FooterRouteNames.RSS,
        },
    ]
    return metaList
}

import { TFunction } from 'i18next'

import { FooterSection } from './FooterSection'
import { FooterMetaList } from './FooterMeta'

import { FooterRouteNames, NavigationSubRoutes, RouteNames } from '@isdd/metais-common/navigation/routeNames'
import { PORTAL_URL } from '@isdd/metais-common/constants'

export const getPortalFooterSection = (t: TFunction, isAdmin?: boolean): FooterSection[] => {
    const urlPrefix = isAdmin ? PORTAL_URL : ''
    const portalSections: FooterSection[] = [
        {
            header: t('footer.metaisServices'),
            columnsCount: 2,
            itemList: [
                {
                    label: t('navMenu.egovComponents'),
                    href: urlPrefix + RouteNames.HOW_TO_EGOV_COMPONENTS,
                },
                {
                    label: t('navMenu.lists.standards'),
                    href: urlPrefix + NavigationSubRoutes.STANDARDY_ISVS,
                },
                {
                    label: t('navMenu.dataObjects'),
                    href: urlPrefix + RouteNames.HOW_TO_DATA_OBJECTS,
                },
                {
                    label: t('navMenu.lists.overviews'),
                    href: urlPrefix + NavigationSubRoutes.OVERVIEWS, ///
                },
                {
                    label: t('navMenu.lists.relationsInspection'),
                    href: urlPrefix + NavigationSubRoutes.RELATIONS_INSPECTION, ///
                },
                {
                    label: t('navMenu.lists.architectonicRepository'),
                    href: urlPrefix + NavigationSubRoutes.ARCHITECTONIC_REPOSITORY, ///
                },
                {
                    label: t('navMenu.lists.educationalCourses'),
                    href: urlPrefix + NavigationSubRoutes.EDUCATIONAL_COURSES, ///
                },
                {
                    label: t('navMenu.lists.assembliesAndReports'),
                    href: urlPrefix + RouteNames.REPORTS,
                },
                {
                    label: t('navMenu.lists.totalCostOfOwnership'),
                    href: urlPrefix + NavigationSubRoutes.TOTAL_COST_OF_OWNERSHIP, ///
                },
                {
                    label: t('navMenu.lists.serviceLevelAgreementsWithOperator'),
                    href: urlPrefix + NavigationSubRoutes.SERVICE_LEVEL_AGREEMENTS_WITH_OPERATOR, ///
                },
                {
                    label: t('navMenu.lists.integrationAgreementsOnServiceLevel'),
                    href: urlPrefix + NavigationSubRoutes.INTEGRATION_AGREEMENTS_ON_SERVICE_LEVEL, ///
                },
                {
                    label: t('navMenu.lists.codelists'),
                    href: urlPrefix + NavigationSubRoutes.CODELIST,
                },
                {
                    label: t('footer.exceptionsLegislation'),
                    href: urlPrefix + FooterRouteNames.EXCEPTIONS_LEGISLATION,
                },
            ],
        },
        {
            header: t('footer.usefulLinks'), ///
            itemList: [
                {
                    label: t('footer.mediaWiki'),
                    href: urlPrefix + RouteNames.MEDIA_WIKI,
                },
                {
                    label: t('navMenu.guides'),
                    href: urlPrefix + RouteNames.PREHLADY_A_POSTUPY,
                },
                {
                    label: t('footer.contact'),
                    href: urlPrefix + RouteNames.CONTACT,
                },
            ],
        },
    ]

    return portalSections
}

export const getPortalFooterMetaList = (t: TFunction, isAdmin?: boolean): FooterMetaList[] => {
    ///
    const urlPrefix = isAdmin ? PORTAL_URL : ''
    const metaList: FooterMetaList[] = [
        {
            label: t('footer.accessibilityDeclaration'),
            href: urlPrefix + FooterRouteNames.ACCESSIBILITY_DECLARATION,
        },
        {
            label: t('footer.webResidencyMap'),
            href: urlPrefix + FooterRouteNames.WEB_RESIDENCY_MAP,
        },
        {
            label: t('footer.GDPRAndCookies'),
            href: urlPrefix + FooterRouteNames.GDPR_AND_COOKIES,
        },
        {
            label: t('footer.technicalOperator'),
            href: urlPrefix + FooterRouteNames.TECHNICAL_OPERATOR,
        },
        {
            label: t('footer.contentAdmin'),
            href: urlPrefix + FooterRouteNames.CONTENT_ADMIN,
        },
        {
            label: t('footer.RSS'),
            href: urlPrefix + FooterRouteNames.RSS,
        },
    ]
    return metaList
}

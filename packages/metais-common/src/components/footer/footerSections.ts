import { TFunction } from 'i18next'

import { FooterSection } from './FooterSection'
import { FooterMetaList } from './FooterMeta'

import { FooterRouteNames, NavigationSubRoutes, RouteNames, RouterRoutes } from '@isdd/metais-common/navigation/routeNames'
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
                    label: t('navMenu.lists.educationalCourses'),
                    href: urlPrefix + NavigationSubRoutes.TRAINING,
                },
                {
                    label: t('navMenu.lists.assembliesAndReports'),
                    href: urlPrefix + RouteNames.REPORTS,
                },
                {
                    label: t('navMenu.lists.totalCostOfOwnership'),
                    href: urlPrefix + NavigationSubRoutes.TOTAL_COST_OF_OWNERSHIP,
                },
                {
                    label: t('navMenu.lists.serviceLevelAgreementsWithOperator'),
                    href: urlPrefix + RouterRoutes.OLA_CONTRACT_LIST,
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
            header: t('footer.usefulLinks'),
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
            label: t('footer.cookies'),
            href: urlPrefix + FooterRouteNames.COOKIES,
        },
        {
            label: t('footer.personalDataProtection'),
            href: urlPrefix + FooterRouteNames.PERSONAL_DATA_PROTECTION,
        },
        {
            label: t('footer.termsOfUse'),
            href: urlPrefix + FooterRouteNames.TERMS_OF_USE,
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
        {
            label: t('footer.aboutApplication'),
            href: urlPrefix + FooterRouteNames.ABOUT_APPLICATION,
        },
    ]
    return metaList
}

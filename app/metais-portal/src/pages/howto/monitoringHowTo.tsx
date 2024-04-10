import { BreadCrumbs, GridCol, GridRow, HomeIcon, TextBody, TextLink } from '@isdd/idsk-ui-kit/index'
import { useTranslation } from 'react-i18next'
import { useLocation, useSearchParams } from 'react-router-dom'
import { QueryFeedback } from '@isdd/metais-common/index'
import { NavigationSubRoutes, RouteNames, RouterRoutes } from '@isdd/metais-common/navigation/routeNames'
import { BASE_PAGE_NUMBER, BASE_PAGE_SIZE, ENTITY_AS, ENTITY_KS, META_IS_TITLE } from '@isdd/metais-common/constants'
import { useListMonitoringIsvsByParam, useListMonitoringOverview } from '@isdd/metais-common/api/generated/monitoring-swagger'
import { WIKI_SEARCH_KEY } from '@isdd/metais-common/hooks/wiki/useGetPageRender'
import { useId } from 'react'

import HowToContent from './howToContent'

import { MainContentWrapper } from '@/components/MainContentWrapper'

const HowToMonitoringPage = () => {
    const { t } = useTranslation()
    const location = useLocation()
    const [searchParams] = useSearchParams()
    const isSubWiki = searchParams.get(WIKI_SEARCH_KEY)
    document.title = `${t(`breadcrumbs.wiki.MONITORING_HOWTO`)} ${META_IS_TITLE}`

    const col1Id = useId()
    const col2Id = useId()
    const col3Id = useId()

    const {
        data: dataIsvs,
        isLoading: isLoadingIsvs,
        isError: isErrorIsvs,
    } = useListMonitoringIsvsByParam({
        serviceType: 'AS',
        page: BASE_PAGE_NUMBER,
        perPageSize: BASE_PAGE_SIZE,
    })

    const {
        data: dataAS,
        isLoading: isLoadingAs,
        isError: isErrorAs,
    } = useListMonitoringOverview({
        serviceTypes: ['AS'],
        page: BASE_PAGE_NUMBER,
        perPageSize: BASE_PAGE_SIZE,
    })

    const {
        data: dataKS,
        isLoading: isLoadingKs,
        isError: isErrorKs,
    } = useListMonitoringOverview({
        serviceTypes: ['KS'],
        page: BASE_PAGE_NUMBER,
        perPageSize: BASE_PAGE_SIZE,
    })

    return (
        <>
            <BreadCrumbs
                withWidthContainer
                links={[
                    { label: t('breadcrumbs.home'), href: RouteNames.HOME, icon: HomeIcon },
                    { label: t(`breadcrumbs.wiki.MONITORING_HOWTO`), href: location.pathname },
                ]}
            />
            <MainContentWrapper>
                <HowToContent howToEnumType="MONITORING_HOWTO" />
                {!isSubWiki && (
                    <QueryFeedback loading={isLoadingAs || isLoadingKs || isLoadingIsvs} error={isErrorAs || isErrorKs || isErrorIsvs} withChildren>
                        <GridRow>
                            <GridCol setWidth="one-third">
                                <TextBody size="L">
                                    <TextLink
                                        id={col1Id}
                                        aria={{ 'aria-labelledby': `${col1Id} ${col1Id + '_desc'}` }}
                                        to={{ pathname: RouterRoutes.MONITORING_SERVICES, search: `serviceType=${ENTITY_AS}` }}
                                        textBodySize
                                    >
                                        {dataAS?.pagination?.totalItems}
                                    </TextLink>
                                </TextBody>
                                <TextBody id={col1Id + '_desc'}>{t('howto.monitoring.monitoredApplicationServices')}</TextBody>
                            </GridCol>
                            <GridCol setWidth="one-third">
                                <TextBody size="L">
                                    <TextLink
                                        id={col2Id}
                                        aria={{ 'aria-labelledby': `${col2Id} ${col2Id + '_desc'}` }}
                                        to={{ pathname: RouterRoutes.MONITORING_SERVICES, search: `serviceType=${ENTITY_KS}` }}
                                        textBodySize
                                    >
                                        {dataKS?.pagination?.totalItems}
                                    </TextLink>
                                </TextBody>
                                <TextBody id={col2Id + '_desc'}>{t('howto.monitoring.monitoredEndServices')}</TextBody>
                            </GridCol>
                            <GridCol setWidth="one-third">
                                <TextBody size="L">
                                    <TextLink
                                        id={col3Id}
                                        aria={{ 'aria-labelledby': `${col3Id} ${col3Id + '_desc'}` }}
                                        to={NavigationSubRoutes.ISVS}
                                        textBodySize
                                    >
                                        {dataIsvs?.pagination?.totalItems}
                                    </TextLink>
                                </TextBody>
                                <TextBody id={col3Id + '_desc'}>{t('howto.monitoring.monitoredIsvsWithApplicationServices')}</TextBody>
                            </GridCol>
                        </GridRow>
                    </QueryFeedback>
                )}
            </MainContentWrapper>
        </>
    )
}

export default HowToMonitoringPage

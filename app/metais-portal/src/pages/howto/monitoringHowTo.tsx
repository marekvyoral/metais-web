import { BreadCrumbs, GridCol, GridRow, HomeIcon, TextBody } from '@isdd/idsk-ui-kit/index'
import { useTranslation } from 'react-i18next'
import { Link, useLocation, useSearchParams } from 'react-router-dom'
import { QueryFeedback } from '@isdd/metais-common/index'
import { RouteNames } from '@isdd/metais-common/navigation/routeNames'
import { BASE_PAGE_NUMBER, BASE_PAGE_SIZE, META_IS_TITLE } from '@isdd/metais-common/constants'
import { useListMonitoringIsvsByParam, useListMonitoringOverview } from '@isdd/metais-common/api/generated/monitoring-swagger'
import { WIKI_SEARCH_KEY } from '@isdd/metais-common/hooks/wiki/useGetPageRender'

import HowToContent from './howToContent'

import { MainContentWrapper } from '@/components/MainContentWrapper'

const HowToMonitoringPage = () => {
    const { t } = useTranslation()
    const location = useLocation()
    const [searchParams] = useSearchParams()
    const isSubWiki = searchParams.get(WIKI_SEARCH_KEY)
    document.title = `${t(`breadcrumbs.wiki.MONITORING_HOWTO`)} ${META_IS_TITLE}`

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
                                    <Link to={'/monitoring/services'} state={{ from: location }}>
                                        {dataAS?.pagination?.totalItems}
                                    </Link>
                                </TextBody>
                                <TextBody>Monitorovaných aplikačných služieb</TextBody>
                            </GridCol>
                            <GridCol setWidth="one-third">
                                <TextBody size="L">
                                    <Link to={'/monitoring/services'} state={{ from: location }}>
                                        {dataKS?.pagination?.totalItems}
                                    </Link>
                                </TextBody>
                                <TextBody>Monitorovaných koncových služieb</TextBody>
                            </GridCol>
                            <GridCol setWidth="one-third">
                                <TextBody size="L">
                                    <Link to={'/monitoring/services'} state={{ from: location }}>
                                        {dataIsvs?.pagination?.totalItems}
                                    </Link>
                                </TextBody>
                                <TextBody>ISVS s monitorovanými aplikačnými službami</TextBody>
                            </GridCol>
                        </GridRow>
                    </QueryFeedback>
                )}
            </MainContentWrapper>
        </>
    )
}

export default HowToMonitoringPage

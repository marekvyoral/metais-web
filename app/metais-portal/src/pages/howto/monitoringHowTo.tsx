import { BreadCrumbs, GridCol, GridRow, HomeIcon, TextBody } from '@isdd/idsk-ui-kit/index'
import { useTranslation } from 'react-i18next'
import { Link, useLocation } from 'react-router-dom'
import { QueryFeedback } from '@isdd/metais-common/index'
import { RouteNames } from '@isdd/metais-common/navigation/routeNames'
import { BASE_PAGE_NUMBER, BASE_PAGE_SIZE } from '@isdd/metais-common/constants'
import { useListMonitoringIsvsByParam, useListMonitoringOverview } from '@isdd/metais-common/api/generated/monitoring-swagger'

import HowToContent from './howToContent'

import { MainContentWrapper } from '@/components/MainContentWrapper'

const HowToMonitoringPage = () => {
    const { t } = useTranslation()
    const location = useLocation()

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
        serviceType: 'AS',
        page: BASE_PAGE_NUMBER,
        perPageSize: BASE_PAGE_SIZE,
    })

    const {
        data: dataKS,
        isLoading: isLoadingKs,
        isError: isErrorKs,
    } = useListMonitoringOverview({
        serviceType: 'KS',
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
                <QueryFeedback loading={isLoadingAs || isLoadingKs || isLoadingIsvs} error={isErrorAs || isErrorKs || isErrorIsvs} withChildren>
                    <HowToContent howToEnumType="MONITORING_HOWTO" />
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
            </MainContentWrapper>
        </>
    )
}

export default HowToMonitoringPage
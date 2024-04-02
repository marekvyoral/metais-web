import React from 'react'
import { CreateEntityButton, QueryFeedback } from '@isdd/metais-common/index'
import { useTranslation } from 'react-i18next'
import { BreadCrumbs, Filter, GridCol, GridRow, HomeIcon, TextHeading } from '@isdd/idsk-ui-kit/index'
import { FlexColumnReverseWrapper } from '@isdd/metais-common/components/flex-column-reverse-wrapper/FlexColumnReverseWrapper'
import { IFilter } from '@isdd/idsk-ui-kit/types'
import { ApiMonitoringOverviewService, ApiParameterTypesList } from '@isdd/metais-common/api/generated/monitoring-swagger'
import { EnumType } from '@isdd/metais-common/api/generated/enums-repo-swagger'
import { useNavigate } from 'react-router-dom'
import { RouteNames, RouterRoutes } from '@isdd/metais-common/navigation/routeNames'
import { DateInput } from '@isdd/idsk-ui-kit/date-input/DateInput'
import { getHowToTranslate } from '@isdd/metais-common/utils/utils'
import { HowTo, META_IS_TITLE } from '@isdd/metais-common/constants'

import { ServiceDetailViewGraphItem } from './ServiceDetailViewGraphItem'
import styles from './service.module.scss'

import { MainContentWrapper } from '@/components/MainContentWrapper'
import { IQueryParamsDetail } from '@/pages/monitoring/services/monitoras/[serviceUuid]'
import { MonitoringDetailFilterData } from '@/components/containers/MonitoringServiceDetailContainer'

interface IServiceDetailView {
    isLoading: boolean
    isError: boolean
    filterParams: MonitoringDetailFilterData
    data?: ApiParameterTypesList
    detailData?: ApiMonitoringOverviewService
    queryParams?: IQueryParamsDetail
    defaultFilterValues: MonitoringDetailFilterData
    tableDataParam?: EnumType
    handleFilterChange: (filter: IFilter) => void
}

export const ServiceDetailView: React.FC<IServiceDetailView> = ({
    data,
    detailData,
    isError,
    isLoading,
    defaultFilterValues,
    queryParams,
    tableDataParam,
}) => {
    const { t } = useTranslation()
    const navigate = useNavigate()

    document.title = `${t('titles.monitoringServicesDetail', { name: detailData?.name })} ${META_IS_TITLE}`

    return (
        <>
            <BreadCrumbs
                withWidthContainer
                links={[
                    { label: t('breadcrumbs.home'), href: '/', icon: HomeIcon },
                    { label: getHowToTranslate(HowTo.MONITORING_HOWTO, t), href: RouteNames.HOW_TO_MONITORING },
                    { label: t('titles.monitoringServices') ?? '', href: RouterRoutes.MONITORING_SERVICES },
                    { label: String(detailData?.name), href: '' },
                ]}
            />
            <MainContentWrapper>
                <QueryFeedback loading={isLoading} error={false} withChildren>
                    <FlexColumnReverseWrapper>
                        <TextHeading size="L">{detailData?.name}</TextHeading>
                        <QueryFeedback loading={false} error={isError} />
                    </FlexColumnReverseWrapper>
                    <Filter<MonitoringDetailFilterData>
                        onlyForm
                        defaultFilterValues={defaultFilterValues}
                        form={({ register, control, setValue }) => {
                            return (
                                <div>
                                    <GridRow>
                                        <GridCol setWidth="one-half">
                                            <DateInput
                                                label={t('monitoringServices.table.from')}
                                                {...register('dateFrom')}
                                                control={control}
                                                setValue={setValue}
                                            />
                                        </GridCol>
                                        <GridCol setWidth="one-half">
                                            <DateInput
                                                label={t('monitoringServices.table.from')}
                                                {...register('dateFrom')}
                                                control={control}
                                                setValue={setValue}
                                            />
                                        </GridCol>
                                    </GridRow>
                                </div>
                            )
                        }}
                    />
                </QueryFeedback>
                <CreateEntityButton
                    onClick={() =>
                        navigate(
                            `${RouterRoutes.MONITORING_INSERT}?serviceUuid=${queryParams?.serviceUuid}&serviceType=${defaultFilterValues?.serviceType}`,
                        )
                    }
                    label={t('insertMonitoring.buttonInsertParam')}
                />
                <div className={styles.topSpace}>
                    {data?.results?.map((item) => {
                        if (item.code !== 'HeartbeatAS') {
                            return <ServiceDetailViewGraphItem key={item.id} item={item} tableDataParam={tableDataParam} queryParams={queryParams} />
                        }
                    })}
                </div>
            </MainContentWrapper>
        </>
    )
}

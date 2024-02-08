import React from 'react'
import { CreateEntityButton, QueryFeedback } from '@isdd/metais-common/index'
import { useTranslation } from 'react-i18next'
import { Filter, GridCol, GridRow, Input, TextHeading } from '@isdd/idsk-ui-kit/index'
import { FlexColumnReverseWrapper } from '@isdd/metais-common/components/flex-column-reverse-wrapper/FlexColumnReverseWrapper'
import { IFilter } from '@isdd/idsk-ui-kit/types'
import { ApiParameterTypesList } from '@isdd/metais-common/api/generated/monitoring-swagger'
import { EnumType } from '@isdd/metais-common/api/generated/enums-repo-swagger'
import { useNavigate } from 'react-router-dom'
import { RouterRoutes } from '@isdd/metais-common/navigation/routeNames'

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
    queryParams?: IQueryParamsDetail
    defaultFilterValues: MonitoringDetailFilterData
    tableDataParam?: EnumType
    handleFilterChange: (filter: IFilter) => void
}

export const ServiceDetailView: React.FC<IServiceDetailView> = ({ data, isError, isLoading, defaultFilterValues, queryParams, tableDataParam }) => {
    const { t } = useTranslation()
    const navigate = useNavigate()

    return (
        <MainContentWrapper>
            <QueryFeedback loading={isLoading} error={false} withChildren>
                <FlexColumnReverseWrapper>
                    <TextHeading size="L">{t('titles.monitoringServices')}</TextHeading>
                    {isError && <QueryFeedback loading={false} error={isError} />}
                </FlexColumnReverseWrapper>
                <Filter<MonitoringDetailFilterData>
                    onlyForm
                    defaultFilterValues={defaultFilterValues}
                    form={({ register }) => {
                        return (
                            <div>
                                <GridRow>
                                    <GridCol setWidth="one-half">
                                        <Input type="date" label={t('monitoringServices.table.from')} {...register('dateFrom')} />
                                    </GridCol>
                                    <GridCol setWidth="one-half">
                                        <Input type="date" label={t('monitoringServices.table.to')} {...register('dateTo')} />
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
    )
}

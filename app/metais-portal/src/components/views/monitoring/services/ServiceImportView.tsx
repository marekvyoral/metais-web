import React from 'react'
import { QueryFeedback } from '@isdd/metais-common/index'
import { useTranslation } from 'react-i18next'
import { Filter, GridCol, GridRow, TextHeading } from '@isdd/idsk-ui-kit/index'
import { FlexColumnReverseWrapper } from '@isdd/metais-common/components/flex-column-reverse-wrapper/FlexColumnReverseWrapper'
import { IFilter } from '@isdd/idsk-ui-kit/types'
import { ApiParameterTypesList } from '@isdd/metais-common/api/generated/monitoring-swagger'
import { EnumType } from '@isdd/metais-common/api/generated/enums-repo-swagger'
import { DateInput } from '@isdd/idsk-ui-kit/date-input/DateInput'

import { ServiceDetailViewGraphItem } from './ServiceDetailViewGraphItem'

import { MainContentWrapper } from '@/components/MainContentWrapper'
import { IQueryParamsDetail } from '@/pages/monitoring/services/monitoras/[serviceUuid]'
import { MonitoringDetailFilterData } from '@/components/containers/MonitoringServiceDetailContainer'

interface IServiceImportView {
    isLoading: boolean
    isError: boolean
    filterParams: MonitoringDetailFilterData
    data?: ApiParameterTypesList
    queryParams?: IQueryParamsDetail
    defaultFilterValues: MonitoringDetailFilterData
    tableDataParam?: EnumType
    handleFilterChange: (filter: IFilter) => void
}

export const ServiceImportView: React.FC<IServiceImportView> = ({ data, isError, isLoading, defaultFilterValues, queryParams, tableDataParam }) => {
    const { t } = useTranslation()

    return (
        <MainContentWrapper>
            <QueryFeedback loading={isLoading} error={false} withChildren>
                <FlexColumnReverseWrapper>
                    <TextHeading size="L">{t('titles.monitoringServices')}</TextHeading>
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
                                            label={t('monitoringServices.table.to')}
                                            {...register('dateTo')}
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
            {data?.results?.map((item) => {
                if (item.code !== 'HeartbeatAS') {
                    return <ServiceDetailViewGraphItem key={item.id} item={item} tableDataParam={tableDataParam} queryParams={queryParams} />
                }
            })}
        </MainContentWrapper>
    )
}

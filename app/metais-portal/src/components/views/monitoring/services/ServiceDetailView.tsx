import React, { useEffect, useState } from 'react'
import { CreateEntityButton, QueryFeedback, formatDateForDefaultValue } from '@isdd/metais-common/index'
import { useTranslation } from 'react-i18next'
import { BreadCrumbs, Filter, GridRow, HomeIcon, TextHeading } from '@isdd/idsk-ui-kit/index'
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
    setDefaultFilterValues: React.Dispatch<React.SetStateAction<MonitoringDetailFilterData>>
    tableDataParam?: EnumType
    handleFilterChange: (filter: IFilter) => void
}

export const ServiceDetailView: React.FC<IServiceDetailView> = ({
    data,
    detailData,
    isError,
    isLoading,
    defaultFilterValues,
    setDefaultFilterValues,
    queryParams,
    tableDataParam,
    handleFilterChange,
}) => {
    const { t } = useTranslation()
    const navigate = useNavigate()
    const [showEmptyMesage, setEmptyMesage] = useState<boolean>(false)

    const [emptyItems, setEmptyItems] = useState<boolean[]>([])
    document.title = `${t('titles.monitoringServicesDetail', { name: detailData?.name })} ${META_IS_TITLE}`

    useEffect(() => {
        if (emptyItems.find((item) => item === true)) {
            setEmptyMesage(true)
        } else {
            setEmptyMesage(false)
        }
    }, [emptyItems])
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
                        <TextHeading size="XL">{detailData?.name}</TextHeading>
                        <QueryFeedback loading={false} error={isError} />
                    </FlexColumnReverseWrapper>
                    <Filter<MonitoringDetailFilterData>
                        onlyForm
                        defaultFilterValues={defaultFilterValues}
                        customReset={(reset) => {
                            setDefaultFilterValues({
                                ...defaultFilterValues,
                                dateFrom: defaultFilterValues?.dateFrom,
                                dateTo: defaultFilterValues?.dateTo,
                            })
                            reset()
                        }}
                        handleOnSubmit={(filter) => {
                            handleFilterChange({
                                ...defaultFilterValues,
                                dateFrom: formatDateForDefaultValue(filter?.dateFrom ?? '', 'yyyy-MM-dd'),
                                dateTo: formatDateForDefaultValue(filter?.dateTo ?? '', 'yyyy-MM-dd'),
                            })
                        }}
                        form={({ register, setValue, control, watch }) => {
                            const start = watch('dateFrom')
                            const end = watch('dateTo')
                            const endIsLowerThanStart = start && end && new Date(start) > new Date(end)

                            return (
                                <div>
                                    <GridRow>
                                        <DateInput
                                            label={t('monitoringServices.table.from')}
                                            {...register('dateFrom')}
                                            control={control}
                                            setValue={setValue}
                                        />
                                        <DateInput
                                            label={t('monitoringServices.table.to')}
                                            {...register('dateTo')}
                                            control={control}
                                            setValue={setValue}
                                            error={endIsLowerThanStart ? t('codeListList.requestValidations.dateGreaterThan') : undefined}
                                        />
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
                            return (
                                <ServiceDetailViewGraphItem
                                    key={item.id}
                                    item={item}
                                    tableDataParam={tableDataParam}
                                    queryParams={queryParams}
                                    onIsEmpty={(isEmpty) => {
                                        setEmptyItems((prevItems) => [...prevItems, isEmpty])
                                    }}
                                />
                            )
                        }
                    })}
                    {showEmptyMesage && <p>{t('monitoring.noDataFind')}</p>}
                </div>
            </MainContentWrapper>
        </>
    )
}

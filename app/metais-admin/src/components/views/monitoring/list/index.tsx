import { Button, Filter, ILoadOptionsResponse, PaginatorWrapper, SelectLazyLoading, Table, TextHeading } from '@isdd/idsk-ui-kit/index'
import { IFilter } from '@isdd/idsk-ui-kit/types'
import { ATTRIBUTE_NAME, BASE_PAGE_NUMBER, BASE_PAGE_SIZE } from '@isdd/metais-common/api/constants'
import { useActionSuccess } from '@isdd/metais-common/contexts/actionSuccess/actionSuccessContext'
import { IFilterParams } from '@isdd/metais-common/hooks/useFilter'
import { ActionsOverTable, MutationFeedback, QueryFeedback } from '@isdd/metais-common/index'
import { AdminRouteNames } from '@isdd/metais-common/navigation/routeNames'
import { useTranslation } from 'react-i18next'
import { useLocation, useNavigate } from 'react-router-dom'
import { DEFAULT_PAGESIZE_OPTIONS } from '@isdd/metais-common/constants'
import { useScroll } from '@isdd/metais-common/hooks/useScroll'
import { useEffect } from 'react'
import { ApiActiveMonitoringCfgList } from '@isdd/metais-common/api/generated/monitoring-swagger'
import { ConfigurationItemUi } from '@isdd/metais-common/api/generated/cmdb-swagger'

import styles from '../monitoring.module.scss'

import { monitoringListColumns } from '@/components/views/monitoring/list/monitoringListFunc'

export interface IMonitoringListFilterData extends IFilterParams, IFilter {
    isvsUuid: string
}

export interface IMonitoringListView {
    monitoringCfgApiData: ApiActiveMonitoringCfgList | undefined
    defaultFilterValues: IMonitoringListFilterData
    filter: IFilter
    isLoadingNextPage: boolean
    handleFilterChange: (filter: IFilter) => void
    refetchListData: () => Promise<void>
    loadOptions: (searchQuery: string, additional: { page: number } | undefined) => Promise<ILoadOptionsResponse<ConfigurationItemUi>>
}

export const MonitoringListView: React.FC<IMonitoringListView> = ({
    monitoringCfgApiData,
    filter,
    defaultFilterValues,
    isLoadingNextPage,
    handleFilterChange,
    refetchListData,
    loadOptions,
}) => {
    const { t } = useTranslation()
    const navigate = useNavigate()
    const location = useLocation()
    const {
        isActionSuccess: { value: isSuccess, additionalInfo: additionalInfo },
    } = useActionSuccess()

    const newMonitoringHandler = () => {
        navigate(`${AdminRouteNames.MONITORING_CREATE}`, { state: { from: location } })
    }
    // const [ciValue, setCiValue] = useState<ConfigurationItemUi | undefined>(undefined)
    const { wrapperRef, scrollToMutationFeedback } = useScroll()

    useEffect(() => {
        if (isSuccess) {
            scrollToMutationFeedback()
            refetchListData()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isSuccess])

    return (
        <>
            <TextHeading size="XL">{t('monitoring.list.heading')}</TextHeading>
            {isSuccess && (
                <div ref={wrapperRef}>
                    <MutationFeedback
                        success
                        error={false}
                        successMessage={
                            additionalInfo?.type == 'create' ? t('mutationFeedback.successfulCreated') : t('mutationFeedback.successfulUpdated')
                        }
                    />
                </div>
            )}
            <Filter<IMonitoringListFilterData>
                heading={t('monitoring.list.filter.title')}
                defaultFilterValues={defaultFilterValues}
                form={({ setValue }) => (
                    <SelectLazyLoading<ConfigurationItemUi>
                        getOptionLabel={(item) =>
                            (item?.attributes && `(${item?.type ?? ''}) ${item?.attributes[ATTRIBUTE_NAME.Gen_Profil_nazov]}`) ?? ''
                        }
                        getOptionValue={(item) => item.uuid ?? ''}
                        loadOptions={(searchQuery, __, additional) => loadOptions(searchQuery, additional)}
                        label={`${t('monitoring.list.filter.ciLabel')}:`}
                        name="isvsUuid"
                        setValue={setValue}
                    />
                )}
            />
            <div className={styles.inline}>
                <Button type="submit" label={t('monitoring.list.newMonitoringButton')} onClick={() => newMonitoringHandler()} />
                <ActionsOverTable
                    pagination={{
                        pageNumber: filter.pageNumber || BASE_PAGE_NUMBER,
                        pageSize: filter.pageSize || BASE_PAGE_SIZE,
                        dataLength: monitoringCfgApiData?.pagination?.totalItems || 0,
                    }}
                    pagingOptions={DEFAULT_PAGESIZE_OPTIONS}
                    entityName=""
                    handleFilterChange={handleFilterChange}
                    hiddenButtons={{ SELECT_COLUMNS: true }}
                />
            </div>
            <QueryFeedback loading={isLoadingNextPage} withChildren>
                <Table
                    data={monitoringCfgApiData?.results}
                    columns={monitoringListColumns(t)}
                    sort={filter.sort ?? []}
                    onSortingChange={(columnSort) => {
                        handleFilterChange({ sort: columnSort })
                    }}
                />
            </QueryFeedback>
            <PaginatorWrapper
                pageNumber={filter.pageNumber || BASE_PAGE_NUMBER}
                pageSize={filter.pageSize || BASE_PAGE_SIZE}
                dataLength={monitoringCfgApiData?.pagination?.totalItems || 0}
                handlePageChange={handleFilterChange}
            />
        </>
    )
}

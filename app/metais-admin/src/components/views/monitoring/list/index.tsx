import { Button, Filter, PaginatorWrapper, SimpleSelect, Table, TextHeading } from '@isdd/idsk-ui-kit/index'
import { IFilter } from '@isdd/idsk-ui-kit/types'
import { BASE_PAGE_NUMBER, BASE_PAGE_SIZE } from '@isdd/metais-common/api/constants'
import { useActionSuccess } from '@isdd/metais-common/contexts/actionSuccess/actionSuccessContext'
import { IFilterParams } from '@isdd/metais-common/hooks/useFilter'
import { ActionsOverTable, MutationFeedback, QueryFeedback } from '@isdd/metais-common/index'
import { NavigationSubRoutes } from '@isdd/metais-common/navigation/routeNames'
import { useTranslation } from 'react-i18next'
import { useLocation, useNavigate } from 'react-router-dom'
import { DEFAULT_PAGESIZE_OPTIONS } from '@isdd/metais-common/constants'
import { useScroll } from '@isdd/metais-common/hooks/useScroll'
import { useEffect, useMemo } from 'react'
import { QueryObserverResult, RefetchOptions, RefetchQueryFilters } from '@tanstack/react-query'
import { Actions } from '@isdd/metais-common/hooks/permissions/useVotesListPermissions'
import { useAbilityContext } from '@isdd/metais-common/hooks/permissions/useAbilityContext'
import { ApiActiveMonitoringCfgList, ApiError } from '@isdd/metais-common/api/generated/monitoring-swagger'
import { ConfigurationItemSetUi } from '@isdd/metais-common/api/generated/cmdb-swagger'

import styles from '../monitoring.module.scss'

import { getCiListOptions, monitoringListColumns } from '@/components/views/monitoring/list/monitoringListFunc'

export interface IMonitoringListFilterData extends IFilterParams, IFilter {
    isvsUuid: string
}

export interface IMonitoringListView {
    isUserLogged: boolean
    monitoringCfgApiData: ApiActiveMonitoringCfgList | undefined
    ciListData: ConfigurationItemSetUi | undefined
    defaultFilterValues: IMonitoringListFilterData
    filter: IFilter
    isLoadingNextPage: boolean
    handleFilterChange: (filter: IFilter) => void
    getMonitoringListRefetch: <TPageData>(
        options?: (RefetchOptions & RefetchQueryFilters<TPageData>) | undefined,
    ) => Promise<QueryObserverResult<ApiActiveMonitoringCfgList, ApiError>>
}

export const MonitoringListView: React.FC<IMonitoringListView> = ({
    // isUserLogged,
    ciListData,
    monitoringCfgApiData,
    filter,
    defaultFilterValues,
    isLoadingNextPage,
    handleFilterChange,
    getMonitoringListRefetch,
}) => {
    const { t } = useTranslation()
    const navigate = useNavigate()
    const location = useLocation()
    const {
        isActionSuccess: { value: isSuccess, additionalInfo: additionalInfo },
    } = useActionSuccess()
    const ability = useAbilityContext()

    const newVoteHandler = () => {
        navigate(`${NavigationSubRoutes.ZOZNAM_HLASOV_CREATE}`, { state: { from: location } })
    }

    const ciListOptions = useMemo(() => getCiListOptions(ciListData), [ciListData])

    const { wrapperRef, scrollToMutationFeedback } = useScroll()

    useEffect(() => {
        if (isSuccess) {
            scrollToMutationFeedback()
            getMonitoringListRefetch()
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
                form={({ filter: listFilter, setValue }) => (
                    <div>
                        <SimpleSelect
                            id="voteState"
                            label={`${t('monitoring.list.filter.ciLabel')}:`}
                            options={ciListOptions}
                            setValue={setValue}
                            defaultValue={listFilter?.voteState}
                            name="voteState"
                        />
                    </div>
                )}
            />
            <div className={styles.inline}>
                {ability.can(Actions.CREATE, 'VOTE') ? (
                    <Button type="submit" label={t('votes.voteDetail.newVote')} onClick={() => newVoteHandler()} />
                ) : (
                    <div />
                )}
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

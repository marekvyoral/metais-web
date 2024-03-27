import { IFilter, Pagination } from '@isdd/idsk-ui-kit/types'
import {
    HistoryVersionsListUiConfigurationItemUi,
    useReadCiHistoryModifiedByList,
    useReadCiHistoryVersions,
    useReadCiHistoryVersionsActionsList,
} from '@isdd/metais-common/api/generated/cmdb-swagger'
import { mapFilterToHistoryVersionsApi } from '@isdd/metais-common/componentHelpers'
import { BASE_PAGE_NUMBER, BASE_PAGE_SIZE } from '@isdd/metais-common/constants'
import { useFilterParams } from '@isdd/metais-common/hooks/useFilter'
import React, { Dispatch, SetStateAction, useState } from 'react'

import { mapConfigurationItemHistoryListToPagination } from '@/componentHelpers/pagination'

export interface IView {
    data?: HistoryVersionsListUiConfigurationItemUi
    pagination: Pagination
    handleFilterChange: (filter: IFilter) => void
    isLoading: boolean
    isError: boolean
    filterActions?: string[]
    filterModifiedBy?: string[]
    selectedColumns: string[]
    setSelectedColumns: Dispatch<SetStateAction<string[]>>
}

export interface HistoryFilter extends IFilter {
    action?: string[]
    lastModifiedBy?: string[]
    fromDate?: string
    toDate?: string
}

export const defaultHistoryFilter = {
    pageNumber: BASE_PAGE_NUMBER,
    pageSize: BASE_PAGE_SIZE,
    action: [],
    lastModifiedBy: [],
    fromDate: '',
    toDate: '',
}

interface IDocumentsListContainer {
    configurationItemId: string
    View: React.FC<IView>
}

export const ConfigurationItemHistoryListContainer: React.FC<IDocumentsListContainer> = ({ configurationItemId, View }) => {
    const { filter, handleFilterChange } = useFilterParams<HistoryFilter>(defaultHistoryFilter)

    const {
        isLoading,
        isError,
        isFetching,
        data: historyList,
    } = useReadCiHistoryVersions(configurationItemId ?? '', mapFilterToHistoryVersionsApi(filter))

    const { data: filterActions, isLoading: isActionsLoading } = useReadCiHistoryVersionsActionsList(configurationItemId)
    const { data: filterModifiedBy, isLoading: isModifiedByLoading } = useReadCiHistoryModifiedByList(configurationItemId)

    const pagination = mapConfigurationItemHistoryListToPagination(filter, historyList)
    const [selectedColumns, setSelectedColumns] = useState<string[]>([])

    return (
        <View
            filterActions={filterActions}
            filterModifiedBy={filterModifiedBy}
            data={historyList}
            pagination={pagination}
            handleFilterChange={handleFilterChange}
            isLoading={isLoading || isFetching || isActionsLoading || isModifiedByLoading}
            isError={isError}
            selectedColumns={selectedColumns}
            setSelectedColumns={setSelectedColumns}
        />
    )
}

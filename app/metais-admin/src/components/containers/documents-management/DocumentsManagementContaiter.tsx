import { IFilter } from '@isdd/idsk-ui-kit/types'
import { ApiError, EnumItem, useGetValidEnum } from '@isdd/metais-common/api/generated/enums-repo-swagger'
import { DocumentGroup, useGetDocumentGroups, useGetPhaseMap, useSaveDocumentGroupHook } from '@isdd/metais-common/api/generated/kris-swagger'
import { BASE_PAGE_NUMBER, BASE_PAGE_SIZE, FAZA_PROJEKTU, STAV_PROJEKTU } from '@isdd/metais-common/constants'
import { IFilterParams, useFilterParams } from '@isdd/metais-common/hooks/useFilter'
import { QueryObserverResult, RefetchOptions, RefetchQueryFilters } from '@tanstack/react-query'
import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { QueryFeedback } from '@isdd/metais-common/index'

import { filterObjectByValue } from './utils'

export interface FilterMap {
    phase: EnumItem
    statuses: EnumItem[]
}

export interface DocumentFilterData extends IFilterParams, IFilter {
    phase: string
    status: string
}

export interface IView {
    isFetching?: boolean
    filterMap: FilterMap[]
    filter: DocumentFilterData
    data: DocumentGroup[]
    setData: Dispatch<SetStateAction<DocumentGroup[] | undefined>>
    statuses: EnumItem[]
    saveOrder: (groups: DocumentGroup[]) => void
    resetOrder: () => void
    handleFilterChange: (changedFilter: IFilter) => void
    refetchDocs: <TPageData>(
        options?: (RefetchOptions & RefetchQueryFilters<TPageData>) | undefined,
    ) => Promise<QueryObserverResult<DocumentGroup[], ApiError>>
}

export interface IDocumentsManagementContainerProps {
    View: React.FC<IView>
}

export const defaultFilter: DocumentFilterData = {
    phase: '',
    status: '',
    pageNumber: BASE_PAGE_NUMBER,
    pageSize: BASE_PAGE_SIZE,
    dataLength: 0,
}

export const DocumentsManagementContainer: React.FC<IDocumentsManagementContainerProps> = ({ View }) => {
    const saveGroup = useSaveDocumentGroupHook()

    const { data: phaseMap, isLoading: isLoadingPhaseMap } = useGetPhaseMap()
    const { data: projectStatus, isLoading: isLoadingEnum } = useGetValidEnum(STAV_PROJEKTU)
    const { data: projectPhase, isLoading: isLoadingPhase } = useGetValidEnum(FAZA_PROJEKTU)
    const [filterMap, setFilterMap] = useState<FilterMap[]>([])

    const { filter, handleFilterChange } = useFilterParams<DocumentFilterData>(defaultFilter)

    const { data: documentsData, refetch: refetchDocs, isFetching } = useGetDocumentGroups(filter.status, { query: { enabled: filter.status != '' } })
    const [dataRows, setDataRows] = useState<DocumentGroup[]>()

    useEffect(() => {
        if (documentsData != undefined) {
            setDataRows(documentsData)
        }
    }, [documentsData])

    useEffect(() => {
        if (phaseMap && projectStatus && projectPhase) {
            const map = projectPhase.enumItems?.map((phase) => ({
                phase: phase,
                statuses:
                    projectStatus.enumItems?.filter((s) => Object.keys(filterObjectByValue(phaseMap, phase.code ?? '')).includes(s.code ?? '')) ?? [],
            }))
            setFilterMap(map ?? [])
        }
    }, [phaseMap, projectPhase, projectStatus])

    useEffect(() => {
        setDataRows(documentsData?.slice(0, filter.pageSize))
    }, [documentsData, filter.pageSize])

    const saveOrder = (groups: DocumentGroup[]) => {
        groups.forEach((group) => {
            saveGroup(group)
        })
    }

    const resetOrder = () => {
        setDataRows(documentsData?.sort((a, b) => (a.position ?? 0) - (b.position ?? 0)))
    }

    return (
        <QueryFeedback loading={isLoadingPhaseMap || isLoadingEnum || isLoadingPhase}>
            <View
                isFetching={isFetching}
                refetchDocs={refetchDocs}
                filterMap={filterMap}
                filter={filter}
                data={dataRows ?? []}
                statuses={projectStatus?.enumItems ?? []}
                setData={setDataRows}
                saveOrder={saveOrder}
                resetOrder={resetOrder}
                handleFilterChange={handleFilterChange}
            />
        </QueryFeedback>
    )
}

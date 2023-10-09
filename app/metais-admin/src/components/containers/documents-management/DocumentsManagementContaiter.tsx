import { ISelectColumnType } from '@isdd/idsk-ui-kit/index'
import { IFilter } from '@isdd/idsk-ui-kit/types'
import { EnumItem, useGetValidEnum } from '@isdd/metais-common/api/generated/enums-repo-swagger'
import { DocumentGroup, useGetDocumentGroups, useGetPhaseMap, useSaveDocumentGroupHook } from '@isdd/metais-common/api/generated/kris-swagger'
import {
    BASE_PAGE_NUMBER,
    BASE_PAGE_SIZE,
    FAZA_PROJEKTU,
    STAV_PROJEKTU,
    documentsManagementDefaultSelectedColumns,
} from '@isdd/metais-common/constants'
import { IFilterParams, useFilterParams } from '@isdd/metais-common/hooks/useFilter'
import { Dispatch, SetStateAction, useEffect, useState } from 'react'

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
    filterMap: FilterMap[]
    filter: DocumentFilterData
    data: DocumentGroup[]
    setData: Dispatch<SetStateAction<DocumentGroup[] | undefined>>
    statuses: EnumItem[]
    saveOrder: (groups: DocumentGroup[]) => void
    resetOrder: () => void
    selectedColumns: ISelectColumnType[]
    setSelectedColumns: Dispatch<SetStateAction<ISelectColumnType[]>>
    handleFilterChange: (changedFilter: IFilter) => void
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

    const { data: phaseMap } = useGetPhaseMap()
    const { data: projectStatus } = useGetValidEnum(STAV_PROJEKTU)
    const { data: projectPhase } = useGetValidEnum(FAZA_PROJEKTU)
    const [filterMap, setFilterMap] = useState<FilterMap[]>([])

    const { filter, handleFilterChange } = useFilterParams<DocumentFilterData>(defaultFilter)

    const { data: documentsData } = useGetDocumentGroups(filter.status)
    const [dataRows, setDataRows] = useState<DocumentGroup[]>()

    const [selectedColumns, setSelectedColumns] = useState<ISelectColumnType[]>([...documentsManagementDefaultSelectedColumns])

    useEffect(() => {
        if (documentsData != undefined) {
            setDataRows(documentsData)
        }
    }, [documentsData])

    useEffect(() => {
        const map: FilterMap[] = []
        if (phaseMap != undefined && projectStatus != undefined && projectPhase != undefined) {
            projectPhase.enumItems?.forEach((phase) =>
                map.push({
                    phase: phase,
                    statuses:
                        projectStatus.enumItems?.filter((s) => Object.keys(filterObjectByValue(phaseMap, phase.code ?? '')).includes(s.code ?? '')) ??
                        [],
                }),
            )
            setFilterMap(map)
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
        <View
            filterMap={filterMap}
            filter={filter}
            data={dataRows ?? []}
            statuses={projectStatus?.enumItems ?? []}
            setData={setDataRows}
            saveOrder={saveOrder}
            resetOrder={resetOrder}
            selectedColumns={selectedColumns}
            setSelectedColumns={setSelectedColumns}
            handleFilterChange={handleFilterChange}
        />
    )
}

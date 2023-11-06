import { IFilter, Pagination, ColumnSort, SortType } from '@isdd/idsk-ui-kit/types'
import { ATTRIBUTE_NAME, Gui_Profil_RR, Reference_Registers } from '@isdd/metais-common'
import { mapFilterToRefRegisters } from '@isdd/metais-common/api/filter/filterApi'
import { ApiReferenceRegister, useGetFOPReferenceRegisters1 } from '@isdd/metais-common/api/generated/reference-registers-swagger'
import {
    columnsToIgnore,
    transformColumnsMap,
    useFilterForCiList,
    useGetColumnData,
    usePagination,
} from '@isdd/metais-common/api/hooks/containers/containerHelpers'
import { IFilterParams } from '@isdd/metais-common/hooks/useFilter'
import { FieldValues } from 'react-hook-form'
import { Attribute, useGetAttributeProfile } from '@isdd/metais-common/api/generated/types-repo-swagger'
import { FavoriteCiType } from '@isdd/metais-common/api/generated/user-config-swagger'

import { RefRegisterFilter } from '@/types/filters'

export interface IAtrributesContainerView {
    data: {
        referenceRegisters?: ApiReferenceRegister[]
        columnListData?: FavoriteCiType
        guiAttributes: Attribute[]
        renamedAttributes?: Attribute[]
    }
    handleFilterChange: (filter: IFilter) => void
    pagination: Pagination
    saveColumnSelection?: (columnSelection: FavoriteCiType) => Promise<void>
    resetColumns?: () => Promise<void>
    sort: ColumnSort[]
    isLoading: boolean
    isError: boolean
}

interface IRefRegisterListContainer<T> {
    View: React.FC<IAtrributesContainerView>
    defaultFilterValues: T
}

export const RefRegisterListContainer = <T extends FieldValues & IFilterParams>({ View, defaultFilterValues }: IRefRegisterListContainer<T>) => {
    const { filterParams, handleFilterChange } = useFilterForCiList<T, RefRegisterFilter>({
        ...defaultFilterValues,
        sort: [{ orderBy: ATTRIBUTE_NAME.ISVS_Name, sortDirection: SortType.ASC }],
    })
    const { columnListData, saveColumnSelection, resetColumns } = useGetColumnData(Reference_Registers, true)
    const { data: guiData } = useGetAttributeProfile(Gui_Profil_RR)

    const { data, isLoading, isError } = useGetFOPReferenceRegisters1(mapFilterToRefRegisters(filterParams))

    const pagination = usePagination({ pagination: { totaltems: data?.referenceRegistersCount ?? 0 } }, filterParams)

    const guiAttributes =
        guiData?.attributes
            ?.filter((item) => columnsToIgnore?.indexOf(item?.technicalName ?? '') === -1)
            ?.map((attr) => ({
                ...attr,
                technicalName: transformColumnsMap?.get(attr?.technicalName ?? '') ?? attr?.technicalName,
            })) ?? []

    return (
        <View
            data={{ referenceRegisters: data?.referenceRegistersList, columnListData, guiAttributes }}
            handleFilterChange={handleFilterChange}
            saveColumnSelection={saveColumnSelection}
            resetColumns={resetColumns}
            pagination={pagination}
            sort={filterParams?.sort ?? []}
            isLoading={isLoading}
            isError={isError}
        />
    )
}

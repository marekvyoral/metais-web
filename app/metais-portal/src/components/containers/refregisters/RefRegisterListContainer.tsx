import { ColumnSort, IFilter, Pagination, SortType } from '@isdd/idsk-ui-kit/types'
import { ATTRIBUTE_NAME, Gui_Profil_RR, Reference_Registers } from '@isdd/metais-common'
import { mapFilterToRefRegisters } from '@isdd/metais-common/api/filter/filterApi'
import { EnumType } from '@isdd/metais-common/api/generated/enums-repo-swagger'
import { ApiReferenceRegister, useGetFOPReferenceRegisters1 } from '@isdd/metais-common/api/generated/reference-registers-swagger'
import { Attribute, AttributeProfile, CiType, useGetAttributeProfile } from '@isdd/metais-common/api/generated/types-repo-swagger'
import { FavoriteCiType } from '@isdd/metais-common/api/generated/user-config-swagger'
import {
    columnsToIgnore,
    transformColumnsMap,
    useFilterForCiList,
    useGetColumnData,
    usePagination,
} from '@isdd/metais-common/api/hooks/containers/containerHelpers'
import { useAuth } from '@isdd/metais-common/contexts/auth/authContext'
import { useAttributesHook } from '@isdd/metais-common/hooks/useAttributes.hook'

import { useRowSelectionState } from '@/hooks/useRowSelectionState'
import { RefRegisterFilter } from '@/types/filters'
import { ColumnsOutputDefinition } from '@/componentHelpers/ci/ciTableHelpers'

export interface RefRegisterListContainerView {
    data: {
        referenceRegisters?: ApiReferenceRegister[]
        columnListData?: FavoriteCiType
        guiAttributes: Attribute[]
        attributeProfiles?: AttributeProfile[]
        ciTypeData: CiType | undefined
        constraintsData: (EnumType | undefined)[]
        unitsData?: EnumType
        renamedAttributes?: Attribute[]
    }
    defaultFilterValues: RefRegisterFilter
    handleFilterChange: (filter: IFilter) => void
    pagination: Pagination
    saveColumnSelection?: (columnSelection: FavoriteCiType) => Promise<void>
    resetColumns?: () => Promise<void>
    sort: ColumnSort[]
    isLoading: boolean
    isError: boolean
    rowSelection: Record<string, ColumnsOutputDefinition>
    setRowSelection: React.Dispatch<React.SetStateAction<Record<string, ColumnsOutputDefinition>>>
}

interface IRefRegisterListContainer {
    View: React.FC<RefRegisterListContainerView>
    entityName: string
}

const defaultFilterValues: RefRegisterFilter = { isvsUuid: '', managerUuid: '', registratorUuid: '', state: undefined, muk: undefined }

export const RefRegisterListContainer = ({ View, entityName }: IRefRegisterListContainer) => {
    const {
        state: { user },
    } = useAuth()
    const { filterParams, handleFilterChange } = useFilterForCiList({
        ...defaultFilterValues,
        sort: [{ orderBy: ATTRIBUTE_NAME.ISVS_Name, sortDirection: SortType.ASC }],
    })
    const { rowSelection, setRowSelection } = useRowSelectionState(entityName)

    const {
        attributeProfiles,
        ciTypeData,
        constraintsData,
        renamedAttributes,
        isError: isAttributesError,
        isLoading: isAttributesLoading,
        unitsData,
    } = useAttributesHook(entityName)

    const { columnListData, saveColumnSelection, resetColumns } = useGetColumnData(Reference_Registers, true)
    const { data: guiData } = useGetAttributeProfile(Gui_Profil_RR)

    const {
        data,
        isLoading: isRefRegisterLoading,
        isError: isRefRegisterError,
    } = useGetFOPReferenceRegisters1(mapFilterToRefRegisters(filterParams, user))

    const pagination = usePagination({ pagination: { totaltems: data?.referenceRegistersCount ?? 0 } }, filterParams)

    const guiAttributes =
        guiData?.attributes
            ?.filter((item) => columnsToIgnore?.indexOf(item?.technicalName ?? '') === -1)
            ?.map((attr) => ({
                ...attr,
                technicalName: transformColumnsMap?.get(attr?.technicalName ?? '') ?? attr?.technicalName,
            })) ?? []

    const isLoading = [isAttributesLoading, isRefRegisterLoading].some((item) => item)
    const isError = [isAttributesError, isRefRegisterError].some((item) => item)

    return (
        <View
            data={{
                referenceRegisters: data?.referenceRegistersList,
                columnListData,
                guiAttributes,
                unitsData,
                ciTypeData,
                constraintsData,
                attributeProfiles,
                renamedAttributes,
            }}
            defaultFilterValues={defaultFilterValues}
            handleFilterChange={handleFilterChange}
            saveColumnSelection={saveColumnSelection}
            resetColumns={resetColumns}
            pagination={pagination}
            sort={filterParams?.sort ?? []}
            isLoading={isLoading}
            isError={isError}
            rowSelection={rowSelection}
            setRowSelection={setRowSelection}
        />
    )
}

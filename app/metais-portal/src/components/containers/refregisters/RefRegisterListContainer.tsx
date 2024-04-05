import { ColumnSort, IFilter, Pagination, SortType } from '@isdd/idsk-ui-kit/types'
import { ATTRIBUTE_NAME, Gui_Profil_RR, QueryKeysByEntity, Reference_Registers } from '@isdd/metais-common'
import { mapFilterToRefRegistersFilter } from '@isdd/metais-common/api/filter/filterApi'
import { EnumType } from '@isdd/metais-common/api/generated/enums-repo-swagger'
import {
    ApiReferenceRegister,
    GetFOPReferenceRegisters1State,
    useGetFOPReferenceRegisters1,
} from '@isdd/metais-common/api/generated/reference-registers-swagger'
import { Attribute, AttributeProfile, CiType, useGetAttributeProfile } from '@isdd/metais-common/api/generated/types-repo-swagger'
import { FavoriteCiType } from '@isdd/metais-common/api/generated/user-config-swagger'
import {
    transformAttributes,
    transformRefRegisters,
    useFilterForCiList,
    useGetColumnData,
    usePagination,
} from '@isdd/metais-common/api/hooks/containers/containerHelpers'
import { useAuth } from '@isdd/metais-common/contexts/auth/authContext'
import { useAttributesHook } from '@isdd/metais-common/hooks/useAttributes.hook'
import { useMemo } from 'react'

import { ColumnsOutputDefinition } from '@/componentHelpers/ci/ciTableHelpers'
import { useRowSelectionState } from '@/hooks/useRowSelectionState'
import { RefRegisterFilter } from '@/types/filters'

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

const defaultFilterValues: RefRegisterFilter = {
    name: '',
    isvsUuid: '',
    managerUuid: '',
    registratorUuid: '',
    muk: undefined,
    state: undefined,
}

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
        isError: isAttributesError,
        isLoading: isAttributesLoading,
        unitsData,
    } = useAttributesHook(entityName)
    const { columnListData, saveColumnSelection, resetColumns } = useGetColumnData(Reference_Registers, true)
    const { data: guiData } = useGetAttributeProfile(Gui_Profil_RR)

    const queryParams = {
        ...mapFilterToRefRegistersFilter(filterParams, user),
        ...(!!filterParams?.attributeFilters?.stateCustom?.[0].value && {
            state: filterParams?.attributeFilters?.stateCustom?.[0].value as GetFOPReferenceRegisters1State,
        }),
    }
    const {
        data: refRegisterData,
        isLoading: isRefRegisterLoading,
        isFetching,
        isError: isRefRegisterError,
    } = useGetFOPReferenceRegisters1(queryParams, {
        query: {
            queryKey: [queryParams, QueryKeysByEntity.REFERENCE_REGISTERS],
        },
    })
    const data = useMemo(() => transformRefRegisters(refRegisterData), [refRegisterData])
    const transformedAttributes = useMemo(
        () => transformAttributes([...(ciTypeData?.attributes ?? []), ...(guiData?.attributes ?? [])]),
        [ciTypeData?.attributes, guiData?.attributes],
    )

    const pagination = usePagination({ pagination: { totaltems: data?.referenceRegistersCount ?? 0 } }, filterParams)
    const isLoading = [isAttributesLoading, isRefRegisterLoading, isFetching].some((item) => item)
    const isError = [isAttributesError, isRefRegisterError].some((item) => item)

    return (
        <View
            data={{
                referenceRegisters: data.referenceRegistersList,
                columnListData: columnListData,
                guiAttributes: transformedAttributes,
                unitsData,
                ciTypeData,
                constraintsData,
                attributeProfiles,
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

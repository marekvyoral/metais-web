import { IFilter, Pagination } from '@isdd/idsk-ui-kit/types'
import { ATTRIBUTE_NAME, BASE_PAGE_NUMBER, BASE_PAGE_SIZE, RefIdentifierTypeEnum } from '@isdd/metais-common/api'
import { ConfigurationItemSetUi, useReadCiList1 } from '@isdd/metais-common/api/generated/cmdb-swagger'
import { EnumType, useGetValidEnum } from '@isdd/metais-common/api/generated/enums-repo-swagger'
import { usePagination } from '@isdd/metais-common/api/hooks/containers/containerHelpers'
import { STAV_REGISTRACIE } from '@isdd/metais-common/constants'
import { useAuth } from '@isdd/metais-common/contexts/auth/authContext'
import { IFilterParams, OPERATOR_OPTIONS, useFilterParams } from '@isdd/metais-common/hooks/useFilter'
import { formatDateToIso } from '@isdd/metais-common/index'
import React, { useState } from 'react'
import { useUserPreferences } from '@isdd/metais-common/contexts/userPreferences/userPreferencesContext'

import { RefIdentifierListShowEnum } from '@/components/views/ref-identifiers/refIdentifierListProps'
import { ColumnsOutputDefinition } from '@/componentHelpers/ci/ciTableHelpers'

export interface RefIdentifierListFilterData extends IFilterParams, IFilter {
    type: RefIdentifierTypeEnum[]
    state: string
    createdAtFrom: string
    createdAtTo: string
    view: RefIdentifierListShowEnum
}

export interface RefIdentifiersContainerViewProps {
    data: ConfigurationItemSetUi | undefined
    registrationState: EnumType | undefined
    filter: IFilter
    defaultFilter: RefIdentifierListFilterData
    pagination: Pagination
    handleFilterChange: (filter: IFilter) => void
    isLoggedIn: boolean
    isLoading: boolean
    isError: boolean
    rowSelection: Record<string, ColumnsOutputDefinition>
    setRowSelection: React.Dispatch<React.SetStateAction<Record<string, ColumnsOutputDefinition>>>
}

interface RefIdentifiersContainerProps {
    View: React.FC<RefIdentifiersContainerViewProps>
}

const refIdentifierTypes = [
    RefIdentifierTypeEnum.URIKatalog,
    RefIdentifierTypeEnum.DatovyPrvok,
    RefIdentifierTypeEnum.URIDataset,
    RefIdentifierTypeEnum.Individuum,
]

export const RefIdentifiersContainer: React.FC<RefIdentifiersContainerProps> = ({ View }) => {
    const {
        state: { user },
    } = useAuth()

    const isLoggedIn = !!user
    const { currentPreferences } = useUserPreferences()
    const defaultFilter: RefIdentifierListFilterData = {
        pageNumber: BASE_PAGE_NUMBER,
        pageSize: Number(currentPreferences.defaultPerPage) ?? BASE_PAGE_SIZE,
        type: [] as RefIdentifierTypeEnum[],
        state: '',
        createdAtFrom: '',
        createdAtTo: '',
        view: RefIdentifierListShowEnum.ALL,
    }

    const { filter, handleFilterChange } = useFilterParams<RefIdentifierListFilterData>(defaultFilter)

    const [rowSelection, setRowSelection] = useState<Record<string, ColumnsOutputDefinition>>({})

    const { data: registrationState, isLoading: isDefaultStatesLoading } = useGetValidEnum(STAV_REGISTRACIE)

    const {
        data: tableData,
        isLoading: isReadCiListLoading,
        isFetching: isReadCiListFetching,
        isError: isReadCiListError,
    } = useReadCiList1({
        page: filter.pageNumber,
        perpage: filter.pageSize,
        sortBy: ATTRIBUTE_NAME.Gen_Profil_nazov,
        sortType: filter.sort?.[0]?.sortDirection,
        filter: {
            attributes: [
                { name: ATTRIBUTE_NAME.Gen_Profil_RefID_stav_registracie, filterValue: [{ value: filter.state, equality: OPERATOR_OPTIONS.EQUAL }] },
            ],
            type: filter.type?.length ? filter.type : refIdentifierTypes,
            metaAttributes: {
                state: ['DRAFT'],
                createdBy: isLoggedIn && filter.view === RefIdentifierListShowEnum.ONLY_MY ? [user?.login] : undefined,
                createdAtFrom: formatDateToIso(filter.createdAtFrom),
                createdAtTo: formatDateToIso(filter.createdAtTo),
            },
        },
    })

    const pagination = usePagination(tableData, filter)

    const isLoading = [isDefaultStatesLoading, isReadCiListLoading, isReadCiListFetching].some((item) => item)
    const isError = [isReadCiListError].some((item) => item)

    return (
        <View
            rowSelection={rowSelection}
            setRowSelection={setRowSelection}
            data={tableData}
            registrationState={registrationState}
            defaultFilter={defaultFilter}
            isLoggedIn={isLoggedIn}
            isLoading={isLoading}
            isError={isError}
            pagination={pagination}
            filter={filter}
            handleFilterChange={handleFilterChange}
        />
    )
}

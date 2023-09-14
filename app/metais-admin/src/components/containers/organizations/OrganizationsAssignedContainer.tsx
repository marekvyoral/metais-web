import { ColumnSort, IFilter, Pagination } from '@isdd/idsk-ui-kit/types'
import { ConfigurationItemUi } from '@isdd/metais-common'
import { IFilterParams } from '@isdd/metais-common/hooks/useFilter'
import React from 'react'
import { FieldValues } from 'react-hook-form'

import { useAssignOrganizations } from '@/components/views/organizations/hooks/useAssignOrganizations'

export interface ConfItemWithBlockedAndMessage extends ConfigurationItemUi {
    blocked: boolean
    blockMessage?: string
}

export interface IOrganizationDetail {
    assignedOrganizations?: ConfigurationItemUi[] | undefined
    tableData?: ConfItemWithBlockedAndMessage[] | undefined
}

export interface IAtrributesContainerView {
    data: IOrganizationDetail
    pagination: Pagination
    sort: ColumnSort[]
    isLoading: boolean
    isError: boolean
    handleFilterChange: (filter: IFilter) => void
    onSubmit: (selectedConfItem: ConfigurationItemUi[]) => Promise<void>
}

interface AttributesContainer<T> {
    entityId: string
    entityName: string
    defaultFilterValues: T
    defaultFilterOperators?: T
    icoOfDetailOrg: string
    onlyFreePO: boolean
    View: React.FC<IAtrributesContainerView>
}

export const OrganizationsAssignedContainer = <T extends FieldValues & IFilterParams>({
    entityId,
    entityName,
    View,
    icoOfDetailOrg,
    onlyFreePO,
    defaultFilterValues,
    defaultFilterOperators,
}: AttributesContainer<T>) => {
    const { tableDataWithBlockAttribute, pagination, handleSave, handleFilterChange, sort, isLoading, isError, allOrganizations } =
        useAssignOrganizations({
            entityId,
            entityName,
            onlyFreePO,
            orgIco: icoOfDetailOrg,
            defaultFilterValues,
            defaultFilterOperators,
        })

    return (
        <View
            data={{
                assignedOrganizations: allOrganizations,
                tableData: tableDataWithBlockAttribute,
            }}
            pagination={pagination}
            handleFilterChange={handleFilterChange}
            sort={sort}
            isLoading={isLoading}
            isError={isError}
            onSubmit={handleSave}
        />
    )
}

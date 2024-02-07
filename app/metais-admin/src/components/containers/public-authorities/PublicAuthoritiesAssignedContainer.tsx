import { ColumnSort, IFilter, Pagination } from '@isdd/idsk-ui-kit/types'
import { ConfigurationItemUi } from '@isdd/metais-common/api/generated/cmdb-swagger'
import { IFilterParams } from '@isdd/metais-common/hooks/useFilter'
import React from 'react'
import { FieldValues } from 'react-hook-form'

import { useAssignPublicAuthorities } from '@/components/views/public-authorities/hooks/useAssignPublicAuthorities'

export interface ConfItemWithBlockedAndMessage extends ConfigurationItemUi {
    blocked: boolean
    blockMessage?: string
}

export interface IPublicAuthoritiesDetail {
    assignedOrganizations?: ConfigurationItemUi[] | undefined
    tableData?: ConfItemWithBlockedAndMessage[] | undefined
}

export interface IPublicAuthoritiesAssignedContainerView {
    data: IPublicAuthoritiesDetail
    pagination: Pagination
    sort: ColumnSort[]
    isLoading: boolean
    isError: boolean
    handleFilterChange: (filter: IFilter) => void
    onSubmit: (selectedConfItem: ConfigurationItemUi[]) => Promise<void>
}

interface IPublicAuthoritiesAssignedContainer<T> {
    entityId: string
    entityName: string
    defaultFilterValues: T
    defaultFilterOperators?: T
    icoOfDetailOrg: string
    View: React.FC<IPublicAuthoritiesAssignedContainerView>
}

export const PublicAuthoritiesAssignedContainer = <T extends FieldValues & IFilterParams>({
    entityId,
    entityName,
    View,
    icoOfDetailOrg,
    defaultFilterValues,
    defaultFilterOperators,
}: IPublicAuthoritiesAssignedContainer<T>) => {
    const { tableDataWithBlockAttribute, pagination, handleSave, handleFilterChange, sort, isLoading, isError, allOrganizations } =
        useAssignPublicAuthorities({
            entityId,
            entityName,
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

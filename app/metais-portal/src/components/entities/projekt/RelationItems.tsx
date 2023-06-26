import React from 'react'
import { Tabs } from '@isdd/idsk-ui-kit/tabs/Tabs'
import { Pagination, IFilter } from '@isdd/idsk-ui-kit/types'

import { ApplicationServiceRelations } from './ApplicationServiceRelations'

import { CiWithRelsResultUi, ReadCiNeighboursWithAllRelsUsingGETParams, RelatedCiTypePreview, RoleParticipantUI } from '@/api'
import { IKeyToDisplay } from '@/hooks/useEntityRelations'

interface RelationItemsProps {
    isLoading: boolean
    isError: boolean
    data: {
        entityTypes?: RelatedCiTypePreview[]
        relationsList?: CiWithRelsResultUi
        owners?: void | RoleParticipantUI[] | undefined
        keysToDisplay: IKeyToDisplay[]
    }
    pagination: Pagination
    handleFilterChange: (filter: IFilter) => void
    setPageConfig: (value: React.SetStateAction<ReadCiNeighboursWithAllRelsUsingGETParams>) => void
}

export const RelationItems: React.FC<RelationItemsProps> = ({ isLoading, isError, data, pagination, handleFilterChange, setPageConfig }) => {
    return (
        <Tabs
            tabList={data.keysToDisplay.map((key) => ({
                id: key.technicalName,
                title: key.tabName,
                content: (
                    <ApplicationServiceRelations
                        isLoading={isLoading}
                        isError={isError}
                        data={data}
                        pagination={pagination}
                        handleFilterChange={handleFilterChange}
                    />
                ),
            }))}
            onSelect={(selected) => {
                setPageConfig((pageConfig) => ({ ...pageConfig, ciTypes: [selected.id ?? ''], page: 1 }))
            }}
        />
    )
}

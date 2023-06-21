import React from 'react'
import { useParams } from 'react-router-dom'
import { Tab, Tabs } from '@isdd/idsk-ui-kit/tabs/Tabs'
import { IFilter, Pagination } from '@isdd/idsk-ui-kit/types'
import { PaginatorWrapper } from '@isdd/metais-common/paginatorWrapper/PaginatorWrapper'

import { CiContainer } from '@/components/containers/CiContainer'
import { AttributesContainer } from '@/components/containers/AttributesContainer'
import { ProjectInformationAccordion } from '@/components/entities/projekt/accordion/ProjectInformationAccordion'
import { IRelationsView, RelationsListContainer } from '@/components/containers/RelationsListContainer'
import { ApplicationServiceRelations } from '@/components/entities/projekt/ApplicationServiceRelations'
interface IRelationTablist {
    isLoading: boolean
    isError: boolean
    data: IRelationsView['data']
    pagination: Pagination
    handleFilterChange: (filter: IFilter) => void
}

const relationTablist = ({ isLoading, isError, data, pagination, handleFilterChange }: IRelationTablist): Tab[] =>
    data.keysToDisplay.map((key) => {
        let content = (
            <>
                <ApplicationServiceRelations entityTypes={data.entityTypes} relationsList={data.relationsList} owners={data.owners} />
                <PaginatorWrapper pagination={pagination} handlePageChange={handleFilterChange} />
            </>
        )
        if (isLoading && !data.relationsList?.pagination) {
            content = <div>Loading...</div>
        }
        if (isError) {
            content = <div>Error</div>
        }
        return {
            id: key.technicalName,
            title: key.tabName,
            content,
        }
    })

const Informations = () => {
    const { entityName, entityId } = useParams()

    return (
        <>
            <CiContainer
                configurationItemId={entityId ?? ''}
                View={({ data: ciItemData }) => {
                    return (
                        <AttributesContainer
                            entityName={entityName ?? ''}
                            View={({ data: { ciTypeData, constraintsData, unitsData } }) => {
                                return <ProjectInformationAccordion data={{ ciItemData, constraintsData, ciTypeData, unitsData }} />
                            }}
                        />
                    )
                }}
            />
            <RelationsListContainer
                entityId={entityId ?? ''}
                technicalName={entityName ?? ''}
                View={({ isLoading, isError, data, pagination, handleFilterChange, setPageConfig }) => {
                    return (
                        <Tabs
                            tabList={relationTablist({ isLoading, isError, data, pagination, handleFilterChange })}
                            onSelect={(selected) => {
                                setPageConfig((pageConfig) => ({ ...pageConfig, ciTypes: [selected.id ?? ''] }))
                            }}
                        />
                    )
                }}
            />
        </>
    )
}

export default Informations

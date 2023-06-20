import React from 'react'
import { Outlet, useParams } from 'react-router-dom'

import { CiContainer } from '@/components/containers/CiContainer'
import { AttributesContainer } from '@/components/containers/AttributesContainer'
import { ProjectInformationAccordion } from '@/components/entities/projekt/accordion/ProjectInformationAccordion'
import { IRelationsView, RelationsListContainer } from '@/components/containers/RelationsListContainer'
import { Tab, Tabs } from '@/components/tabs/Tabs'
import { ApplicationServiceRelations } from '@/components/entities/projekt/ApplicationServiceRelations'
interface IRelationTablist {
    isLoading: boolean
    isError: boolean
    data: IRelationsView['data']
}

const Informations = () => {
    const { entityName, entityId } = useParams()

    const relationTablist = ({ isLoading, isError, data }: IRelationTablist): Tab[] =>
        data.keysToDisplay.map((key) => {
            let content = <ApplicationServiceRelations entityTypes={data.entityTypes} relationsList={data.relationsList} owners={data.owners} />
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
                View={({ isLoading, isError, data, setClickedEntityName }) => {
                    return (
                        <Tabs
                            tabList={relationTablist({ isLoading, isError, data })}
                            onSelect={(selected) => {
                                setClickedEntityName(selected.id ?? '')
                            }}
                        />
                    )
                }}
            />
        </>
    )
}

export default Informations

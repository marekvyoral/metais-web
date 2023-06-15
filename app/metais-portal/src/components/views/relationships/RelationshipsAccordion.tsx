import React from 'react'
import { useTranslation } from 'react-i18next'

import { TableCols } from '../documents'

import { RelationshipsTable } from './RelationshipTable'
import { targetTableColumns } from './RelationshipsTargetTableColumns'
import { sourceTableColumns } from './RelationshipsSourceTableColumns'

import { AccordionContainer } from '@/components/Accordion'
import { RelationshipsTableContainer } from '@/components/containers/RelationshipsTableContainer'
import { sourceTableDefaultFilter, targetTableDefualtFilter } from '@/components/containers/RelationshipFilters'
import { mapCiDataFrom, mapCiDataTo } from '@/components/containers/DocumentListContainer'

interface RelationshipsAccordion {
    data?: TableCols //missing return types from orval, types should come from backend, not from _GeneratedType file
    isLoading: boolean
    isError: boolean
    configurationItemId?: string
}

const Loading: React.FC = () => {
    return <div>loading</div>
}

const Error: React.FC = () => {
    return <div>error</div>
}

export const RelationshipsAccordion: React.FC<RelationshipsAccordion> = ({ data, isLoading, isError, configurationItemId }) => {
    const { t } = useTranslation()
    if (isLoading) return <Loading />
    if (isError) return <Error />

    return (
        <>
            <AccordionContainer
                sections={[
                    { title: t('relationshipsTab.relationshipsVisualization'), content: 'todo: graph' },

                    {
                        title: t('relationshipsTab.tableViewSelectedItemSource', {
                            selectedItem: data?.configurationItem?.attributes?.Gen_Profil_nazov,
                        }),
                        content: (
                            <RelationshipsTableContainer
                                configurationItemId={configurationItemId}
                                defaultFilter={targetTableDefualtFilter}
                                mapData={mapCiDataFrom} //this is temporary, KV mapping should be done by orval
                                View={(props) => {
                                    return (
                                        <RelationshipsTable
                                            data={props?.data}
                                            columns={targetTableColumns(t)}
                                            isLoading={props.isLoading}
                                            isError={props.isError}
                                        />
                                    )
                                }}
                            />
                        ),
                    },

                    {
                        title: t('relationshipsTab.tableViewSelectedItemSource', {
                            selectedItem: data?.configurationItem?.attributes?.Gen_Profil_nazov,
                        }),
                        content: (
                            <RelationshipsTableContainer
                                configurationItemId={configurationItemId}
                                defaultFilter={sourceTableDefaultFilter}
                                mapData={mapCiDataTo} //this is temporary, KV mapping should be done by orval
                                View={(props) => {
                                    return (
                                        <RelationshipsTable
                                            data={props?.data}
                                            columns={sourceTableColumns(t)}
                                            isLoading={props.isLoading}
                                            isError={props.isError}
                                        />
                                    )
                                }}
                            />
                        ),
                    },
                ]}
            />
        </>
    )
}

import React from 'react'

import { AccordionContainer } from '@/components/Accordion'
import { useTranslation } from 'react-i18next'
import { RelationshipsTableContainer } from '@/components/containers/RelationshipsTableContainer'
import { RelationshipsTable } from './RelationshipTable'
import { targetTableColumns } from './RelationshipsTargetTableColumns'
import { sourceTableColumns } from './RelationshipsSourceTableColumns'
import { sourceTableDefaultFilter, targetTableDefualtFilter } from '@/components/containers/RelationshipFilters'
import { mapCiDataFrom, mapCiDataTo } from '@/components/containers/DocumentListContainer'
import { TableCols } from '../documents'

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
                        title: t('relationshipsTab.tableViewSelectedItemSource', { selectedItem: data?.attributes?.Gen_Profil_nazov }),
                        content: (
                            <RelationshipsTableContainer
                                configurationItemId={configurationItemId}
                                defaultFilter={targetTableDefualtFilter}
                                mapData={mapCiDataFrom}
                                View={(props) => {
                                    return (
                                        <RelationshipsTable
                                            data={props?.data}
                                            columns={targetTableColumns()}
                                            isLoading={props.isLoading}
                                            isError={props.isError}
                                        />
                                    )
                                }}
                            />
                        ),
                    },

                    {
                        title: t('relationshipsTab.tableViewSelectedItemSource', { selectedItem: data?.attributes?.Gen_Profil_nazov }),
                        content: (
                            <RelationshipsTableContainer
                                configurationItemId={configurationItemId}
                                defaultFilter={sourceTableDefaultFilter}
                                mapData={mapCiDataTo}
                                View={(props) => {
                                    return (
                                        <RelationshipsTable
                                            data={props?.data}
                                            columns={sourceTableColumns()}
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

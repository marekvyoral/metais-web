import React from 'react'
import { useTranslation } from 'react-i18next'

import { RelationshipsTable } from './RelationshipTable'
import { targetTableColumns } from './RelationshipsTargetTableColumns'
import { sourceTableColumns } from './RelationshipsSourceTableColumns'

import { AccordionContainer } from '@/components/Accordion'
import { RelationshipsTableContainer } from '@/components/containers/RelationshipsTableContainer'
import { sourceTableDefaultFilter, targetTableDefualtFilter } from '@/components/containers/RelationshipFilters'
import { ConfigurationItemUi } from '@/api'

interface RelationshipsAccordion {
    data?: ConfigurationItemUi
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
                            selectedItem: data?.attributes?.Gen_Profil_nazov,
                        }),
                        content: (
                            <RelationshipsTableContainer
                                configurationItemId={configurationItemId}
                                defaultFilter={targetTableDefualtFilter}
                                View={(props) => {
                                    return (
                                        <RelationshipsTable
                                            data={props?.data?.fromNodes?.neighbourPairs}
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
                        title: t('relationshipsTab.tableViewSelectedItemTarget', {
                            selectedItem: data?.attributes?.Gen_Profil_nazov,
                        }),
                        content: (
                            <RelationshipsTableContainer
                                configurationItemId={configurationItemId}
                                defaultFilter={sourceTableDefaultFilter}
                                View={(props) => {
                                    return (
                                        <RelationshipsTable
                                            data={props?.data?.toNodes?.neighbourPairs}
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

import React from 'react'
import { useTranslation } from 'react-i18next'
import { AccordionContainer } from '@isdd/idsk-ui-kit/accordion/Accordion'
import { ConfigurationItemUi } from '@isdd/metais-common/api'

import { RelationshipsTable } from './RelationshipTable'
import { targetTableColumns } from './RelationshipsTargetTableColumns'
import { sourceTableColumns } from './RelationshipsSourceTableColumns'

import { CiNeighboursListContainer } from '@/components/containers/CiNeighboursListContainer'
import { NeighboursApiType } from '@/components/containers/RelationshipFilters'

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
                            <CiNeighboursListContainer
                                configurationItemId={configurationItemId}
                                apiType={NeighboursApiType.source}
                                View={(props) => {
                                    return (
                                        <RelationshipsTable
                                            data={props?.data?.fromNodes?.neighbourPairs}
                                            columns={targetTableColumns(t)}
                                            isLoading={props.isLoading}
                                            isError={props.isError}
                                            pagination={props.pagination}
                                            handleFilterChange={props.handleFilterChange}
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
                            <CiNeighboursListContainer
                                configurationItemId={configurationItemId}
                                apiType={NeighboursApiType.target}
                                View={(props) => {
                                    return (
                                        <RelationshipsTable
                                            data={props?.data?.toNodes?.neighbourPairs}
                                            columns={sourceTableColumns(t)}
                                            isLoading={props.isLoading}
                                            isError={props.isError}
                                            pagination={props.pagination}
                                            handleFilterChange={props.handleFilterChange}
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

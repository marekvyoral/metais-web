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
    configurationItemId?: string
}

export const RelationshipsAccordion: React.FC<RelationshipsAccordion> = ({ data, configurationItemId }) => {
    const { t } = useTranslation()

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

import { AccordionContainer } from '@isdd/idsk-ui-kit/accordion/Accordion'
import { ConfigurationItemUi } from '@isdd/metais-common/api/generated/cmdb-swagger'
import { QueryFeedback } from '@isdd/metais-common/index'
import React from 'react'
import { useTranslation } from 'react-i18next'

import { RelationshipsTable } from './RelationshipTable'

import { CiNeighboursListContainer } from '@/components/containers/CiNeighboursListContainer'
import RelationshipGraph from '@/components/views/relationships/RelationshipGraph'

export enum NeighboursApiType {
    source,
    target,
}
interface RelationshipsAccordion {
    data?: ConfigurationItemUi
    configurationItemId?: string
    isLoading: boolean
    isError: boolean
    entityName: string
}

export const RelationshipsAccordion: React.FC<RelationshipsAccordion> = ({ data, configurationItemId, isError, isLoading, entityName }) => {
    const { t } = useTranslation()

    return (
        <QueryFeedback loading={isLoading} error={isError} withChildren>
            <AccordionContainer
                sections={[
                    {
                        title: t('relationshipsTab.relationshipsVisualization'),
                        content: <RelationshipGraph data={data} />,
                    },
                    {
                        title: t('relationshipsTab.tableViewSelectedItemSource', {
                            selectedItem: data?.attributes?.Gen_Profil_nazov,
                        }),
                        content: (
                            <CiNeighboursListContainer
                                entityName={entityName}
                                configurationItemId={configurationItemId}
                                apiType={NeighboursApiType.source}
                                View={(props) => {
                                    return <RelationshipsTable {...props} />
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
                                entityName={entityName}
                                configurationItemId={configurationItemId}
                                apiType={NeighboursApiType.target}
                                View={(props) => {
                                    return <RelationshipsTable {...props} />
                                }}
                            />
                        ),
                    },
                ]}
            />
        </QueryFeedback>
    )
}

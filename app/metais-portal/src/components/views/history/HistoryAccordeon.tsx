import { AccordionContainer } from '@isdd/idsk-ui-kit/accordion/Accordion'
import React from 'react'
import { useTranslation } from 'react-i18next'

import { ConfigurationItemHistoryListTable } from './ConfigurationItemHistoryListTable'

import { ConfigurationItemHistoryDetailContainer } from '@/components/containers/ConfigurationItemHistoryDetailContainer'
import { ConfigurationItemHistoryListContainer } from '@/components/containers/ConfigurationItemHistoryListContainer'

interface RelationshipsAccordion {
    entityId: string
    basePath?: string
}

export const HistoryAccordion: React.FC<RelationshipsAccordion> = ({ entityId, basePath }) => {
    const { t } = useTranslation()

    return (
        <AccordionContainer
            sections={[
                {
                    title: t('historyTab.configurationItem'),
                    content: <ConfigurationItemHistoryDetailContainer configurationItemId={entityId} />,
                },

                {
                    title: t('historyTab.configurationItemTable'),
                    content: (
                        <ConfigurationItemHistoryListContainer
                            configurationItemId={entityId}
                            View={(props) => {
                                return (
                                    <ConfigurationItemHistoryListTable
                                        filterModifiedBy={props.filterModifiedBy}
                                        filterActions={props.filterActions}
                                        data={props?.data?.historyVersions}
                                        handleFilterChange={props.handleFilterChange}
                                        isLoading={props.isLoading}
                                        isError={props.isError}
                                        pagination={props.pagination}
                                        basePath={basePath}
                                        selectedColumns={props.selectedColumns}
                                        setSelectedColumns={props.setSelectedColumns}
                                    />
                                )
                            }}
                        />
                    ),
                },
            ]}
        />
    )
}

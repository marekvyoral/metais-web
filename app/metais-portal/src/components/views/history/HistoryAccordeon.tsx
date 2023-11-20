import React from 'react'
import { useTranslation } from 'react-i18next'
import { AccordionContainer } from '@isdd/idsk-ui-kit/accordion/Accordion'

import { ConfigurationItemHistoryDetailContainer } from '../../containers/ConfigurationItemHistoryDetailContainer'

import { ConfigurationItemHistoryListTable } from './ConfigurationItemHistoryListTable'

import { CiContainer } from '@/components/containers/CiContainer'
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
                    content: (
                        <CiContainer
                            configurationItemId={entityId}
                            View={(ciData) => {
                                return (
                                    <ConfigurationItemHistoryDetailContainer
                                        configurationItemId={entityId}
                                        data={ciData?.data?.ciItemData}
                                        isLoading={ciData.isLoading}
                                        isError={ciData.isError}
                                    />
                                )
                            }}
                        />
                    ),
                },

                {
                    title: t('historyTab.configurationItemTable'),
                    content: (
                        <ConfigurationItemHistoryListContainer
                            configurationItemId={entityId}
                            View={(props) => {
                                return (
                                    <ConfigurationItemHistoryListTable
                                        data={props?.data?.historyVersions}
                                        handleFilterChange={props.handleFilterChange}
                                        isLoading={props.isLoading}
                                        isError={props.isError}
                                        pagination={props.pagination}
                                        basePath={basePath}
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

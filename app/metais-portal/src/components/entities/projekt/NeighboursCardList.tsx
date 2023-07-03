import React from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '@isdd/idsk-ui-kit/button/Button'
import { Pagination, IFilter } from '@isdd/idsk-ui-kit/types'
import { Tabs } from '@isdd/idsk-ui-kit/tabs/Tabs'
import { PaginatorWrapper } from '@isdd/idsk-ui-kit/paginatorWrapper/PaginatorWrapper'
import { QueryFeedback } from '@isdd/metais-common'

import { RelationCard } from './cards/RelationCard'
import { CardColumnList } from './cards/CardColumnList'
import { ListActions } from './lists/ListActions'
import styles from './neighboursCardList.module.scss'

import { IRelationsView } from '@/components/containers/RelationsListContainer'
import { formatRelationAttributes } from '@/componentHelpers'
import { ReadCiNeighboursWithAllRelsUsingGETParams } from '@/api'

interface NeighboursCardListProps {
    isLoading: boolean
    isError: boolean
    data: IRelationsView['data']
    pagination: Pagination
    handleFilterChange: (filter: IFilter) => void
    setPageConfig: (value: React.SetStateAction<ReadCiNeighboursWithAllRelsUsingGETParams>) => void
}

export const NeighboursCardList: React.FC<NeighboursCardListProps> = ({
    isLoading,
    isError,
    data,
    pagination,
    handleFilterChange,
    setPageConfig,
}) => {
    const { t } = useTranslation()
    const { entityTypes, relationsList, owners } = data

    return (
        <Tabs
            tabList={data.keysToDisplay.map((key) => ({
                id: key.technicalName,
                title: key.tabName,
                content: (
                    <QueryFeedback loading={isLoading && !data.relationsList?.pagination} error={isError}>
                        <ListActions>
                            <Button
                                className={styles.buttonWithoutMarginBottom}
                                label={t('neighboursCardList.buttonAddNewRelation')}
                                variant="secondary"
                            />
                            <Button
                                className={styles.buttonWithoutMarginBottom}
                                label={t('neighboursCardList.buttonAddNewRelationCard')}
                                variant="secondary"
                            />
                        </ListActions>
                        <CardColumnList>
                            {relationsList?.ciWithRels?.map((ciWithRel) => {
                                const formatedCiWithRel = formatRelationAttributes(ciWithRel, entityTypes, owners, t)
                                return <RelationCard {...formatedCiWithRel} key={formatedCiWithRel?.name} />
                            })}
                        </CardColumnList>
                        <PaginatorWrapper {...pagination} handlePageChange={handleFilterChange} />
                    </QueryFeedback>
                ),
            }))}
            onSelect={(selected) => {
                setPageConfig((pageConfig) => ({ ...pageConfig, ciTypes: [selected.id ?? ''], page: 1 }))
            }}
        />
    )
}

import React from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '@isdd/idsk-ui-kit/button/Button'
import { Pagination, IFilter } from '@isdd/idsk-ui-kit/types'
import { Tabs } from '@isdd/idsk-ui-kit/tabs/Tabs'
import { PaginatorWrapper } from '@isdd/idsk-ui-kit/paginatorWrapper/PaginatorWrapper'
import { QueryFeedback } from '@isdd/metais-common'
import { ReadCiNeighboursWithAllRelsParams } from '@isdd/metais-common/api'
import { TextHeading } from '@isdd/idsk-ui-kit/index'

import { RelationCard } from './cards/RelationCard'
import { CardColumnList } from './cards/CardColumnList'
import { ListActions } from './lists/ListActions'

import { IRelationsView } from '@/components/containers/RelationsListContainer'
import { formatRelationAttributes } from '@/componentHelpers'

interface NeighboursCardListProps {
    isLoading: boolean
    isError: boolean
    data: IRelationsView['data']
    pagination: Pagination
    handleFilterChange: (filter: IFilter) => void
    setPageConfig: (value: React.SetStateAction<ReadCiNeighboursWithAllRelsParams>) => void
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
        <>
            {!!data?.keysToDisplay?.length && <TextHeading size="XL">{t('neighboursCardList.heading')}</TextHeading>}
            <Tabs
                tabList={data?.keysToDisplay.map((key) => ({
                    id: key?.technicalName,
                    title: key?.tabName,
                    content: (
                        <QueryFeedback
                            loading={isLoading && !data.relationsList?.pagination}
                            error={isError}
                            errorProps={{ errorMessage: t('feedback.failedFetch') }}
                        >
                            <ListActions>
                                <Button className={'marginBottom0'} label={t('neighboursCardList.buttonAddNewRelation')} variant="secondary" />
                                <Button className={'marginBottom0'} label={t('neighboursCardList.buttonAddNewRelationCard')} variant="secondary" />
                            </ListActions>
                            <CardColumnList>
                                {relationsList?.ciWithRels?.map((ciWithRel) => {
                                    const formatedCiWithRel = formatRelationAttributes(ciWithRel, entityTypes, owners, t)
                                    return <RelationCard {...formatedCiWithRel} key={formatedCiWithRel?.codeMetaIS} />
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
        </>
    )
}

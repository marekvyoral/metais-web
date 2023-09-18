import { Button } from '@isdd/idsk-ui-kit/button/Button'
import { TextHeading } from '@isdd/idsk-ui-kit/index'
import { PaginatorWrapper } from '@isdd/idsk-ui-kit/paginatorWrapper/PaginatorWrapper'
import { Tabs } from '@isdd/idsk-ui-kit/tabs/Tabs'
import { IFilter, Pagination } from '@isdd/idsk-ui-kit/types'
import { QueryFeedback, formatRelationAttributes } from '@isdd/metais-common'
import { CiType, ReadCiNeighboursWithAllRelsParams } from '@isdd/metais-common/api'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAbilityContext } from '@isdd/metais-common/hooks/permissions/useAbilityContext'
import { Actions, useCreateCiAbility } from '@isdd/metais-common/hooks/permissions/useUserAbility'

import { CardColumnList } from './cards/CardColumnList'
import { RelationCard } from './cards/RelationCard'
import { ListActions } from './lists/ListActions'

import { IRelationsView } from '@/components/containers/RelationsListContainer'

interface NeighboursCardListProps {
    isLoading: boolean
    isError: boolean
    data: IRelationsView['data']
    pagination: Pagination
    handleFilterChange: (filter: IFilter) => void
    setPageConfig: (value: React.SetStateAction<ReadCiNeighboursWithAllRelsParams>) => void
    ciTypeData: CiType | undefined
}

export const NeighboursCardList: React.FC<NeighboursCardListProps> = ({
    isLoading,
    isError,
    data,
    pagination,
    handleFilterChange,
    setPageConfig,
    ciTypeData,
}) => {
    const { t } = useTranslation()
    const navigate = useNavigate()
    const location = useLocation()
    const { entityTypes, relationsList, owners } = data

    const ability = useAbilityContext()
    const canCreateRelation = ability?.can(Actions.CREATE, `ci.create.newRelation`)
    const ciAbility = useCreateCiAbility(ciTypeData)
    const canCreateCi = ciAbility.can(Actions.CREATE, 'ci')

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
                            withChildren
                        >
                            <ListActions>
                                <Button
                                    className={'marginBottom0'}
                                    label={t('neighboursCardList.buttonAddNewRelation')}
                                    variant="secondary"
                                    disabled={!canCreateRelation}
                                    onClick={() => navigate(`new-relation/${key.technicalName}`, { state: { from: location } })}
                                />
                                <Button
                                    className={'marginBottom0'}
                                    onClick={() => navigate(`new-ci/${key.technicalName}`, { state: { from: location } })}
                                    label={t('neighboursCardList.buttonAddNewRelationCard')}
                                    variant="secondary"
                                    disabled={!canCreateRelation || !canCreateCi}
                                />
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

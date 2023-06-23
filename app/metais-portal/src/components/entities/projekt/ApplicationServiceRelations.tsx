import React from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '@isdd/idsk-ui-kit/button/Button'
import { Pagination, IFilter } from '@isdd/idsk-ui-kit/types'
import { PaginatorWrapper } from '@isdd/metais-common/paginatorWrapper/PaginatorWrapper'

import { RelationCard } from './cards/RelationCard'
import { CardColumnList } from './cards/CardColumnList'
import { ListActions } from './lists/ListActions'
import styles from './applicationServiceRelations.module.scss'

import { IRelationsView } from '@/components/containers/RelationsListContainer'
import { formatRelationAttributes } from '@/componentHelpers'

interface ApplicationServiceRelationsProps {
    isLoading: boolean
    isError: boolean
    data: IRelationsView['data']
    pagination: Pagination
    handleFilterChange: (filter: IFilter) => void
}

export const ApplicationServiceRelations: React.FC<ApplicationServiceRelationsProps> = ({
    isLoading,
    isError,
    data,
    pagination,
    handleFilterChange,
}) => {
    const { t } = useTranslation()
    const { entityTypes, relationsList, owners } = data

    if (isLoading && !data.relationsList?.pagination) {
        return <div>Loading...</div>
    }

    if (isError) {
        return <div>Error</div>
    }

    return (
        <>
            <ListActions>
                <Button
                    className={styles.buttonWithoutMarginBottom}
                    label={t('applicationServiceRelations.buttonAddNewRelation')}
                    variant="secondary"
                />
                <Button
                    className={styles.buttonWithoutMarginBottom}
                    label={t('applicationServiceRelations.buttonAddNewRelationCard')}
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
        </>
    )
}

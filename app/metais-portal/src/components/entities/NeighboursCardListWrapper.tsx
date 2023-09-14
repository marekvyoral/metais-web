import { Tab } from '@isdd/idsk-ui-kit/index'
import React from 'react'
import { matchPath, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

import { RelationsListContainer } from '../containers/RelationsListContainer'

import { NeighboursCardList } from './NeighboursCardList'

import { AttributesContainer } from '@/components/containers/AttributesContainer'

type Props = {
    entityName: string | undefined
    tabList: Tab[]
    entityId: string | undefined
}

const NeighboursCardListWrapper = ({ entityName, tabList, entityId }: Props) => {
    const { pathname } = useLocation()
    const { t } = useTranslation()

    return (
        <>
            {matchPath({ path: tabList[0].path ?? '/', end: true }, pathname) && (
                <AttributesContainer
                    loadingWithChildren
                    loadingLabel={t('loading.neighboursCardList')}
                    entityName={entityName ?? ''}
                    View={({ data: { ciTypeData }, isError: attError, isLoading: attLoading }) => (
                        <RelationsListContainer
                            entityId={entityId ?? ''}
                            technicalName={entityName ?? ''}
                            View={({ isError: relationsError, isLoading: relationsLoading, handleFilterChange, data, pagination, setPageConfig }) => (
                                <NeighboursCardList
                                    isError={[relationsError, attError].some((item) => item)}
                                    isLoading={[relationsLoading, attLoading].some((item) => item)}
                                    pagination={pagination}
                                    data={data}
                                    handleFilterChange={handleFilterChange}
                                    setPageConfig={setPageConfig}
                                    ciTypeData={ciTypeData}
                                />
                            )}
                        />
                    )}
                />
            )}
        </>
    )
}

export default NeighboursCardListWrapper

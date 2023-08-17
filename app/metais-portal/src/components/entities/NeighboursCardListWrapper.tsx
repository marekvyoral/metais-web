import { Tab } from '@isdd/idsk-ui-kit/index'
import React from 'react'
import { matchPath, useLocation } from 'react-router-dom'

import { RelationsListContainer } from '../containers/RelationsListContainer'

import { NeighboursCardList } from './NeighboursCardList'

type Props = {
    entityName: string | undefined
    tabList: Tab[]
    entityId: string | undefined
}

const NeighboursCardListWrapper = ({ entityName, tabList, entityId }: Props) => {
    const { pathname } = useLocation()

    return (
        <>
            {matchPath({ path: tabList[0].path ?? '/', end: true }, pathname) && (
                <RelationsListContainer entityId={entityId ?? ''} technicalName={entityName ?? ''} View={NeighboursCardList} />
            )}
        </>
    )
}

export default NeighboursCardListWrapper

import React from 'react'
import { Outlet, useLocation, useParams, Location } from 'react-router-dom'
import { Tab } from '@isdd/idsk-ui-kit/index'
import { Actions } from '@isdd/metais-common/hooks/permissions/useUserAbility'
import { TFunction } from 'i18next'
import { AbilityTuple, MongoAbility, MongoQuery } from '@casl/ability'

type GetDefaultCiEntityTabListProps = {
    t: TFunction
    entityName: string
    entityId: string
    userAbility: MongoAbility<AbilityTuple, MongoQuery>
}

export const getDefaultCiEntityTabList = ({ entityName, entityId, t, userAbility }: GetDefaultCiEntityTabListProps): Tab[] => {
    const tabList: Tab[] = [
        {
            id: 'informations',
            path: `/ci/${entityName}/${entityId}/`,
            title: t('ciType.informations'),
            content: <Outlet />,
        },
        {
            id: 'documents',
            path: `/ci/${entityName}/${entityId}/documents`,
            title: t('ciType.documents'),
            content: <Outlet />,
        },

        {
            id: 'relationships',
            path: `/ci/${entityName}/${entityId}/relationships`,
            title: t('ciType.relationships'),
            content: <Outlet />,
        },
        ...(userAbility.can(Actions.HISTORY, 'ci')
            ? [
                  {
                      id: 'history',
                      path: `/ci/${entityName}/${entityId}/history`,
                      title: t('ciType.history'),
                      content: <Outlet />,
                  },
              ]
            : []),
    ]

    return tabList
}

const getEntityName = (location: Location) => {
    const result = /.*\/ci\/([\w-]+).*/.exec(location.pathname)
    if (Array.isArray(result) && result.length > 0) {
        return result[1]
    }
    return undefined
}

export const useGetEntityParamsFromUrl = (): { entityName: string | undefined; entityId: string | undefined } => {
    const location = useLocation()
    const { entityId, entityName: urlEntityName } = useParams()
    const entityName = urlEntityName ? urlEntityName : getEntityName(location)

    return { entityId, entityName }
}

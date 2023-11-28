import { AbilityTuple, MongoAbility, MongoQuery } from '@casl/ability'
import { Tab } from '@isdd/idsk-ui-kit/index'
import { ConfigurationItemUiAttributes } from '@isdd/metais-common/api/generated/cmdb-swagger'
import { Attribute, AttributeAttributeTypeEnum, AttributeProfile } from '@isdd/metais-common/api/generated/types-repo-swagger'
import { ciInformationTab } from '@isdd/metais-common/constants'
import { Actions } from '@isdd/metais-common/hooks/permissions/useUserAbility'
import { formatDateForDefaultValue } from '@isdd/metais-common/index'
import { isFalsyStringValue } from '@isdd/metais-common/utils/utils'
import { TFunction } from 'i18next'
import { FieldValues } from 'react-hook-form'
import { Location, Outlet, useLocation, useParams } from 'react-router-dom'

type GetDefaultCiEntityTabListProps = {
    t: TFunction
    entityName: string
    entityId: string
    userAbility: MongoAbility<AbilityTuple, MongoQuery>
}

export const getDefaultCiEntityTabList = ({ entityName, entityId, t, userAbility }: GetDefaultCiEntityTabListProps): Tab[] => {
    const tabList: Tab[] = [
        {
            id: ciInformationTab,
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

export const formatForFormDefaultValues = (
    defaultItemAttributeValues: ConfigurationItemUiAttributes,
    attributes: (Attribute | undefined)[],
): ConfigurationItemUiAttributes => {
    const formattedDefaultAttributeValues: ConfigurationItemUiAttributes = {}

    for (const key in defaultItemAttributeValues) {
        const matchedAttributeType = attributes.find((att) => att?.technicalName == key)?.attributeTypeEnum
        if (matchedAttributeType === AttributeAttributeTypeEnum.DATE) {
            formattedDefaultAttributeValues[key] = formatDateForDefaultValue(defaultItemAttributeValues[key])
        } else if (matchedAttributeType === AttributeAttributeTypeEnum.BOOLEAN) {
            const isFalsy = isFalsyStringValue(defaultItemAttributeValues[key])

            formattedDefaultAttributeValues[key] = isFalsy ? false : true
        } else {
            formattedDefaultAttributeValues[key] = defaultItemAttributeValues[key]
        }
    }

    return formattedDefaultAttributeValues
}

export const filterFormValuesBasedOnCurrentRole = (attProfiles: AttributeProfile[], currentRoleName: string, formValues: FieldValues) => {
    const attributesWithRoles: Record<string, string[]> = attProfiles.reduce<Record<string, string[]>>((acc, obj) => {
        const reducedAttributesWithRoles = obj?.attributes?.reduce<Record<string, string[]>>(
            (profileAcc, att) => ({ ...profileAcc, [att.technicalName ?? '']: obj.roleList ?? [] }),
            {},
        )
        return { ...acc, ...reducedAttributesWithRoles }
    }, {})

    const newFormValues: FieldValues = {}
    for (const key in formValues) {
        if (attributesWithRoles?.[key]?.includes(currentRoleName)) {
            newFormValues[key] = formValues[key]
        } else {
            newFormValues[key] = ''
        }
    }
    return newFormValues
}

import { AbilityTuple, MongoAbility, MongoQuery } from '@casl/ability'
import { BreadCrumbsItemProps, Tab } from '@isdd/idsk-ui-kit/index'
import { ConfigurationItemUi, ConfigurationItemUiAttributes } from '@isdd/metais-common/api/generated/cmdb-swagger'
import { Attribute, AttributeAttributeTypeEnum, AttributeProfile } from '@isdd/metais-common/api/generated/types-repo-swagger'
import {
    ENTITY_ACTIVITY,
    ENTITY_CIEL,
    ENTITY_KRIS,
    ENTITY_PRINCIP,
    HowTo,
    META_IS_TITLE,
    PO_PO,
    PO_IS,
    PO_IS_PO,
    PROGRAM,
    PROJECT,
    ciInformationTab,
    ENTITY_KS,
    ENTITY_ISVS,
    ENTITY_INFRA_SLUZBA,
    ENTITY_AS,
    WEBOVE_SIDLO,
    ENTITY_TRAINING,
    ENTITY_OSOBITNY_POSTUP,
    PO,
} from '@isdd/metais-common/constants'
import { Actions } from '@isdd/metais-common/hooks/permissions/useUserAbility'
import { formatDateForDefaultValue } from '@isdd/metais-common/index'
import { getHowToTranslate, isFalsyStringValue, replaceDotForUnderscore } from '@isdd/metais-common/utils/utils'
import { TFunction } from 'i18next'
import { FieldValues } from 'react-hook-form'
import { Location, Outlet, useLocation, useParams } from 'react-router-dom'
import { ApiIntegrationHarmonogram } from '@isdd/metais-common/api/generated/provisioning-swagger'
import { EnumType } from '@isdd/metais-common/api/generated/enums-repo-swagger'
import { RouteNames } from '@isdd/metais-common/navigation/routeNames'

import { HarmonogramInputNames } from '@/components/views/prov-integration/integration-link/IntegrationHarmonogramView'

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
            formattedDefaultAttributeValues[key] = isFalsy ? false : !!defaultItemAttributeValues[key]
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

export const getIntegrationLinkTabList = ({ entityName, entityId, t, userAbility }: GetDefaultCiEntityTabListProps): Tab[] => {
    const tabList: Tab[] = [
        {
            id: ciInformationTab,
            path: `/ci/${entityName}/${entityId}/`,
            title: t('ciType.informations'),
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
        {
            id: 'ksAsList',
            path: `/ci/${entityName}/${entityId}/ksAsList`,
            title: t('integrationLinks.tabs.ksAsList'),
            content: <Outlet />,
        },
        {
            id: 'subjectsList',
            path: `/ci/${entityName}/${entityId}/subjectsList`,
            title: t('integrationLinks.tabs.subjectsList'),
            content: <Outlet />,
        },

        {
            id: 'harmonogram',
            path: `/ci/${entityName}/${entityId}/harmonogram`,
            title: t('integrationLinks.tabs.harmonogram'),
            content: <Outlet />,
        },
    ]

    return tabList
}

export const formatHarmonogramFormKey = (uniqueCode: string, inputType: HarmonogramInputNames) => {
    return `${uniqueCode}_${inputType}`
}

export const formatFormValuesForHarmonogramUpdate = (
    formValues: Record<string, string | null>,
    integrationPhase: EnumType | undefined,
): ApiIntegrationHarmonogram[] => {
    const formattedData: ApiIntegrationHarmonogram[] =
        integrationPhase?.enumItems?.map((item) => {
            const replacedHarmonogramPhase = replaceDotForUnderscore(item?.code ?? '')
            const plannedDate = formValues[formatHarmonogramFormKey(replacedHarmonogramPhase, HarmonogramInputNames.PLANNED_DATE)] ?? ''
            const realizedDate = formValues[formatHarmonogramFormKey(replacedHarmonogramPhase, HarmonogramInputNames.REALIZED_DATE)] ?? ''

            return {
                harmonogramPhase: item.code,
                plannedDate,
                realizedDate,
            }
        }) ?? []

    return formattedData
}

export const getAttributeValue = (projectData: ConfigurationItemUi | undefined, attributeName: string): string => {
    return projectData?.attributes?.find((att: { name: string; value: string }) => att.name === attributeName)?.value
}

type GetSlaContractTabListProps = {
    t: TFunction
    entityId: string
    entityName: string
    userAbility: MongoAbility<AbilityTuple, MongoQuery>
}

export const getSlaContractTabList = ({ entityId, entityName, t, userAbility }: GetSlaContractTabListProps): Tab[] => {
    const tabList: Tab[] = [
        {
            id: ciInformationTab,
            path: `/ci/${entityName}/${entityId}/`,
            title: t('ciType.informations'),
            content: <Outlet />,
        },
        {
            id: 'supportContact',
            path: `/ci/${entityName}/${entityId}/support-contact`,
            title: t('slaContracts.detail.supportContact'),
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

export const getSuccessMessageKeyByType = (type?: string) => {
    switch (type) {
        case 'create': {
            return 'mutationFeedback.successfulCreated'
        }
        case 'edit': {
            return 'mutationFeedback.successfulUpdated'
        }
        case 'register': {
            return 'mutationFeedback.successfulRegistered'
        }
        case 'unregister': {
            return 'mutationFeedback.successfulUnregistered'
        }
        case 'clone': {
            return 'mutationFeedback.successfulCloned'
        }
        default: {
            return 'mutationFeedback.success'
        }
    }
}

export const useCiDetailPageTitle = (ciName: string, itemName: string, t: TFunction) => {
    const getHeading = () => {
        return t('titles.ciDetail', { ci: ciName, itemName: itemName })
    }
    const getTitle = () => {
        return `${getHeading()} ${META_IS_TITLE}`
    }

    return {
        getHeading,
        getTitle,
    }
}

export const useCiListPageHeading = (ciName: string, t: TFunction) => {
    const getHeading = () => {
        return t('titles.ciList', { ci: ciName })
    }
    const getTitle = () => {
        return `${getHeading()} ${META_IS_TITLE}`
    }

    return {
        getHeading,
        getTitle,
    }
}

export const getCiHowToBreadCrumb = (ciType: string, t: TFunction): BreadCrumbsItemProps[] => {
    switch (ciType) {
        case ENTITY_CIEL:
        case ENTITY_PRINCIP:
        case ENTITY_KRIS: {
            return [
                { label: getHowToTranslate(HowTo.EGOV_HOWTO, t), href: RouteNames.HOW_TO_EGOV_COMPONENTS },
                { label: getHowToTranslate(HowTo.SPK_HOWTO, t), href: RouteNames.HOW_TO_KRIS_STUDIES_PROJECTS },
            ]
        }

        case ENTITY_ACTIVITY:
        case PROJECT:
        case PROGRAM:
        case PO:
        case PO_IS:
        case PO_IS_PO:
        case PO_PO:
        case ENTITY_KS:
        case ENTITY_AS:
        case ENTITY_ISVS:
        case ENTITY_INFRA_SLUZBA:
        case WEBOVE_SIDLO:
        case ENTITY_TRAINING:
        case ENTITY_OSOBITNY_POSTUP: {
            return [{ label: getHowToTranslate(HowTo.EGOV_HOWTO, t), href: RouteNames.HOW_TO_EGOV_COMPONENTS }]
        }

        default: {
            return []
        }
    }
}

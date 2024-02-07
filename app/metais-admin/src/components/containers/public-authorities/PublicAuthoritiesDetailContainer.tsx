import React from 'react'
import { GET_ENUM } from '@isdd/metais-common'
import { EnumType, useGetEnum } from '@isdd/metais-common/api/generated/enums-repo-swagger'
import {
    ConfigurationItemUi,
    useInvalidateConfigurationItem,
    useReadConfigurationItem,
    useRecycleInvalidatedCisBiznis,
} from '@isdd/metais-common/api/generated/cmdb-swagger'
import { CiType } from '@isdd/metais-common/api/generated/types-repo-swagger'
import { useAttributesHook } from '@isdd/metais-common/hooks/useAttributes.hook'
import { useGetCiTypeConstraintsData } from '@isdd/metais-common/hooks/useGetCiTypeConstraintsData'
import { useGetStatus } from '@isdd/metais-common/hooks/useGetRequestStatus'
import { useActionSuccess } from '@isdd/metais-common/contexts/actionSuccess/actionSuccessContext'
import { AdminRouteNames } from '@isdd/metais-common/navigation/routeNames'

export interface ParsedAttribute {
    label: string
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    value: any
}

export interface IPublicAuthoritiesDetail {
    configurationItem?: ConfigurationItemUi
    ciTypeData?: CiType
    constraintsData?: (EnumType | undefined)[]
    unitsData?: EnumType
    currentEntityCiTypeConstraintsData: Record<string, ConfigurationItemUi>
    personTypesCategories?: EnumType
    personCategories?: EnumType
    sources?: EnumType
    setInvalid?: (entityId: string | undefined, configurationItem: ConfigurationItemUi | undefined) => Promise<void>
    setValid?: (entityId: string[] | undefined) => Promise<void>
}
export interface IPublicAuthoritiesDetailContainerView {
    data: IPublicAuthoritiesDetail
    isError: boolean
    isLoading: boolean
}

interface IPublicAuthoritiesDetailContainer {
    entityId: string
    View: React.FC<IPublicAuthoritiesDetailContainerView>
}

export const PublicAuthoritiesDetailContainer: React.FC<IPublicAuthoritiesDetailContainer> = ({ entityId, View }) => {
    const { data: personTypesCategories } = useGetEnum(GET_ENUM.TYP_OSOBY)
    const { data: personCategories } = useGetEnum(GET_ENUM.KATEGORIA_OSOBA)
    const { data: sources } = useGetEnum(GET_ENUM.ZDROJ)
    const { constraintsData, ciTypeData, unitsData, isLoading: isAttLoading, isError: isAttError } = useAttributesHook('PO')
    const { data: poData, refetch } = useReadConfigurationItem(entityId)
    const { setIsActionSuccess } = useActionSuccess()
    const {
        isLoading: isCiConstraintLoading,
        isError: isCiConstraintError,
        uuidsToMatchedCiItemsMap,
    } = useGetCiTypeConstraintsData(ciTypeData, [poData ?? {}])
    const { getRequestStatus, isProcessedError, isError: isRedirectError, isLoading: isRedirectLoading, isTooManyFetchesError } = useGetStatus()
    const currentEntityCiTypeConstraintsData = uuidsToMatchedCiItemsMap[poData?.uuid ?? '']

    const { mutateAsync: setInvalid, isLoading: isInvalidating } = useInvalidateConfigurationItem({
        mutation: {
            onSuccess: (data) => {
                getRequestStatus(data.requestId ?? '', () => {
                    refetch()
                    setIsActionSuccess({
                        value: true,
                        path: `${AdminRouteNames.PUBLIC_AUTHORITIES}/${entityId}`,
                        additionalInfo: { type: 'invalid' },
                    })
                })
            },
        },
    })
    const { mutateAsync: setValid, isLoading: isValidating } = useRecycleInvalidatedCisBiznis({
        mutation: {
            onSuccess: (data) => {
                getRequestStatus(data.requestId ?? '', () => {
                    refetch()
                    setIsActionSuccess({ value: true, path: `${AdminRouteNames.PUBLIC_AUTHORITIES}/${entityId}`, additionalInfo: { type: 'valid' } })
                })
            },
        },
    })

    const invalidateConfigurationItem = async (uuid: string | undefined, configurationItem: ConfigurationItemUi | undefined) => {
        const attributes = configurationItem?.attributes
        if (!attributes) return
        await setInvalid({
            data: {
                attributes: Object.keys(attributes).map((key) => ({ value: attributes[key], name: key })),
                invalidateReason: { comment: '' },
                type: 'PO',
                uuid: uuid,
            },
        })
    }

    const validatePO = async (uuids: string[] | undefined) => {
        await setValid({ data: { ciIdList: uuids } })
    }

    return (
        <View
            data={{
                configurationItem: poData,
                personTypesCategories,
                personCategories,
                sources,
                setInvalid: invalidateConfigurationItem,
                setValid: validatePO,
                constraintsData: constraintsData,
                unitsData: unitsData,
                currentEntityCiTypeConstraintsData: currentEntityCiTypeConstraintsData,
                ciTypeData,
            }}
            isError={[isAttError, isCiConstraintError, isProcessedError, isRedirectError, isTooManyFetchesError].some((item) => item)}
            isLoading={[isAttLoading, isCiConstraintLoading, isInvalidating, isValidating, isRedirectLoading].some((item) => item)}
        />
    )
}

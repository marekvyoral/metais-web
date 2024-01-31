import { Attribute, CiCode, CiType, useGenerateCodeAndURL, useGetAttributeProfile } from '@isdd/metais-common/api/generated/types-repo-swagger'
import React, { useMemo } from 'react'
import { Languages } from '@isdd/metais-common/localization/languages'
import { useTranslation } from 'react-i18next'
import { EnumType } from '@isdd/metais-common/api/generated/enums-repo-swagger'
import { useAttributesHook } from '@isdd/metais-common/hooks/useAttributes.hook'
import { useAuth } from '@isdd/metais-common/contexts/auth/authContext'
import { Role, useFindAll11 } from '@isdd/metais-common/api/generated/iam-swagger'
import { useCiHook } from '@isdd/metais-common/hooks/useCi.hook'
import { ATTRIBUTE_NAME } from '@isdd/metais-common/api'
import { ConfigurationItemUi, ConfigurationItemUiAttributes } from '@isdd/metais-common/api/generated/cmdb-swagger'
import { useIntegrationLink } from '@isdd/metais-common/hooks/useIntegrationLink'
import { IOption } from '@isdd/idsk-ui-kit/index'

import { formatForFormDefaultValues } from '@/componentHelpers/ci'
import { useIntegrationLinkCandidates } from '@/hooks/useIntegrationLinkCandidates'

export interface CreateIntegrationData {
    ciTypeData: CiType | undefined
    generatedEntityId: CiCode | undefined
    unitsData: EnumType | undefined
    constraintsData: (EnumType | undefined)[]
    providingProjectAttribute: Attribute
    consumingProjectAttribute: Attribute
    intRole: Role | undefined
    consumingProjectData: ConfigurationItemUi | undefined
    providingProjectData: ConfigurationItemUi | undefined
    formDefaultValues: ConfigurationItemUiAttributes
}

interface CandidatesState {
    consProjOptions: IOption<string>[]
    provProjOptions: IOption<string>[]
    setSelectedConsProj: React.Dispatch<React.SetStateAction<string>>
    setSelectedProvProj: React.Dispatch<React.SetStateAction<string>>
}
export interface ICreateIntegrationLinkContainerView {
    data: CreateIntegrationData
    candidatesState: CandidatesState
    isLoading: boolean
    isError: boolean
    ciTypeName: string
    ciItemDataName: string
    isUpdate: boolean
    entityId: string
}
interface ICreateIntegrationLinkContainer {
    View: React.FC<ICreateIntegrationLinkContainerView>
    entityName: string
    entityId: string
}

export const CreateAndEditIntegrationLinkContainer: React.FC<ICreateIntegrationLinkContainer> = ({ View, entityName, entityId }) => {
    const { i18n } = useTranslation()
    const {
        state: { user },
    } = useAuth()
    const isUpdate = !!entityId
    const {
        data: generatedEntityId,
        isLoading: generatedIdLoading,
        isError: generatedIdError,
        fetchStatus,
    } = useGenerateCodeAndURL(entityName, { query: { refetchOnMount: false, enabled: !!entityName && !isUpdate, cacheTime: 0 } })
    const { ciTypeData, constraintsData, unitsData, isError: isAttributesError, isLoading: isAttributesLoading } = useAttributesHook(entityName)
    const { ciItemData, isLoading: isCiItemLoading, isError: isCiItemError } = useCiHook(entityId)
    const {
        isError: isCandidatesError,
        isLoading: isCandidatesLoading,
        provProjOptions,
        consProjOptions,
        setSelectedConsProj,
        setSelectedProvProj,
    } = useIntegrationLinkCandidates()

    const userIntegrationRole = user?.roles.find((role) => ciTypeData?.roleList?.includes(role))
    const ciTypeName = i18n.language === Languages.SLOVAK ? ciTypeData?.name : ciTypeData?.engName
    const ciItemDataName =
        i18n.language == Languages.SLOVAK
            ? ciItemData?.attributes?.[ATTRIBUTE_NAME.Gen_Profil_nazov]
            : ciItemData?.attributes?.[ATTRIBUTE_NAME.Gen_Profil_anglicky_nazov]

    const { data: dizProfilData, isLoading: isDizProfilLoading, isError: isDizProfilError } = useGetAttributeProfile('Gui_Profil_DIZ')

    const {
        data: intRole,
        isError: isIntRoleError,
        isLoading: isIntRoleLoading,
        fetchStatus: intRoleFetchStatus,
    } = useFindAll11({ name: userIntegrationRole }, { query: { enabled: !!userIntegrationRole } })

    const {
        isError: isIntegrationLinkError,
        isLoading: isIntegrationLinkLoading,
        consumingProjectData,
        providingProjectData,
    } = useIntegrationLink({
        entityId: entityId ?? '',
        createdByLogin: ciItemData?.metaAttributes?.createdBy ?? '',
        lastModifiedByLogin: ciItemData?.metaAttributes?.lastModifiedBy ?? '',
    })

    const providingProjectAttribute = useMemo(
        () => dizProfilData?.attributes?.find((att) => att.technicalName == ATTRIBUTE_NAME.Gui_Profil_DIZ_poskytujuci_projekt) ?? {},
        [dizProfilData?.attributes],
    )
    const consumingProjectAttribute = useMemo(
        () => dizProfilData?.attributes?.find((att) => att.technicalName == ATTRIBUTE_NAME.Gui_Profil_DIZ_konzumujuci_projekt) ?? {},
        [dizProfilData?.attributes],
    )

    const attributesForDefaultValues = useMemo(
        () => ciTypeData?.attributes?.concat(providingProjectAttribute).concat(consumingProjectAttribute),
        [ciTypeData?.attributes, consumingProjectAttribute, providingProjectAttribute],
    )
    const defaultValuesFromSchema = useMemo(() => {
        return attributesForDefaultValues?.reduce((acc, att) => {
            if (att?.technicalName === ATTRIBUTE_NAME.Gen_Profil_ref_id) {
                return { ...acc, [att?.technicalName?.toString() ?? '']: generatedEntityId?.ciurl }
            }
            if (att?.technicalName === ATTRIBUTE_NAME.Gen_Profil_kod_metais) {
                return { ...acc, [att?.technicalName?.toString() ?? '']: generatedEntityId?.cicode }
            }
            if (att?.defaultValue) {
                return { ...acc, [att?.technicalName?.toString() ?? '']: att?.defaultValue }
            }
            return acc
        }, {})
    }, [attributesForDefaultValues, generatedEntityId?.cicode, generatedEntityId?.ciurl])

    const formDefaultValues = useMemo(() => {
        if (isUpdate) {
            const combinedAttributes = {
                ...ciItemData?.attributes,
                [consumingProjectAttribute?.technicalName ?? '']: consumingProjectData?.uuid,
                [providingProjectAttribute?.technicalName ?? '']: providingProjectData?.uuid,
            }
            return formatForFormDefaultValues(combinedAttributes ?? {}, attributesForDefaultValues ?? [])
        }
        return formatForFormDefaultValues(defaultValuesFromSchema ?? {}, attributesForDefaultValues ?? [])
    }, [
        attributesForDefaultValues,
        ciItemData?.attributes,
        consumingProjectAttribute?.technicalName,
        consumingProjectData?.uuid,
        defaultValuesFromSchema,
        isUpdate,
        providingProjectAttribute?.technicalName,
        providingProjectData?.uuid,
    ])

    const updateEntityCodeAndUrl = {
        cicode: ciItemData?.attributes?.[ATTRIBUTE_NAME.Gen_Profil_kod_metais],
        ciurl: ciItemData?.attributes?.[ATTRIBUTE_NAME.Gen_Profil_ref_id],
    }

    const isLoading =
        isAttributesLoading ||
        isDizProfilLoading ||
        (generatedIdLoading && fetchStatus != 'idle') ||
        (isIntRoleLoading && intRoleFetchStatus != 'idle') ||
        isCiItemLoading ||
        isIntegrationLinkLoading ||
        isCandidatesLoading

    const isError =
        isAttributesError || isDizProfilError || generatedIdError || isIntRoleError || isCiItemError || isIntegrationLinkError || isCandidatesError

    return (
        <View
            data={{
                generatedEntityId: isUpdate ? updateEntityCodeAndUrl : generatedEntityId,
                ciTypeData,
                constraintsData,
                unitsData,
                consumingProjectAttribute,
                providingProjectAttribute,
                intRole: Array.isArray(intRole) ? intRole[0] : intRole,
                consumingProjectData,
                providingProjectData,
                formDefaultValues,
            }}
            candidatesState={{ provProjOptions, consProjOptions, setSelectedConsProj, setSelectedProvProj }}
            isLoading={isLoading}
            isError={isError}
            ciTypeName={ciTypeName ?? ''}
            ciItemDataName={ciItemDataName}
            isUpdate={isUpdate}
            entityId={entityId}
        />
    )
}

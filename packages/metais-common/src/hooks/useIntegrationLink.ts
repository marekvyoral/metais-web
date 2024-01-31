import { useTranslation } from 'react-i18next'

import { useFindAll311 } from '@isdd/metais-common/api/generated/iam-swagger'
import { useReadNeighboursConfigurationItems } from '@isdd/metais-common/api/generated/cmdb-swagger'
import {
    ENTITY_PROJECT,
    GUI_PROFILE_DIZ,
    INTEGRACIA_KONZUMUJE_PROJEKT,
    INTEGRACIA_VYSTAVUJE_PROJEKT,
    PO,
    PO_asociuje_Projekt,
} from '@isdd/metais-common/constants'
import { useAuth } from '@isdd/metais-common/contexts/auth/authContext'
import { getGetAttributeProfileQueryKey, useGetAttributeProfile } from '@isdd/metais-common/api/generated/types-repo-swagger'

type Props = {
    entityId: string
    createdByLogin: string
    lastModifiedByLogin: string
}

export const useIntegrationLinkConsumingAndProvidingProject = (entityId: string) => {
    const {
        data: consumingProjectData,
        isError: isConsumingProjectError,
        isLoading: isConsumingProjectLoading,
        fetchStatus: consumingProjectFetchStatus,
    } = useReadNeighboursConfigurationItems(
        entityId ?? '',
        {
            nodeType: ENTITY_PROJECT,
            relationshipType: INTEGRACIA_KONZUMUJE_PROJEKT,
            includeInvalidated: true,
        },
        {
            query: {
                enabled: !!entityId,
            },
        },
    )
    const {
        data: consumingPOData,
        isError: isConsumingPOError,
        isLoading: isConsumingPOLoading,
        fetchStatus: consumingPOFetchStatus,
    } = useReadNeighboursConfigurationItems(
        consumingProjectData?.fromCiSet?.[0]?.uuid ?? '',
        {
            nodeType: PO,
            relationshipType: PO_asociuje_Projekt,
        },
        {
            query: {
                enabled: !!consumingProjectData?.fromCiSet?.[0]?.uuid,
            },
        },
    )
    const {
        data: providingProjectData,
        isError: isProvidingProjectError,
        isLoading: isProvidingProjectLoading,
        fetchStatus: providingProjectFetchStatus,
    } = useReadNeighboursConfigurationItems(
        entityId ?? '',
        {
            nodeType: ENTITY_PROJECT,
            relationshipType: INTEGRACIA_VYSTAVUJE_PROJEKT,
            includeInvalidated: true,
        },
        {
            query: {
                enabled: !!entityId,
            },
        },
    )
    const {
        data: providingPOData,
        isError: isProvidingPOError,
        isLoading: isProvidingPOLoading,
        fetchStatus: providingPOFetchStatus,
    } = useReadNeighboursConfigurationItems(
        providingProjectData?.fromCiSet?.[0]?.uuid ?? '',
        {
            nodeType: PO,
            relationshipType: PO_asociuje_Projekt,
        },
        {
            query: {
                enabled: !!providingProjectData?.fromCiSet?.[0]?.uuid,
            },
        },
    )

    return {
        consumingProjectData: consumingProjectData?.fromCiSet?.[0],
        providingProjectData: providingProjectData?.fromCiSet?.[0],
        consumingPOData: consumingPOData?.toCiSet?.[0],
        providingPOData: providingPOData?.toCiSet?.[0],
        isLoading:
            (isConsumingProjectLoading && consumingProjectFetchStatus != 'idle') ||
            (isProvidingProjectLoading && providingProjectFetchStatus != 'idle') ||
            (isConsumingPOLoading && consumingPOFetchStatus != 'idle') ||
            (isProvidingPOLoading && providingPOFetchStatus != 'idle'),
        isError: isConsumingProjectError || isProvidingProjectError || isConsumingPOError || isProvidingPOError,
    }
}

export const useIntegrationLink = ({ entityId, createdByLogin, lastModifiedByLogin }: Props) => {
    const { i18n } = useTranslation()
    const {
        state: { user },
    } = useAuth()
    const {
        consumingProjectData,
        providingProjectData,
        isError: ProvAndConsProjError,
        isLoading: ProvAndConsProjLoading,
    } = useIntegrationLinkConsumingAndProvidingProject(entityId)

    //TS-IGNORE => bad generated type => email should not be mandatory
    const {
        data: createdByIdentityData,
        isError: isCreatedByError,
        isLoading: isCreatedByLoading,
        fetchStatus: createdByFetchStatus,
    } = useFindAll311(
        //eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-ignore
        {
            login: createdByLogin,
        },
        {
            query: {
                enabled: !!createdByLogin && !!user,
            },
        },
    )

    const {
        data: lastModifiedByIdentityData,
        isError: isLastModifiedByError,
        isLoading: isLastModifiedByLoading,
        fetchStatus: lastModifiedByFetchStatus,
    } = useFindAll311(
        //eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-ignore
        {
            login: lastModifiedByLogin,
        },
        {
            query: {
                enabled: !!lastModifiedByLogin && !!user,
            },
        },
    )

    const enumQK = getGetAttributeProfileQueryKey(GUI_PROFILE_DIZ)
    const {
        data: dizProfileData,
        isLoading: isDizProfileLoading,
        isError: isDizProfileError,
    } = useGetAttributeProfile(GUI_PROFILE_DIZ, { query: { queryKey: [i18n.language, enumQK] } })

    const isLoading =
        (isCreatedByLoading && createdByFetchStatus != 'idle') ||
        (isLastModifiedByLoading && lastModifiedByFetchStatus != 'idle') ||
        isDizProfileLoading ||
        ProvAndConsProjLoading

    const isError = isCreatedByError || isLastModifiedByError || isDizProfileError || ProvAndConsProjError

    return {
        isLoading,
        isError,
        consumingProjectData,
        providingProjectData,
        createdByIdentityData,
        lastModifiedByIdentityData,
        dizProfileData,
    }
}

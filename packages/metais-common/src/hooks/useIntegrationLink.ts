import { useTranslation } from 'react-i18next'
import { useEffect } from 'react'

import { useFindAll311 } from '@isdd/metais-common/api/generated/iam-swagger'
import { useReadNeighboursConfigurationItems } from '@isdd/metais-common/api/generated/cmdb-swagger'
import { ENTITY_PROJECT, GUI_PROFILE_DIZ, INTEGRACIA_KONZUMUJE_PROJEKT, INTEGRACIA_VYSTAVUJE_PROJEKT } from '@isdd/metais-common/constants'
import { useAuth } from '@isdd/metais-common/contexts/auth/authContext'
import { useGetAttributeProfile } from '@isdd/metais-common/api/generated/types-repo-swagger'

type Props = {
    entityId: string
    createdByLogin: string
    lastModifiedByLogin: string
}

export const useIntegrationLink = ({ entityId, createdByLogin, lastModifiedByLogin }: Props) => {
    const { i18n } = useTranslation()
    const {
        state: { user },
    } = useAuth()

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

    const {
        data: dizProfileData,
        isLoading: isDizProfileLoading,
        isError: isDizProfileError,
        refetch: refetchGuiProfileDiz,
    } = useGetAttributeProfile(GUI_PROFILE_DIZ)

    useEffect(() => {
        refetchGuiProfileDiz()
    }, [i18n.language, refetchGuiProfileDiz])

    const isLoading =
        (isConsumingProjectLoading && consumingProjectFetchStatus != 'idle') ||
        (isCreatedByLoading && createdByFetchStatus != 'idle') ||
        (isLastModifiedByLoading && lastModifiedByFetchStatus != 'idle') ||
        (isProvidingProjectLoading && providingProjectFetchStatus != 'idle') ||
        isDizProfileLoading

    const isError = isConsumingProjectError || isCreatedByError || isLastModifiedByError || isProvidingProjectError || isDizProfileError

    return {
        isLoading,
        isError,
        consumingProjectData: consumingProjectData?.fromCiSet?.[0],
        providingProjectData: providingProjectData?.fromCiSet?.[0],
        createdByIdentityData,
        lastModifiedByIdentityData,
        dizProfileData,
    }
}

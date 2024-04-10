import { useGetCiTypeWrapper } from '@isdd/metais-common/hooks/useCiType.hook'
import { useReadConfigurationItem, useGetRoleParticipant } from '@isdd/metais-common/api/generated/cmdb-swagger'
import { useGetRightsForPO, useIsOwnerByGid } from '@isdd/metais-common/api/generated/iam-swagger'
import { CI_ITEM_QUERY_KEY } from '@isdd/metais-common/constants'
import { useAuth } from '@isdd/metais-common/contexts/auth/authContext'

type Args = {
    entityName: string
    entityId: string
}

export const useCommonPermissionData = ({ entityId, entityName }: Args) => {
    const {
        state: { user, token },
    } = useAuth()
    const identityUuid = user?.uuid
    const isLoggedIn = !!identityUuid

    const { data: ciTypeData, isLoading: ciTypeLoading, isError: ciTypeError } = useGetCiTypeWrapper(entityName)

    const {
        data: ciData,
        isLoading: ciLoading,
        isError: ciError,
    } = useReadConfigurationItem(entityId, {
        query: { queryKey: [CI_ITEM_QUERY_KEY, entityId] },
    })

    const {
        data: roleParticipantData,
        isLoading: roleParticipantLoading,
        isError: roleParticipantError,
        fetchStatus: roleParticipantFetchStatus,
    } = useGetRoleParticipant(ciData?.metaAttributes?.owner ?? '', {
        query: { enabled: !ciLoading && !ciError },
    })

    const {
        data: rightsData,
        isError: isRightsDataError,
        isLoading: isRightsDataLoading,
        fetchStatus: rightsDataFetchStatus,
    } = useGetRightsForPO(
        {
            identityUuid,
            cmdbId: roleParticipantData?.owner,
        },
        {
            query: {
                enabled: !ciLoading && !roleParticipantLoading && !ciError && !roleParticipantError && token !== null && isLoggedIn,
            },
        },
    )

    const {
        data: isOwnerByGid,
        isError: isOwnerByGidError,
        isLoading: isOwnerByGidLoading,
        fetchStatus: ownerByGidFetchStatus,
    } = useIsOwnerByGid(
        {
            gids: [ciData?.metaAttributes?.owner ?? ''],
            login: user?.login,
        },
        { query: { enabled: !ciLoading && token !== null && isLoggedIn } },
    )
    const isLoading =
        ciLoading ||
        ciTypeLoading ||
        (isOwnerByGidLoading && ownerByGidFetchStatus != 'idle') ||
        (isRightsDataLoading && rightsDataFetchStatus != 'idle') ||
        (roleParticipantLoading && roleParticipantFetchStatus != 'idle')

    const isError = ciError || ciTypeError || isOwnerByGidError || isRightsDataError || roleParticipantError

    return {
        isLoading,
        isError,
        ciData,
        ciTypeData,
        isOwnerByGid,
        rightsData,
        roleParticipantData,
    }
}

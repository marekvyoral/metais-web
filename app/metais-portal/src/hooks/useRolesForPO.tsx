import { useGetRightsForPO } from '@isdd/metais-common/api/generated/iam-swagger'
import { useAuth } from '@isdd/metais-common/contexts/auth/authContext'

export const useRolesForPO = (poUuid: string, ciRoles: string[]) => {
    const {
        state: { user },
    } = useAuth()
    const {
        data: rightsForPOData,
        isLoading: isRightsForPOLoading,
        isError: isRightsForPOError,
    } = useGetRightsForPO({ identityUuid: user?.uuid ?? '', cmdbId: poUuid ?? '' }, { query: { enabled: !!poUuid } })

    const rolesForPO = rightsForPOData?.filter((role) => ciRoles?.find((currentRole) => currentRole === role.roleName))

    return { rolesForPO: rolesForPO, isRightsForPOLoading: isRightsForPOLoading, isRightsForPOError: isRightsForPOError }
}

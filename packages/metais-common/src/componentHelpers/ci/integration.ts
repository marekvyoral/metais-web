import { INT_MANAZ, INT_PODPIS, INT_SPRAVA, PO_E_GOVERNMENT_UUID } from '@isdd/metais-common/constants'
import { User } from '@isdd/metais-common/contexts/auth/authContext'

export const getHasIntRole = (roleList: string[]) => {
    const integrationRoles = [INT_SPRAVA, INT_PODPIS, INT_MANAZ]
    const hasIntRole = integrationRoles.some((intRole) => roleList?.includes(intRole))
    return hasIntRole
}

export const getIntPermissions = (user: User | null) => {
    const hasPoEGovernment = !!user?.groupData.find((group) => group.orgId === PO_E_GOVERNMENT_UUID)
    const hasIntRole = getHasIntRole(user?.roles ?? [])
    return { hasPoEGovernment, hasIntRole }
}

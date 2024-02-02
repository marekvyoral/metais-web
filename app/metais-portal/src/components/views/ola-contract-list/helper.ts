import { CiType } from '@isdd/metais-common/api/generated/types-repo-swagger'
import { Profil_OLA_Kontrakt } from '@isdd/metais-common/constants'
import { Group, User } from '@isdd/metais-common/contexts/auth/authContext'

export const canEditOlaContract = (user: User | null, ciType?: CiType) => {
    if (!ciType) {
        return false
    }

    const profile = ciType.attributeProfiles?.find((item) => item?.technicalName === Profil_OLA_Kontrakt)

    if (!profile) {
        return false
    }

    const roleList = profile.roleList ?? []
    const userRoles = user?.roles ?? []

    return !!roleList.find((role) => userRoles.includes(role))
}

export const getGId = (groups: Group[], uuid: string) =>
    groups.find((g) => g.roles.find((r) => r.roleUuid === uuid))?.roles.find((r) => r.roleUuid === uuid)?.gid ?? ''

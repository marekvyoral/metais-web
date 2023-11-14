import { User } from '@isdd/metais-common/contexts/auth/authContext'

export const getGidsForUserOrgRoles = (user: User | null) => user?.groupData.flatMap((org) => org.roles.map((role) => role.gid)) ?? []

export const getUuidsForUserOrgRoles = (user: User | null) => user?.groupData.flatMap((org) => org.roles.map((role) => role.roleUuid)) ?? []

export const getGidsForUserRoles = (user: User | null) =>
    user?.groupData.flatMap((org) => org.roles.filter((role) => user.roles.includes(role.roleName)).map((role) => role.gid)) ?? []

export const mapPickerDateToRequestData = (stamp?: string) => stamp && new Date(stamp).toJSON()

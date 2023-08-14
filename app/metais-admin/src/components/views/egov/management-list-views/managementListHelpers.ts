import { Dispatch, SetStateAction } from 'react'
import { RelatedRole, RoleOrgIdentity } from '@isdd/metais-common/api/generated/iam-swagger'
import { GetImplicitHierarchyFilter } from '@isdd/metais-common/hooks/useGetImplicitHierarchy'

import { HierarchyItem, OrgData, RoleTable } from './UserRolesForm'

export const formatGidsData = (data: Record<string, OrgData>) => {
    const formatedData: { roleId: string; orgId: string }[] = []

    for (const orgKey in data) {
        for (const roleKey in data[orgKey].roles) {
            formatedData.push({ roleId: roleKey, orgId: orgKey })
        }
    }
    return formatedData
}

export const getUniqueUserOrg = (userOrganizations: RoleOrgIdentity[] | undefined) => {
    const uniqueUserOrg = [...new Map(userOrganizations?.map((item) => [item.orgId, item])).values()]
    return uniqueUserOrg
}

export const formatOrgData = (data: Record<string, OrgData>, selectedOrg: HierarchyItem | null, rowSelection: Record<string, RoleTable>) => {
    const formatedData = {
        ...data,
        [selectedOrg?.poUUID ?? '']: {
            orgId: selectedOrg?.poUUID ?? '',
            orgName: selectedOrg?.poName ?? '',
            orgStreet: selectedOrg?.address.street ?? '',
            orgVillage: selectedOrg?.address.village ?? '',
            orgZIP: selectedOrg?.address.zipCode ?? '',
            orgNumber: selectedOrg?.address.number ?? '',
            roles: rowSelection,
        },
    }
    return formatedData
}

export const getDefaultRolesKeys = (
    noDuplicateUserOrg: RoleOrgIdentity[],
    userOrganizations: RoleOrgIdentity[] | undefined,
    userRelatedRoles: RelatedRole[],
) => {
    const formatUserRoles = (organization: RoleOrgIdentity) => {
        return (
            userOrganizations
                ?.filter((org) => org.orgId === organization.orgId)
                .reduce((acc: Record<string, RoleTable>, orgToReduce) => {
                    const usedItem = userRelatedRoles.find((role) => role.uuid === orgToReduce.roleId)
                    return {
                        ...acc,
                        [usedItem?.uuid?.toString() ?? '']: {
                            uuid: usedItem?.uuid ?? '',
                            name: usedItem?.name ?? '',
                            description: usedItem?.description ?? '',
                            assignedGroup: usedItem?.assignedGroup ?? '',
                        },
                    }
                }, {}) ?? {}
        )
    }

    const defaultRolesKeys = noDuplicateUserOrg.reduce(
        (acc: Record<string, OrgData>, organization) => ({
            ...acc,
            [organization.orgId ?? '']: {
                orgId: organization.orgId ?? '',
                orgName: organization.orgName ?? '',
                orgStreet: organization.orgStreet ?? '',
                orgVillage: organization.orgVillage ?? '',
                orgZIP: organization.orgZIP ?? '',
                orgNumber: organization.orgNumber ?? '',
                roles: formatUserRoles(organization),
            },
        }),
        {},
    )

    return defaultRolesKeys
}

export const getLoadOptions = (
    setFilter: Dispatch<SetStateAction<GetImplicitHierarchyFilter>>,
    userOrganizations: RoleOrgIdentity[] | undefined,
    implicitHierarchyDataRights: HierarchyItem[],
) => {
    const loadOptions = async (searchQuery: string, additional: { page: number } | undefined) => {
        const page = searchQuery && !additional?.page ? 1 : (additional?.page || 0) + 1
        setFilter((prev) => ({ ...prev, page: page + 1, fullTextSearch: searchQuery }))

        const uniqueUserOrg = getUniqueUserOrg(userOrganizations)

        const userOptions: HierarchyItem[] =
            uniqueUserOrg.map((item) => ({
                HIERARCHY_FROM_ROOT: -1,
                poName: item.orgName ?? '',
                poUUID: item.orgId ?? '',
                roles: [],
                path: '',
                address: {
                    street: item.orgStreet ?? '',
                    zipCode: item.orgZIP ?? '',
                    village: item.orgVillage ?? '',
                    number: item.orgNumber ?? '',
                },
            })) ?? []

        const options: HierarchyItem[] = [...userOptions, ...implicitHierarchyDataRights]

        return {
            options: options || [],
            hasMore: options?.length ? true : false,
            additional: {
                page: page,
            },
        }
    }
    return loadOptions
}

export const getDataForUserRolesTable = (userOrganizations: RoleOrgIdentity[] | undefined, org: RoleOrgIdentity) => {
    const data = userOrganizations
        ?.filter((orgToFilter) => orgToFilter.orgId === org.orgId && orgToFilter.roleId && orgToFilter.roleName && orgToFilter.roleDesc)
        .map((orgToMap) => ({
            uuid: orgToMap.roleId,
            role: orgToMap.roleName,
            description: orgToMap.roleDesc,
        }))
    return data
}

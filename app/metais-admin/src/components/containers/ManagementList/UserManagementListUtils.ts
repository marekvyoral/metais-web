import { ConfigurationItemSetUi, ConfigurationItemUi } from '@isdd/metais-common/api/generated/cmdb-swagger'
import { StringList, Identity } from '@isdd/metais-common/api/generated/iam-swagger'
import { IFilter } from '@isdd/idsk-ui-kit/types'
import { IFilterParams } from '@isdd/metais-common/hooks/useFilter'

export interface UserManagementListItem {
    identity: Identity
    ciItems?: ConfigurationItemUi[]
    isLoggedInUser: boolean
}

export interface UserManagementListData {
    list: UserManagementListItem[]
    dataLength: number
}

export enum UserManagementActionsOverRowEnum {
    BLOCK = 'BLOCK',
    EDIT = 'EDIT',
    CHANGE_PASSWORD = 'CHANGE_PASSWORD',
}

export interface UserManagementFilterData extends IFilterParams, IFilter {
    state?: string
    orgId?: string
    roleUuid?: string
}

export const defaultFilterValues: UserManagementFilterData = {
    state: '',
    orgId: '',
    roleUuid: '',
}

export function extractOrganizationsForList(organizationsForListData?: StringList[]): string[] {
    return (
        organizationsForListData
            ?.map((item) => item.strings || undefined)
            .flat()
            .filter((item): item is string => !!item) ?? []
    )
}

export function getCiForIdentity(
    identity: Identity,
    organizations?: StringList[],
    ciItemsData?: ConfigurationItemSetUi,
): ConfigurationItemUi[] | undefined {
    const organizationUuids = organizations?.find((org) => org.requestUuid === identity?.uuid)
    if (!organizationUuids) return undefined

    return organizationUuids.strings
        ?.map((orgUuid) => ciItemsData?.configurationItemSet?.find((ciItem) => ciItem.uuid === orgUuid))
        .filter((item): item is ConfigurationItemUi => !!item)
}

export function mapDataToManagementList(
    identitiesList?: Identity[],
    organizationsForListData?: StringList[],
    ciItemsData?: ConfigurationItemSetUi,
    loggedInUserUuid?: string,
): UserManagementListItem[] {
    return (
        identitiesList?.map((identity) => {
            return {
                identity,
                ciItems: getCiForIdentity(identity, organizationsForListData, ciItemsData),
                isLoggedInUser: loggedInUserUuid === identity.uuid,
            }
        }) || []
    )
}

export function reduceRowsToObject(rows: UserManagementListItem[]) {
    return rows.reduce<Record<string, UserManagementListItem>>((result, item) => {
        if (item.identity.uuid) {
            result[item.identity.uuid] = item
        }
        return result
    }, {})
}

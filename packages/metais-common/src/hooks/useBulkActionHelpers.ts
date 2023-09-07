import uniq from 'lodash/uniq'

import { CiType, ConfigurationItemUi, useGetCiTypeHook } from '@isdd/metais-common/api'
import { useGetRightsForPOBulkHook, useIsInPoByGid1Hook } from '@isdd/metais-common/api/generated/iam-swagger'
import { useAuth } from '@isdd/metais-common/contexts/auth/authContext'

export const useBulkActionHelpers = () => {
    const {
        state: { user },
    } = useAuth()

    const getRightsForPOBulk = useGetRightsForPOBulkHook()
    const getCiType = useGetCiTypeHook()
    const checkIsInPoByGid = useIsInPoByGid1Hook()

    const loadRights = async (owners: string[]) => {
        const rightsResult = await getRightsForPOBulk({
            login: user?.login,
            gids: owners,
        })

        return rightsResult
    }

    const getGidsForChangeOwner = () => {
        const changeOwnerGids: string[] = []

        user?.groupData.forEach((group) => {
            group.roles.forEach((role) => {
                //  replace EA_GARPO for some enum
                if (role.roleName === 'EA_GARPO') {
                    changeOwnerGids.push(role.gid)
                }
            })
        })

        return changeOwnerGids
    }

    const findInterSection = (schemaRoles: string[], rightsRoles: (string | undefined)[]) => {
        return schemaRoles.some((role) => {
            return rightsRoles.indexOf(role) != -1
        })
    }

    const loadSchemaData = async (types: string[]) => {
        const fetchedData: CiType[] = []
        const entitySchemaMap: { [key: string]: CiType } = {}
        for (const type of types) {
            const response = await getCiType(type)
            fetchedData.push(response)
        }

        fetchedData.forEach((item) => {
            const techName = item.technicalName || ''
            entitySchemaMap[techName] = item
        })

        return entitySchemaMap
    }

    const bulkCheck = async (ciList: ConfigurationItemUi[]) => {
        let canReInvalidate = true

        const types = uniq(ciList.map((item) => item.type || ''))
        const owners = uniq(ciList.map((item) => item.metaAttributes?.owner || ''))

        const rightResponse = await loadRights(owners)
        const schemaResponse = await loadSchemaData(types)

        ciList.forEach((item) => {
            const schema = schemaResponse[item.type || '']
            const roles = rightResponse.find((i) => i.gid === item.metaAttributes?.owner)?.gidRoles?.map((i) => i.roleName) || []

            if (!schema.roleList || schema.roleList.length === 0 || roles.length === 0 || !findInterSection(schema.roleList, roles)) {
                canReInvalidate = false
            }
        })

        return canReInvalidate
    }

    const checkChangeOfOwner = async (items: ConfigurationItemUi[]) => {
        const changeUserGids = getGidsForChangeOwner()
        if (changeUserGids.length > 0) {
            const gids = uniq(items.filter((item) => !!item.attributes)?.map((item) => item.metaAttributes?.owner || ''))

            try {
                const resultData = await checkIsInPoByGid({ gids, identityGids: changeUserGids })

                const map: { [key: string]: boolean } = {}

                resultData.gids?.forEach((gid) => {
                    const gidKey = gid.gid || ''
                    map[gidKey] = !!gid.assigned
                })

                return map
            } catch {
                return {}
            }
        }
        return {}
    }

    const ciInvalidFilter = (ci: ConfigurationItemUi) => {
        return !!(ci && ci.metaAttributes && ci.metaAttributes.state === 'INVALIDATED')
    }

    return { bulkCheck, ciInvalidFilter, checkChangeOfOwner }
}
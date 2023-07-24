import {
    ReadCiNeighboursWithAllRels200,
    ConfigurationItemUi,
    ReadCiNeighbours200,
    RoleParticipantUI,
    ConfigurationItemSetUi,
} from '../generated/cmdb-swagger'

import { AttributesParent, transformAttributesKeyValue } from './transform'
import { useCustomClient } from './use-custom-client'

const baseURL = import.meta.env.VITE_REST_CLIENT_CMDB_TARGET_URL

export const useClientForReadConfigurationItemUsingGET = <T extends ConfigurationItemUi>() =>
    useCustomClient<T>(baseURL, (body) => transformAttributesKeyValue(body))

export const useClientForGetRoleParticipantUsingGET = <T extends RoleParticipantUI>() =>
    useCustomClient<T>(baseURL, (body) => transformAttributesKeyValue(body.configurationItemUi))

export const useClientForReadCiNeighboursWithAllRelsUsingGET = <T extends ReadCiNeighboursWithAllRels200>() =>
    useCustomClient<T>(baseURL, (body) => {
        body?.ciWithRels?.forEach?.((rel: { ci: AttributesParent | undefined }) => {
            transformAttributesKeyValue(rel.ci)
        })
    })

export const useClientForGetRoleParticipantBulkUsingPOST = <T extends RoleParticipantUI[]>() =>
    useCustomClient<T>(baseURL, (body) => {
        body?.forEach?.((rel) => {
            transformAttributesKeyValue(rel.configurationItemUi)
        })
    })

export const useClientForReadCiListUsingPOST = <T extends ConfigurationItemSetUi>() =>
    useCustomClient<T>(baseURL, (body) => {
        if (body.configurationItemSet) {
            body.configurationItemSet.forEach((configurationItem) => {
                transformAttributesKeyValue(configurationItem)
            })
        }
    })

export const useClientForreadCiNeighboursUsingPOST = <T extends ReadCiNeighbours200>() =>
    useCustomClient<T>(baseURL, (body) => {
        body.fromNodes?.neighbourPairs?.forEach(
            (nP: { configurationItem: AttributesParent | undefined; relationship: AttributesParent | undefined }) => {
                transformAttributesKeyValue(nP.configurationItem)
                transformAttributesKeyValue(nP.relationship)
            },
        )
        body.toNodes?.neighbourPairs?.forEach(
            (nP: { configurationItem: AttributesParent | undefined; relationship: AttributesParent | undefined }) => {
                transformAttributesKeyValue(nP.configurationItem)
                transformAttributesKeyValue(nP.relationship)
            },
        )
    })

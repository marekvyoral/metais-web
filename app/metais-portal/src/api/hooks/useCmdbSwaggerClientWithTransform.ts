import { CiWithRelsResultUi, ConfigurationItemUi, NeighbourSetUi, RoleParticipantUI } from '../generated/cmdb-swagger'

import { transformAttributesKeyValue } from './transform'
import { useCustomClient } from './use-custom-client'

const baseURL = import.meta.env.VITE_REST_CLIENT_CMDB_BASE_URL

export const useClientForReadConfigurationItemUsingGET = <T extends ConfigurationItemUi>() =>
    useCustomClient<T>(baseURL, (body) => transformAttributesKeyValue(body))

export const useClientForGetRoleParticipantUsingGET = <T extends RoleParticipantUI>() =>
    useCustomClient<T>(baseURL, (body) => transformAttributesKeyValue(body.configurationItemUi))

export const useClientForReadCiNeighboursWithAllRelsUsingGET = <T extends CiWithRelsResultUi>() =>
    useCustomClient<T>(baseURL, (body) => {
        body?.ciWithRels?.forEach?.((rel) => {
            transformAttributesKeyValue(rel.ci)
        })
    })

export const useClientForGetRoleParticipantBulkUsingPOST = <T extends RoleParticipantUI[]>() =>
    useCustomClient<T>(baseURL, (body) => {
        body?.forEach?.((rel) => {
            transformAttributesKeyValue(rel.configurationItemUi)
        })
    })

export const useClientForreadCiNeighboursUsingPOST = <T extends NeighbourSetUi>() =>
    useCustomClient<T>(baseURL, (body) => {
        body.fromNodes?.neighbourPairs?.forEach?.((nP) => {
            transformAttributesKeyValue(nP.configurationItem)
            transformAttributesKeyValue(nP.relationship)
        })
        body.toNodes?.neighbourPairs?.forEach?.((nP) => {
            transformAttributesKeyValue(nP.configurationItem)
            transformAttributesKeyValue(nP.relationship)
        })
    })

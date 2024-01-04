import { transformAttributesKeyValue } from './transform'
import { useCustomClient } from './use-custom-client'

import {
    CiWithRelsResultUi,
    ConfigurationItemUi,
    NeighbourSetUi,
    RoleParticipantUI,
    ConfigurationItemSetUi,
    HistoryVersionsListUiConfigurationItemUi,
    ConfigurationItemNeighbourSetUi,
} from '@isdd/metais-common/api/generated/cmdb-swagger'

const baseURL = import.meta.env.VITE_REST_CLIENT_CMDB_TARGET_URL

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

export const useClientForReadCiDerivedRelTypesUsingGET = <T extends CiWithRelsResultUi>() =>
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

export const useClientForReadCiListUsingPOST = <T extends ConfigurationItemSetUi>() =>
    useCustomClient<T>(baseURL, (body) => {
        if (body.configurationItemSet) {
            body.configurationItemSet.forEach((configurationItem) => {
                transformAttributesKeyValue(configurationItem)
            })
        }
    })

export const useClientForreadCiNeighboursUsingPOST = <T extends NeighbourSetUi>() =>
    useCustomClient<T>(baseURL, (body) => {
        body.fromNodes?.neighbourPairs?.forEach((nP) => {
            transformAttributesKeyValue(nP.configurationItem)
            transformAttributesKeyValue(nP.relationship)
        })
        body.toNodes?.neighbourPairs?.forEach((nP) => {
            transformAttributesKeyValue(nP.configurationItem)
            transformAttributesKeyValue(nP.relationship)
        })
    })

export const useClientForRefRegistersHistory = <T extends HistoryVersionsListUiConfigurationItemUi>() =>
    useCustomClient<T>(baseURL, (body) => {
        body.historyVersions?.forEach((nP) => {
            transformAttributesKeyValue(nP.item)
        })
    })

export const useClientForReadCiListNeighboursUsingGET = <T extends ConfigurationItemNeighbourSetUi>() =>
    useCustomClient<T>(baseURL, (body) => {
        body?.toCiSet?.forEach((nP) => {
            transformAttributesKeyValue(nP)
        })
    })

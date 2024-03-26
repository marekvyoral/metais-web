import { ATTRIBUTE_NAME } from '@isdd/metais-common/api'
import {
    ConfigurationItemUi,
    ConfigurationItemUiAttributes,
    RelationshipUi,
    RequestIdUi,
    useInvalidateRelationshipHook,
    useReadCiNeighboursWithAllRelsHook,
    useReadConfigurationItemsByMetaIsCodesHook,
    useReadRelationshipsHook,
    useRecycleInvalidatedRelsHook,
    useStoreRelationship,
} from '@isdd/metais-common/api/generated/cmdb-swagger'
import { ENTITY_ZS, INVALIDATED } from '@isdd/metais-common/constants'
import { useGetStatus } from '@isdd/metais-common/hooks/useGetRequestStatus'
import { useState } from 'react'
import { v4 as uuidV4 } from 'uuid'

enum POUZIVATEL_KS {
    POUZIVATEL_7 = 'c_pouzivatel.7',
    POUZIVATEL_5 = 'c_pouzivatel.5',
}

export const useKSChannel = () => {
    const [isLoading, setIsLoading] = useState(false)
    const [isError, setIsError] = useState(false)
    const readByMetaisCode = useReadConfigurationItemsByMetaIsCodesHook()
    const { mutateAsync: storeRel, isLoading: isStoreRelationLoading, isError: isStoreRelationError } = useStoreRelationship()
    const readRelaionships = useReadRelationshipsHook()
    const recycleRel = useRecycleInvalidatedRelsHook()
    const invalidateRel = useInvalidateRelationshipHook()
    const readNeighboursWithAllRels = useReadCiNeighboursWithAllRelsHook()
    const { isError: isRedirectError, isLoading: isRedirectLoading, isProcessedError, getRequestStatus, isTooManyFetchesError } = useGetStatus()

    const EA_Profil_KS_pristupove_miesto = 'EA_Profil_KS_pristupove_miesto'
    const EA_Profil_KS_pouzivatel_ks = 'EA_Profil_KS_pouzivatel_ks'
    const Kanal_spristupnuje_KS = 'Kanal_spristupnuje_KS'

    //FROM LEGACY CODE
    const PRIST_MIESTO_KANAL: { [key: string]: string } = {
        'c_pristup.1': 'c_kanal.5', // call centrum -> tel
        'c_pristup.2': 'kanal_31', // integrované obslužné miesto -> asistovane elektronicky
        'c_pristup.3': 'c_kanal.7', // Ústredný portál verejnej správy -> web
        'c_pristup.4': 'c_kanal.7', // špecializovaný portál -> web
        'c_pristupove_miesto.5': 'c_kanal.9', // eGov APP ->            mobilny pristup
        'c_pristupove_miesto.6': 'kanal_25', // GovTechApps komercna pobocka ->   tretie strany
        'c_pristupove_miesto.7': 'c_kanal.1', // email -> email
        'c_pristupove_miesto.8': 'c_kanal.4', // SMS ->  SMS
        'c_pristupove_miesto.9': 'c_kanal.2', // Pracovisko OVM – Osobný kontakt
        'c_pristupove_miesto.10': 'c_kanal.2', // klient.centrum st.spravy ->  osobne
        'c_pristupove_miesto.11': 'c_kanal.3', // Podatelna organu verejnej moci
        'c_pristupove_miesto.12': 'c_kanal.5',
    }

    const resolveRequestPromises = async (requestIdArray: RequestIdUi[]) => {
        const statusPromises: Promise<void>[] = []
        requestIdArray.forEach((req) => {
            const statusProm = getRequestStatus(req?.requestId ?? '')
            statusPromises.push(statusProm)
        })
        await Promise.all(statusPromises)
    }

    const removeZS = async (uuid: string, pouzivatelKS: string) => {
        if (pouzivatelKS.includes(POUZIVATEL_KS.POUZIVATEL_5) && pouzivatelKS.includes(POUZIVATEL_KS.POUZIVATEL_7)) {
            return
        }
        const neighboursWithAllRels = await readNeighboursWithAllRels(uuid, { ciTypes: [ENTITY_ZS] })

        const requestPromises: Promise<RequestIdUi>[] = []
        neighboursWithAllRels?.ciWithRels?.forEach((rel) => {
            rel.ci?.attributes?.forEach((attr: ConfigurationItemUiAttributes) => {
                if (attr?.name == ATTRIBUTE_NAME.Gen_Profil_kod_metais) {
                    const METAIS_KOD_51 = '051'
                    const METAIS_KOD_50 = '050'
                    const ZMENA_POUZIVATELA_KS_COMMENT = 'zmena pouzivatela KS'
                    if (
                        (pouzivatelKS.includes(POUZIVATEL_KS.POUZIVATEL_7) && attr.value < METAIS_KOD_51) ||
                        (pouzivatelKS.includes(POUZIVATEL_KS.POUZIVATEL_5) && attr.value > METAIS_KOD_50)
                    ) {
                        return
                    }
                    const r = rel?.rels?.[0]
                    const param = {
                        type: r?.type,
                        uuid: r?.uuid,
                        startUuid: r?.startUuid,
                        endUuid: r?.endUuid,
                        invalidateReason: {
                            comment: ZMENA_POUZIVATELA_KS_COMMENT,
                        },
                    }
                    const request = invalidateRel(param, { newState: [INVALIDATED] })
                    requestPromises.push(request)
                }
            })
        })
        const requestIdArray = await Promise.all(requestPromises)
        await resolveRequestPromises(requestIdArray)
    }

    const invalidateOldChannels = (old: Map<string, RelationshipUi>) => {
        const requestIdPromises: Promise<RequestIdUi>[] = []
        old.forEach((rel) => {
            if (rel?.metaAttributes?.state != INVALIDATED) {
                const ZMENA_PRIST_MIESTA_COMMENT = 'zmena pristupoveho miesta'
                const param = {
                    type: Kanal_spristupnuje_KS,
                    uuid: rel.uuid,
                    startUuid: rel.startUuid,
                    endUuid: rel.endUuid,
                    invalidateReason: {
                        comment: ZMENA_PRIST_MIESTA_COMMENT,
                    },
                }
                const requestId = invalidateRel(param, { newState: [INVALIDATED] })
                requestIdPromises.push(requestId)
            }
        })

        return requestIdPromises
    }

    const createRelationshipWithChannel = async (entityData: ConfigurationItemUi, channelCodes: string[], old: Map<string, RelationshipUi>) => {
        const mappedChannelCodes: string[] = []
        channelCodes?.forEach((code) => {
            if (PRIST_MIESTO_KANAL?.[code]) {
                const channel = PRIST_MIESTO_KANAL?.[code]
                if (!mappedChannelCodes.includes(channel)) {
                    mappedChannelCodes.push(channel)
                }
            }
        })
        const requestIdPromises: Promise<RequestIdUi>[] = []
        if (channelCodes && channelCodes?.length > 0) {
            const channelData = await readByMetaisCode({ metaIsCodes: mappedChannelCodes })
            channelData?.configurationItemSet?.forEach((ch) => {
                if (old?.get(ch?.uuid ?? '') === undefined) {
                    const requestId = storeRel({
                        data: {
                            type: Kanal_spristupnuje_KS,
                            uuid: uuidV4(),
                            startUuid: ch?.uuid,
                            endUuid: entityData?.uuid,
                            owner: entityData?.owner,
                            attributes: [],
                        },
                    })
                    requestIdPromises.push(requestId)
                    old?.delete(ch?.uuid ?? '')
                } else {
                    const currentRel = old?.get(ch?.uuid ?? '')
                    if (currentRel) {
                        if (old?.get(ch?.uuid ?? '')?.metaAttributes?.state == INVALIDATED) {
                            const requestId = recycleRel({ relIdList: [old?.get(ch?.uuid ?? '')?.uuid ?? ''] })
                            requestIdPromises?.push(requestId)
                        }
                        old.delete(ch?.uuid ?? '')
                    }
                }
            })

            if (old?.size > 0) {
                const invalidatePromises = invalidateOldChannels(old)
                invalidatePromises.forEach((prom) => requestIdPromises.push(prom))
            }
        } else {
            const invalidatePromises = invalidateOldChannels(old)
            invalidatePromises.forEach((prom) => requestIdPromises.push(prom))
        }

        const requestIdArray = await Promise.all(requestIdPromises)
        await resolveRequestPromises(requestIdArray)
    }

    const createChannelForKS = async (entityData: ConfigurationItemUi, onSuccess: () => void) => {
        setIsLoading(true)

        try {
            const relations = await readRelaionships(entityData?.uuid ?? '', {
                'types[]': [Kanal_spristupnuje_KS],
            })

            const oldMap = new Map<string, RelationshipUi>()
            relations?.endRelationshipSet?.forEach((rel) => {
                oldMap.set(rel?.startUuid ?? '', rel)
            })

            const pouzivatelKS = entityData.attributes?.find((att: { name: string; value: string }) => att.name == EA_Profil_KS_pouzivatel_ks)
            const pristupMiesto = entityData.attributes?.find((att: { name: string; value: string }) => att.name == EA_Profil_KS_pristupove_miesto)

            if (pristupMiesto) {
                await createRelationshipWithChannel(entityData, pristupMiesto.value, oldMap)
            } else {
                const invalidatePromises = invalidateOldChannels(oldMap)
                const requestIdArray = await Promise.all(invalidatePromises)
                await resolveRequestPromises(requestIdArray)
            }

            if (pouzivatelKS) {
                await removeZS(entityData?.uuid ?? '', pouzivatelKS.value)
            }

            onSuccess()
        } catch {
            setIsError(true)
        } finally {
            setIsLoading(false)
        }
    }
    return {
        createChannelForKS,
        isLoading: isLoading || isStoreRelationLoading || isRedirectLoading,
        isError: isError || isStoreRelationError || isRedirectError || isTooManyFetchesError || isProcessedError,
    }
}

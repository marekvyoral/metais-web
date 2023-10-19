import { useMemo } from 'react'

import {
    CiWithRelsResultUi,
    ReadCiNeighboursWithAllRelsParams,
    useGetRoleParticipantBulk,
    useReadCiDerivedRelTypes,
    useReadCiNeighboursWithAllRels,
} from '@isdd/metais-common/api'

export const useEntityRelationsDataList = (id: string, pageConfig: ReadCiNeighboursWithAllRelsParams, isDerived: boolean) => {
    const {
        isLoading,
        isError,
        isFetching,
        data: directList,
    } = useReadCiNeighboursWithAllRels(id, pageConfig, {
        query: {
            enabled: !!pageConfig?.ciTypes?.length,
        },
    })

    const {
        data: derivedList,
        isLoading: isDerivedLoading,
        isFetching: isDerivedFetching,
    } = useReadCiDerivedRelTypes(id, pageConfig.relTypes ? pageConfig.relTypes[0] : '', {
        ...pageConfig,
    })

    const relationsList: CiWithRelsResultUi | undefined = useMemo(() => {
        if (!isDerived) return directList
        else return derivedList
    }, [directList, derivedList, isDerived])

    const owners: string[] = []
    relationsList?.ciWithRels?.forEach((rel) => rel.ci?.metaAttributes?.owner && owners.push(rel.ci?.metaAttributes?.owner))

    const {
        isLoading: isOwnersLoading,
        isError: isOwnersError,
        data: ownersData,
    } = useGetRoleParticipantBulk({ gids: owners }, { query: { enabled: !!owners?.length } })

    return {
        isLoading: isLoading || isOwnersLoading || isFetching,
        isDerivedLoading: isDerivedLoading || isDerivedFetching,
        isError: isError || isOwnersError,
        relationsList: relationsList,
        owners: ownersData,
    }
}

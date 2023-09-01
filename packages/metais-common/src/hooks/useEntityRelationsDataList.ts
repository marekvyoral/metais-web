import { ReadCiNeighboursWithAllRelsParams, useGetRoleParticipantBulk, useReadCiNeighboursWithAllRels } from '@isdd/metais-common/api'

export const useEntityRelationsDataList = (id: string, pageConfig: ReadCiNeighboursWithAllRelsParams) => {
    const {
        isLoading,
        isError,
        data: relationsList,
    } = useReadCiNeighboursWithAllRels(id, pageConfig, {
        query: {
            enabled: !!pageConfig?.ciTypes?.length,
        },
    })

    const owners = ([...new Set(relationsList?.ciWithRels?.map((rel) => rel?.ci?.metaAttributes?.owner).filter(Boolean))] as string[]) ?? []
    const {
        isLoading: isOwnersLoading,
        isError: isOwnersError,
        data: ownersData,
    } = useGetRoleParticipantBulk({ gids: owners }, { query: { enabled: !!owners?.length } })

    return {
        isLoading: isLoading || isOwnersLoading,
        isError: isError || isOwnersError,
        relationsList,
        owners: ownersData,
    }
}

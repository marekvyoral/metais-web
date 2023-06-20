import {
    useReadCiNeighboursWithAllRelsUsingGET,
    useListRelatedCiTypesUsingGET,
    useReadNeighboursConfigurationItemsCountUsingGET,
    useGetRoleParticipantBulkUsingPOST,
    RelatedCiTypePreview,
} from '@/api'

export interface IKeyToDisplay {
    tabName: string
    technicalName: string
    count: number
}

export interface IEntityRelationsTypesCount {
    isLoading: boolean
    isError: boolean
    data: RelatedCiTypePreview[]
    keysToDisplay: IKeyToDisplay[]
}

const PREDEFINED_TABS = ['AS', 'Projekt', 'InfraSluzba', 'PO', 'osobitny_postup_ITVS', 'ISVS'] // toto je len zatial, mal by byť config na frontende podla docs

export const useEntityRelationsTypesCount = (id: string, technicalName: string) => {
    const { isLoading, isError, data: countData } = useReadNeighboursConfigurationItemsCountUsingGET(id)
    const { isLoading: isRelatedLoading, isError: isRelatedError, data: relatedData } = useListRelatedCiTypesUsingGET(technicalName)

    const allRelation = [...(relatedData?.cisAsTargets ?? []), ...(relatedData?.cisAsSources ?? [])]
    const keysToDisplay: IKeyToDisplay[] = PREDEFINED_TABS?.map((tab) => {
        const typeName = allRelation.find((relation) => relation?.ciTypeTechnicalName === tab)?.ciTypeName
        const count = countData?.[tab] ?? 0
        return {
            tabName: `${typeName} (${count})`,
            technicalName: tab,
            count,
        }
    })

    return {
        isLoading: isLoading || isRelatedLoading,
        isError: isError || isRelatedError,
        data: allRelation,
        keysToDisplay,
    }
}

export interface IPageConfig {
    page: number
    perPage: number
}

export const useEntityRelationsDataList = (id: string, pageConfig: IPageConfig, name: string) => {
    const {
        isLoading,
        isError,
        data: relationsList,
    } = useReadCiNeighboursWithAllRelsUsingGET(
        id,
        {
            ciTypes: [name ?? ''],
            page: pageConfig.page,
            perPage: pageConfig.perPage,
            state: ['DRAFT'],
        },
        {
            query: {
                enabled: !!name,
            },
        },
    )

    const owners = ([...new Set(relationsList?.ciWithRels?.map((rel) => rel?.ci?.metaAttributes?.owner).filter(Boolean))] as string[]) ?? []
    const {
        isLoading: isOwnersLoading,
        isError: isOwnersError,
        data: ownersData,
    } = useGetRoleParticipantBulkUsingPOST({ gids: owners }, { query: { enabled: !!owners?.length } })

    return {
        isLoading: isLoading || isOwnersLoading,
        isError: isError || isOwnersError,
        relationsList,
        owners: ownersData,
    }
}

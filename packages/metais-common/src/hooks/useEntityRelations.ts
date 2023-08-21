import {
    useReadCiNeighboursWithAllRels,
    useListRelatedCiTypes,
    useReadNeighboursConfigurationItemsCount,
    useGetRoleParticipantBulk,
    RelatedCiTypePreview,
    ReadCiNeighboursWithAllRelsParams,
} from '@isdd/metais-common/api'

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
    const { isLoading, isError, data: countData } = useReadNeighboursConfigurationItemsCount(id)
    const { isLoading: isRelatedLoading, isError: isRelatedError, data: relatedData } = useListRelatedCiTypes(technicalName)

    const allRelation = [...(relatedData?.cisAsTargets ?? []), ...(relatedData?.cisAsSources ?? [])]
    const keysToDisplay: IKeyToDisplay[] = PREDEFINED_TABS?.map((tab) => {
        const typeName = allRelation.find((relation) => relation?.ciTypeTechnicalName === tab)?.ciTypeName
        const count = countData?.[tab] ?? 0
        if (typeName)
            return {
                tabName: `${typeName} (${count})`,
                technicalName: tab,
                count,
            }
        return {
            tabName: '',
            technicalName: tab,
            count,
        }
    })?.filter((tab) => tab?.tabName !== '' && tab?.count > 0)

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

import { useMemo } from 'react'

import {
    NeighboursFilterContainerUi,
    ReadCiNeighboursWithAllRelsParams,
    RelatedCiTypePreview,
    RelatedCiTypePreviewList,
    useGetRoleParticipantBulk,
    useListRelatedCiTypes,
    useReadCiNeighboursWithAllRels,
    useReadNeighboursConfigurationItemsCount,
} from '@isdd/metais-common/api'
import { useAuth } from '@isdd/metais-common/contexts/auth/authContext'

enum CATEGORY_ENUM {
    NOT_VISIBLE = 'NO',
    READ_ONLY_BDA = 'ROCB',
    READ_ONLY = 'RONCB',
    READ_WRITE = 'RWNCB',
    READ_WRITE_BDA = 'RWCB',
}
enum TYPES {
    SYSTEM = 'system',
}
const NOT_PUBLIC_ENTITIES = ['MiestoPrevadzky']

const isRelatedCiTypeCmdbView = (type: RelatedCiTypePreview, isLogged: boolean): boolean => {
    const isValid = type.ciTypeValid === true && type.relationshipTypeValid === true
    const isCategory = type.ciCategory !== CATEGORY_ENUM.NOT_VISIBLE && type.relationshipCategory !== CATEGORY_ENUM.NOT_VISIBLE
    const isTypeOk = type.ciTypeUsageType !== TYPES.SYSTEM && type.relationshipTypeUsageType !== TYPES.SYSTEM
    const isViewForLogged = isLogged || NOT_PUBLIC_ENTITIES.indexOf(type.ciTypeTechnicalName || '') === -1

    return isValid && isCategory && isTypeOk && isViewForLogged
}

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

const removeDuplicates = (arr: RelatedCiTypePreview[], by: string) => {
    try {
        const propertyList = arr.map((item) => item[by as keyof RelatedCiTypePreview])
        const filtered = arr.filter((item, index) => !propertyList.includes(item[by as keyof RelatedCiTypePreview], index + 1))
        return filtered
    } catch {
        return undefined
    }
}

export const useEntityRelationsTypesCount = (id: string, technicalName: string) => {
    const {
        state: { user },
    } = useAuth()
    const isUserLogged = !!user
    const { isLoading, isError, data: countData } = useReadNeighboursConfigurationItemsCount(id)
    const { isLoading: isRelatedLoading, isError: isRelatedError, data: relatedData } = useListRelatedCiTypes(technicalName)

    const relatedCiTypesFilteredForView = useMemo((): RelatedCiTypePreviewList => {
        const filteredSources = relatedData?.cisAsSources?.filter((relatedType) => isRelatedCiTypeCmdbView(relatedType, isUserLogged))
        const filteredTargets = relatedData?.cisAsTargets?.filter((relatedType) => isRelatedCiTypeCmdbView(relatedType, isUserLogged))
        const relatedCiTypesFilteredData: RelatedCiTypePreviewList = { cisAsSources: filteredSources, cisAsTargets: filteredTargets }
        return relatedCiTypesFilteredData
    }, [relatedData, isUserLogged])

    const allRelationRaw = [...(relatedCiTypesFilteredForView?.cisAsTargets ?? []), ...(relatedCiTypesFilteredForView?.cisAsSources ?? [])]
    const allRelation = removeDuplicates(allRelationRaw, 'ciTypeTechnicalName')

    if (allRelation == undefined) {
        return {
            isLoading: false,
            isError: false,
            data: undefined,
            keysToDisplay: undefined,
        }
    }

    const keysToDisplay: IKeyToDisplay[] = allRelation
        .map((relation) => {
            const typeName = relation.ciTypeName
            const count = countData?.[relation?.ciTypeTechnicalName ?? ''] ?? 0
            return {
                tabName: `${typeName ?? ''} (${count})`,
                technicalName: relation.ciTypeTechnicalName ?? '',
                count,
            }
        })
        ?.filter((tab) => tab?.tabName !== '' && tab?.count > 0)

    const keysToDisplaySorted = keysToDisplay.sort((a, b) => (a.count > b.count ? -1 : 1))

    return {
        isLoading: isLoading || isRelatedLoading,
        isError: isError || isRelatedError,
        data: allRelation,
        keysToDisplay: keysToDisplaySorted,
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

export const useEntityRelationshipTabFilters = (technicalName: string) => {
    const {
        state: { user },
    } = useAuth()
    const isUserLogged = !!user
    const { isLoading: isRelatedLoading, isError: isRelatedError, data: relatedData } = useListRelatedCiTypes(technicalName ?? '')
    const relatedCiTypesFilteredForView = useMemo((): RelatedCiTypePreviewList => {
        const filteredSources = relatedData?.cisAsSources?.filter((relatedType) => isRelatedCiTypeCmdbView(relatedType, isUserLogged))
        const filteredTargets = relatedData?.cisAsTargets?.filter((relatedType) => isRelatedCiTypeCmdbView(relatedType, isUserLogged))

        if (filteredSources == undefined || filteredTargets == undefined) {
            return { cisAsSources: undefined, cisAsTargets: undefined }
        }
        
        const uniqueFilteredSources = removeDuplicates(filteredSources ?? [], 'ciTypeTechnicalName')
        const uniqueFilteredTargets = removeDuplicates(filteredTargets ?? [], 'ciTypeTechnicalName')

        const relatedCiTypesFilteredData: RelatedCiTypePreviewList = { cisAsSources: uniqueFilteredSources, cisAsTargets: uniqueFilteredTargets }
        return relatedCiTypesFilteredData
    }, [relatedData, isUserLogged])

    const mapFilterToNeighboursContainerUi = (relatedCiTypePreviewArray: RelatedCiTypePreview[] | undefined): NeighboursFilterContainerUi => {
        let ciType: string[] | undefined = []
        let relType: string[] | undefined = []

        relatedCiTypePreviewArray?.forEach((relatedCiType) => {
            ciType = ciType?.concat(relatedCiType.ciTypeTechnicalName ?? '')
            relType = relType?.concat(relatedCiType.relationshipTypeTechnicalName ?? '')
        })

        return {
            neighboursFilter: {
                ciType,
                metaAttributes: { state: ['DRAFT'] },
                relType,
            },
        }
    }

    const defaultSourceRelationshipTabFilter: NeighboursFilterContainerUi | undefined = useMemo(
        (): NeighboursFilterContainerUi => mapFilterToNeighboursContainerUi(relatedCiTypesFilteredForView.cisAsSources),
        [relatedCiTypesFilteredForView],
    )
    const defaultTargetRelationshipTabFilter: NeighboursFilterContainerUi | undefined = useMemo(
        (): NeighboursFilterContainerUi => mapFilterToNeighboursContainerUi(relatedCiTypesFilteredForView.cisAsTargets),
        [relatedCiTypesFilteredForView],
    )

    return {
        isLoading: isRelatedLoading,
        isError: isRelatedError,
        defaultSourceRelationshipTabFilter,
        defaultTargetRelationshipTabFilter,
    }
}

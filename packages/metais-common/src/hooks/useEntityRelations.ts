import { useAuth } from '@/contexts/auth/authContext'
import {
    NeighboursFilterContainerUi,
    ReadCiNeighboursWithAllRelsParams,
    RelatedCiTypePreview,
    RelatedCiTypePreviewList,
    useGetRoleParticipantBulk,
    useListRelatedCiTypes,
    useReadCiNeighboursWithAllRels,
    useReadNeighboursConfigurationItemsCount
} from '@isdd/metais-common/api'
import { useCallback, useMemo } from 'react'

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

const removeDuplicates = (arr: RelatedCiTypePreview[]) => {
    const propertyList = arr.map(({ ciTypeTechnicalName }) => ciTypeTechnicalName);
    const filtered = arr.filter(({ ciTypeTechnicalName }, index) => !propertyList.includes(ciTypeTechnicalName, index + 1));
    return filtered
  }

export const useEntityRelationsTypesCount = (id: string, technicalName: string) => {
    const {
        state: { user },
    } = useAuth()
    const isUserLogged = !!user
    const { isLoading, isError, data: countData } = useReadNeighboursConfigurationItemsCount(id)
    const { isLoading: isRelatedLoading, isError: isRelatedError, data: relatedData } = useListRelatedCiTypes(technicalName)

    const relatedCiTypesFilteredForView = useMemo( (): RelatedCiTypePreviewList => {
        const filteredSources = relatedData?.cisAsSources?.filter((relatedType) => isRelatedCiTypeCmdbView(relatedType, isUserLogged))
        const filteredTargets = relatedData?.cisAsTargets?.filter((relatedType) => isRelatedCiTypeCmdbView(relatedType, isUserLogged))
        const relatedCiTypesFilteredData: RelatedCiTypePreviewList = { cisAsSources: filteredSources, cisAsTargets: filteredTargets }
        return relatedCiTypesFilteredData
    },[relatedData, isUserLogged])

    const allRelationRaw = [...(relatedCiTypesFilteredForView?.cisAsTargets ?? []), ...(relatedCiTypesFilteredForView?.cisAsSources ?? [])]
    const allRelation = removeDuplicates(allRelationRaw)

    const keysToDisplay: IKeyToDisplay[] = allRelation.map((relation) => {      
        const typeName = relation.ciTypeName
        const count = countData?.[relation?.ciTypeTechnicalName ?? ''] ?? 0
        if (typeName)
            return {
                tabName: `${typeName} (${count})`,
                technicalName: relation.ciTypeTechnicalName!,
                count,
            }
        return {
            tabName: '',
            technicalName: '',
            count,
        }
    })?.filter((tab) => tab?.tabName !== '' && tab?.count > 0)

    const keysToDisplaySorted = keysToDisplay.sort((a, b) => (a.count > b.count ? -1 : 1))

    console.log({keysToDisplaySorted})

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

export const useEntityRelationsTypes = (technicalName: string | undefined) => {
    const {
        state: { user },
    } = useAuth()
    const isUserLogged = !!user
    
    if(!!technicalName) {       // mozno zla podmienka
        
        return {    
                neighboursFilter: {
                ciType: undefined,
                metaAttributes: { state: ['DRAFT'] },
                relType: undefined
            }
        }
    }

    console.log(technicalName)

    const { isLoading: isRelatedLoading, isError: isRelatedError, data: relatedData } = useListRelatedCiTypes(technicalName!)

    const relatedCiTypesFilteredForView = useMemo( (): RelatedCiTypePreviewList => {
        const filteredSources = relatedData?.cisAsSources?.filter((relatedType) => isRelatedCiTypeCmdbView(relatedType, isUserLogged))
        const filteredTargets = relatedData?.cisAsTargets?.filter((relatedType) => isRelatedCiTypeCmdbView(relatedType, isUserLogged))
        const relatedCiTypesFilteredData: RelatedCiTypePreviewList = { cisAsSources: filteredSources, cisAsTargets: filteredTargets }
        return relatedCiTypesFilteredData
    },[relatedData, isUserLogged])

    const mapFilterToNeighboursContainerUi = useCallback( (relatedCiTypePreviewArray: RelatedCiTypePreview[] | undefined): NeighboursFilterContainerUi => {
        let ciType: string[] | undefined
        let relType: string[] | undefined
    
        relatedCiTypePreviewArray && relatedCiTypePreviewArray.forEach((relatedCiType) => {
            ciType = ciType?.concat(relatedCiType.ciTypeTechnicalName!)
            relType = relType?.concat(relatedCiType.relationshipTypeName!)
        })
    
        return {    
                neighboursFilter: {
                ciType,
                metaAttributes: { state: ['DRAFT'] },
                relType
            },
        }
    }, [relatedCiTypesFilteredForView])

    const defaultSourceRelationshipTabFilter: NeighboursFilterContainerUi = mapFilterToNeighboursContainerUi(relatedCiTypesFilteredForView.cisAsSources)
    const defaultTargetRelationshipTabFilter: NeighboursFilterContainerUi = mapFilterToNeighboursContainerUi(relatedCiTypesFilteredForView.cisAsTargets)

    console.log({defaultSourceRelationshipTabFilter})
    console.log({defaultTargetRelationshipTabFilter})
    
    return {
        isLoading: isRelatedLoading,
        isError: isRelatedError,
        defaultSourceRelationshipTabFilter,
        defaultTargetRelationshipTabFilter
    }
}
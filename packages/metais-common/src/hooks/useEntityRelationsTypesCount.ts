import { useMemo } from 'react'

import { useReadCiDerivedRelTypesCount, useReadNeighboursConfigurationItemsCount } from '@isdd/metais-common/api'
import { useAuth } from '@isdd/metais-common/contexts/auth/authContext'
import { isDerivedCiTypeCmdbView, isRelatedCiTypeCmdbView, removeDuplicates } from '@isdd/metais-common/hooks/common'
import { RelatedCiTypePreview, useListRelatedCiTypes } from '@isdd/metais-common/api/generated/types-repo-swagger'

export interface IKeyToDisplay {
    tabName: string
    technicalName: string
    count: number
    isDerived: boolean
}

export interface IEntityRelationsTypesCount {
    isLoading: boolean
    isError: boolean
    data: RelatedCiTypePreview[]
    keysToDisplay: IKeyToDisplay[]
}

interface IRelationCount {
    [key: string]: { technicalName: string; count: number; isDerived?: boolean }
}

const DERIVED_PREFIX = 'DERIVED_'

export const useEntityRelationsTypesCount = (id: string, technicalName: string) => {
    const {
        state: { user },
    } = useAuth()
    const isUserLogged = !!user
    const { isLoading, isError, data: countData } = useReadNeighboursConfigurationItemsCount(id)
    const { isLoading: isLoadingDerived, isError: isErrorDerived, data: countDerivedData } = useReadCiDerivedRelTypesCount(id)
    const { isLoading: isRelatedLoading, isError: isRelatedError, data: relatedData } = useListRelatedCiTypes(technicalName)

    const allCounts = useMemo((): IRelationCount | undefined => {
        const formatedDerivedCounts: IRelationCount = {}

        countDerivedData?.derivedRelationshipCounts?.forEach((count) => {
            formatedDerivedCounts[`${DERIVED_PREFIX}${count.technicalName}` ?? ''] = {
                technicalName: count.technicalName ?? '',
                count: count.count ?? 0,
                isDerived: true,
            }
        })

        const formatedCounts: IRelationCount = {}
        for (const key in countData) {
            if (Object.prototype.hasOwnProperty.call(countData, key)) {
                formatedCounts[key] = { technicalName: key, count: countData[key] }
            }
        }

        return { ...formatedDerivedCounts, ...formatedCounts }
    }, [countDerivedData, countData])

    const allRelationTypes = useMemo(() => {
        const filteredSources =
            relatedData?.cisAsSources
                ?.filter((relatedType) => isRelatedCiTypeCmdbView(relatedType, isUserLogged))
                .map((relatedType) => {
                    return { name: relatedType.ciTypeName, technicalName: relatedType.ciTypeTechnicalName, derivedRelation: undefined }
                }) ?? []
        const filteredTargets =
            relatedData?.cisAsTargets
                ?.filter((relatedType) => isRelatedCiTypeCmdbView(relatedType, isUserLogged))
                .map((relatedType) => {
                    return { name: relatedType.ciTypeName, technicalName: relatedType.ciTypeTechnicalName, derivedRelation: undefined }
                }) ?? []
        const filteredDerivedSources =
            relatedData?.derivedCisAsSources
                ?.filter((derivedType) => isDerivedCiTypeCmdbView(derivedType, isUserLogged))
                .map((derivedType, index) => {
                    return {
                        name: relatedData.derivedCisAsTargets ? relatedData.derivedCisAsTargets[index].ciType?.name : '',
                        technicalName: relatedData.derivedCisAsTargets ? relatedData.derivedCisAsTargets[index].ciType?.technicalName : '',
                        derivedRelation: derivedType.technicalName,
                    }
                }) ?? []

        return removeDuplicates([...filteredSources, ...filteredTargets, ...filteredDerivedSources], 'technicalName')
    }, [relatedData, isUserLogged])

    const keysToDisplay = allRelationTypes
        .map((relation) => {
            if (Object.prototype.hasOwnProperty.call(allCounts, relation.technicalName ?? '')) {
                const typeName = relation.name
                const count = allCounts?.[relation?.technicalName ?? ''].count ?? 0
                return {
                    tabName: `${typeName ?? ''} (${count})`,
                    technicalName: relation.technicalName ?? '',
                    count: count,
                    isDerived: false,
                }
            }
            if (Object.prototype.hasOwnProperty.call(allCounts, `${DERIVED_PREFIX}${relation.technicalName}`)) {
                const typeName = relation.name
                const count = allCounts?.[`${DERIVED_PREFIX}${relation.technicalName}`].count ?? 0
                return {
                    tabName: `${typeName ?? ''} (${count})`,
                    technicalName: relation.derivedRelation ?? '',
                    count: count,
                    isDerived: true,
                }
            }
            return {
                tabName: '',
                technicalName: '',
                count: 0,
                isDerived: false,
            }
        })
        ?.filter((tab) => (tab?.tabName !== '' && tab?.count) ?? 0 > 0)

    const keysToDisplaySorted = keysToDisplay.sort((a, b) => (a.count > b.count ? -1 : 1))

    return {
        isLoading: isLoading || isRelatedLoading || isLoadingDerived,
        isError: isError || isRelatedError || isErrorDerived,
        keysToDisplay: keysToDisplaySorted,
    }
}

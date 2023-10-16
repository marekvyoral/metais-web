import { CiType, ConfigurationItemUi, useReadCiList1 } from '@isdd/metais-common/api'

type AttributeTechnicalName = string
type CiTypeConstraintTechnicalName = string
type CiUuid = string
type CiItemUuid = string

export type CiConstraintType = {
    ciType: string
    type: string
}

export const isConstraintCiType = (obj: unknown): obj is CiConstraintType => {
    return (
        typeof obj === 'object' &&
        obj !== null &&
        'ciType' in obj &&
        typeof (obj as CiConstraintType).ciType === 'string' &&
        'type' in obj &&
        typeof (obj as CiConstraintType).type === 'string'
    )
}

const isObjectEmpty = (obj: { [key: string]: unknown }): boolean => {
    for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) return false
    }
    return true
}

const isObject = (value: unknown): value is { [key: string]: unknown } => {
    return value !== null && typeof value === 'object'
}

const hasMeaningfulValue = (value: unknown): boolean => {
    if (value === null || value === undefined || value === false || value === 0 || value === '' || Number.isNaN(value)) {
        return false
    }
    if (Array.isArray(value) && value.length === 0) {
        return false
    }
    if (isObject(value) && value.constructor === Object && isObjectEmpty(value)) {
        return false
    }
    return true
}

const getCiTypesFromConstraints = (entityStructure: CiType | undefined): Record<AttributeTechnicalName, CiTypeConstraintTechnicalName> => {
    if (!entityStructure) return {}
    const { attributes, attributeProfiles } = entityStructure

    const ciTypesFromConstraints = [...(attributes ?? []), ...(attributeProfiles?.map((profile) => profile.attributes).flat() ?? [])]
        .filter((att) => att?.constraints?.[0]?.type === 'ciType')
        .reduce((acc: Record<AttributeTechnicalName, CiTypeConstraintTechnicalName>, att) => {
            if (isConstraintCiType(att?.constraints?.[0])) {
                return { ...acc, [att?.technicalName ?? '']: att?.constraints?.[0]?.ciType ?? '' }
            }
            return acc
        }, {})

    return ciTypesFromConstraints
}

export const useGetCiTypeConstraintsData = (entityStructure: CiType | undefined, ciItemsList: ConfigurationItemUi[]) => {
    const ciTypesFromConstraints = getCiTypesFromConstraints(entityStructure)

    const recordOfCiConstraintUuidAndAttTechnicalName = ciItemsList.reduce(
        (acc: Record<CiItemUuid, Record<AttributeTechnicalName, CiUuid>>, ciItem) => {
            const pairsOfAttTechNameAndCiUuid = Object.keys(ciTypesFromConstraints).reduce(
                (obj: Record<AttributeTechnicalName, CiUuid>, technicalName) => {
                    if (ciItem?.attributes?.[technicalName] && hasMeaningfulValue(ciItem.attributes?.[technicalName])) {
                        return { ...obj, [technicalName]: ciItem.attributes?.[technicalName] }
                    }
                    return obj
                },
                {},
            )
            if (!isObjectEmpty(pairsOfAttTechNameAndCiUuid)) {
                return { ...acc, [ciItem.uuid ?? '']: pairsOfAttTechNameAndCiUuid }
            }
            return acc
        },
        {},
    )

    const listOfAllCiUuidsToSearch = Object.values(recordOfCiConstraintUuidAndAttTechnicalName)
        .map((pair) => Object.values(pair))
        .flat()

    const { data, isLoading, isError, fetchStatus } = useReadCiList1(
        {
            filter: {
                type: [...new Set(Object.values(ciTypesFromConstraints))],
                uuid: [...new Set(listOfAllCiUuidsToSearch)],
            },
            perpage: 999,
        },
        { query: { enabled: listOfAllCiUuidsToSearch.length > 0 } },
    )

    const uuidsToMatchedCiItemsMap: Record<string, Record<string, ConfigurationItemUi>> = {}
    for (const displayedCiItemUuid in recordOfCiConstraintUuidAndAttTechnicalName) {
        const currentUuidMap: Record<string, ConfigurationItemUi> = {}
        for (const techName in recordOfCiConstraintUuidAndAttTechnicalName[displayedCiItemUuid]) {
            const matchedCiItemByUuid = data?.configurationItemSet?.find(
                (item) => item.uuid === recordOfCiConstraintUuidAndAttTechnicalName[displayedCiItemUuid][techName],
            )
            if (matchedCiItemByUuid) {
                currentUuidMap[techName] = matchedCiItemByUuid
            }
        }
        uuidsToMatchedCiItemsMap[displayedCiItemUuid] = currentUuidMap
    }

    return {
        isLoading: fetchStatus != 'idle' && isLoading,
        isError,
        uuidsToMatchedCiItemsMap,
    }
}

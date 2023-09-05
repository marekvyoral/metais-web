import { IFilter } from '@isdd/idsk-ui-kit/types'
import { FieldValues } from 'react-hook-form'

import {
    BASE_PAGE_NUMBER,
    BASE_PAGE_SIZE,
    Category,
    CiListFilterContainerUi,
    ConfigurationItemUi,
    EnumType,
    FilterAttributesUi,
    ListReportParams,
    Parameter,
    ReadAllCiHistoryVersionsParams,
    ReadCiNeighboursWithAllRelsParams,
    ReportExecute,
} from '@isdd/metais-common/api'
import { IFilterParams, OPERATOR_OPTIONS } from '@isdd/metais-common/hooks/useFilter'

export const mapFilterToNeighborsApi = <T>(filter: IFilter, defaultApiFilter?: { [filterName: string]: T } | T): CiListFilterContainerUi => {
    const { pageNumber, pageSize, sort } = filter
    return {
        ...defaultApiFilter,
        page: pageNumber,
        perpage: pageSize,
        sortBy: sort?.[0]?.orderBy ?? '',
        sortType: sort?.[0]?.sortDirection,
    }
}

export const mapFilterToHistoryVersionsApi = (filter: IFilter): ReadAllCiHistoryVersionsParams => {
    const { pageNumber, pageSize } = filter
    return {
        page: pageNumber ?? BASE_PAGE_NUMBER,
        perPage: pageSize ?? BASE_PAGE_SIZE,
    }
}

export const mapFilterToNeighboursWithAllRelsApi = (
    originalFilter: ReadCiNeighboursWithAllRelsParams,
    filterChanges: IFilter,
): ReadCiNeighboursWithAllRelsParams => {
    const { pageNumber, pageSize } = filterChanges

    return {
        ...originalFilter,
        page: pageNumber ?? originalFilter.page,
        perPage: pageSize ?? originalFilter.perPage,
    }
}

export const mapFilterToReportsParams = (filterParams: FieldValues & IFilterParams & IFilter): ListReportParams => {
    const { pageNumber, pageSize, sort } = filterParams
    return {
        page: pageNumber ?? BASE_PAGE_NUMBER,
        perPage: pageSize ?? BASE_PAGE_SIZE,
        sortBy: sort?.map((s) => s.orderBy) ?? [],
        published: true,
        ascending: true,
        ...(filterParams?.category && { category: filterParams?.category }),
        ...(filterParams.fullTextSearch && { fulltext: filterParams.fullTextSearch }),
    }
}

export const mapFilterToExecuteParams = (
    filterParams: FieldValues & IFilterParams & IFilter,
    parameterMetaData?: Parameter[],
    enumsData?: (EnumType | undefined)[],
): ReportExecute => {
    const { pageNumber, pageSize } = filterParams

    const parameterKeyValuePairs = parameterMetaData
        ?.map((pMD) => {
            const key = pMD.key
            if (key && filterParams[key]) {
                if (pMD.type === 'ENUMS_REPO') {
                    const enumValues = enumsData?.find((eD) => eD?.code === pMD?.metaData)
                    const enumValue = enumValues?.enumItems?.find((eI) => eI.code === filterParams[key])
                    return [key, enumValue]
                }
                return [key, filterParams[key]]
            } else return []
        })
        .filter(Boolean)
    const parametersObject = Object.fromEntries(parameterKeyValuePairs ?? [])
    return {
        page: pageNumber ?? BASE_PAGE_NUMBER,
        perPage: pageSize ?? BASE_PAGE_SIZE,
        parameters: { ...parametersObject },
    }
}

export const mapCategoriesToOptions = (categories?: Category[]) => {
    return [
        ...(categories?.map((c) => {
            return {
                label: c?.name ?? '',
                value: (c?.id ?? '').toString(),
            }
        }) ?? []),
    ]
}

export const mapReportsCiItemToOptions = (ciSet?: ConfigurationItemUi[]) => {
    return [
        ...(ciSet?.map((ci) => {
            const address1 = [ci?.attributes?.EA_Profil_PO_ulica, ci?.attributes?.EA_Profil_PO_cislo]?.filter(Boolean)?.join(' ')
            const address2 = [ci?.attributes?.EA_Profil_PO_psc, ci?.attributes?.EA_Profil_PO_obec]?.filter(Boolean)?.join(' ')
            const address = [address1, address2]?.filter(Boolean)?.join(', ')
            return {
                label: (ci?.attributes?.Gen_Profil_nazov ?? '') as string,
                subLabel: address,
                value: (ci?.uuid ?? '') as string,
            }
        }) ?? []),
    ]
}

export enum FILTER_KEY {
    fullTextSearch = 'fullTextSearch',
    attributeFilters = 'attributeFilters',
    sort = 'sort',
    pageSize = 'pageSize',
    pageNumber = 'pageNumber',
}

//maps static inputs in <Filter> to their correct format needed for cilistfiltered filter
export const mapFilterParamsToApi = <T extends IFilterParams>(
    filterParams: T,
    defaultFilterOperators?: { [key: string]: string },
): FilterAttributesUi[] => {
    const attributes: FilterAttributesUi[] = []
    const keysToSkip = new Set<string>([
        FILTER_KEY.fullTextSearch,
        FILTER_KEY.attributeFilters,
        FILTER_KEY.sort,
        FILTER_KEY.pageSize,
        FILTER_KEY.pageNumber,
    ])

    for (const [key, value] of Object.entries(filterParams)) {
        if (keysToSkip.has(key)) continue
        if (value) {
            if (Array.isArray(value) && value.length < 1) continue
            const defaultOperator = defaultFilterOperators?.[key]

            if (Array.isArray(value)) {
                attributes.push({
                    name: key,
                    filterValue: value.map((val) => ({
                        value: val,
                        equality: defaultOperator ? defaultOperator : OPERATOR_OPTIONS.EQUAL,
                    })),
                })
            } else if (value === 'false' || value === 'true') {
                attributes.push({
                    name: key,
                    filterValue: [
                        {
                            value: value,
                            equality: defaultOperator ? defaultOperator : OPERATOR_OPTIONS.EQUAL,
                        },
                    ],
                })
            } else {
                attributes.push({
                    name: key,
                    filterValue: [
                        {
                            value: value,
                            equality: defaultOperator ? defaultOperator : OPERATOR_OPTIONS.FULLTEXT,
                        },
                    ],
                })
            }
        }
    }

    for (const [key, attrs] of Object.entries(filterParams?.attributeFilters || {})) {
        if (!key) continue

        const combinedAttrs: FilterAttributesUi = {
            name: key,
            filterValue: attrs.filter((attr) => attr.value && attr.operator).map((attr) => ({ value: attr.value, equality: attr.operator })),
        }
        if (combinedAttrs.filterValue && combinedAttrs.filterValue.length > 0) {
            attributes.push(combinedAttrs)
        }
    }

    return attributes
}

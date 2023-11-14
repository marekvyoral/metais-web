import { IFilter } from '@isdd/idsk-ui-kit/types'
import { FieldValues } from 'react-hook-form'

import { transformOperatorsFromUrl } from './transformOperators'

import { MetainformationColumns } from '@isdd/metais-common/componentHelpers/ci/getCiDefaultMetaAttributes'
import { formatDateForDefaultValue } from '@isdd/metais-common/componentHelpers/formatting'
import { BASE_PAGE_NUMBER, BASE_PAGE_SIZE } from '@isdd/metais-common/api/constants'
import { EnumType } from '@isdd/metais-common/api/generated/enums-repo-swagger'
import {
    CiListFilterContainerUi,
    ConfigurationItemUi,
    FilterAttributesUi,
    FilterMetaAttributesUi,
    ReadAllCiHistoryVersionsParams,
    ReadCiNeighboursWithAllRelsParams,
} from '@isdd/metais-common/api/generated/cmdb-swagger'
import { Category, ListReportParams, Parameter, ReportExecute } from '@isdd/metais-common/api/generated/report-swagger'
import { IAttributeFilters, IFilterParams, OPERATOR_OPTIONS, OPERATOR_OPTIONS_URL } from '@isdd/metais-common/hooks/useFilter'
import { FilterAttribute } from '@isdd/metais-common/components/dynamicFilterAttributes/DynamicFilterAttributes'
import { JOIN_OPERATOR } from '@isdd/metais-common/constants'
import { AttributeConstraintEnum, AttributeConstraintsItem } from '@isdd/metais-common/api/generated/types-repo-swagger'

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

export const mapFilterToReportsParamsAdmin = (filterParams: FieldValues & IFilterParams & IFilter): ListReportParams => {
    const { pageNumber, pageSize, sort } = filterParams
    return {
        page: pageNumber ?? BASE_PAGE_NUMBER,
        perPage: pageSize ?? BASE_PAGE_SIZE,
        sortBy: sort?.map((s) => s.orderBy) ?? ['name'],
        ascending: true,
        showAllLanguages: true,
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
    metaAttributeFilters = 'metaAttributeFilters',
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
        FILTER_KEY.metaAttributeFilters,
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

export enum FilterMetaAttributesUiKeys {
    owner = 'owner',
    liableEntity = 'liableEntity',
    liableEntityByHierarchy = 'liableEntityByHierarchy',
    lastAction = 'lastAction',
    state = 'state',
    createdBy = 'createdBy',
    createdAtFrom = 'createdAtFrom',
    createdAtTo = 'createdAtTo',
    lastModifiedBy = 'lastModifiedBy',
    lastModifiedAtFrom = 'lastModifiedAtFrom',
    lastModifiedAtTo = 'lastModifiedAtTo',
}

export const formatMetaAttributesToFilterAttributeType = (metaAttributeFiltersData: FilterMetaAttributesUi): FilterAttribute[] => {
    const formattedMetaAttributes: FilterAttribute[] = []
    for (const key in metaAttributeFiltersData) {
        switch (key) {
            case FilterMetaAttributesUiKeys.lastModifiedAtTo: {
                const filterAttribute: FilterAttribute = {
                    name: MetainformationColumns.LAST_MODIFIED_AT,
                    operator: OPERATOR_OPTIONS_URL.LOWER,
                    value: formatDateForDefaultValue(metaAttributeFiltersData[key] ?? ''),
                }
                formattedMetaAttributes.push(filterAttribute)
                break
            }
            case FilterMetaAttributesUiKeys.lastModifiedAtFrom: {
                const filterAttribute: FilterAttribute = {
                    name: MetainformationColumns.LAST_MODIFIED_AT,
                    operator: OPERATOR_OPTIONS_URL.GREATER,
                    value: formatDateForDefaultValue(metaAttributeFiltersData[key] ?? ''),
                }
                formattedMetaAttributes.push(filterAttribute)
                break
            }
            case FilterMetaAttributesUiKeys.createdAtTo: {
                const filterAttribute: FilterAttribute = {
                    name: MetainformationColumns.CREATED_AT,
                    operator: OPERATOR_OPTIONS_URL.LOWER,
                    value: formatDateForDefaultValue(metaAttributeFiltersData[key] ?? ''),
                }
                formattedMetaAttributes.push(filterAttribute)
                break
            }
            case FilterMetaAttributesUiKeys.createdAtFrom: {
                const filterAttribute: FilterAttribute = {
                    name: MetainformationColumns.CREATED_AT,
                    operator: OPERATOR_OPTIONS_URL.GREATER,
                    value: formatDateForDefaultValue(metaAttributeFiltersData[key] ?? ''),
                }
                formattedMetaAttributes.push(filterAttribute)
                break
            }
            case FilterMetaAttributesUiKeys.state: {
                const filterAttribute: FilterAttribute = {
                    name: MetainformationColumns.STATE,
                    operator: OPERATOR_OPTIONS_URL.FULLTEXT,
                    value: metaAttributeFiltersData[key],
                }
                formattedMetaAttributes.push(filterAttribute)
                break
            }
            case FilterMetaAttributesUiKeys.liableEntity: {
                const filterAttribute: FilterAttribute = {
                    name: MetainformationColumns.OWNER,
                    operator: OPERATOR_OPTIONS_URL.FULLTEXT,
                    value: metaAttributeFiltersData[key],
                }
                formattedMetaAttributes.push(filterAttribute)
                break
            }
        }
    }

    return formattedMetaAttributes
}

export const formatAttributeFiltersToFilterAttributeType = (attributeFiltersData: IAttributeFilters): FilterAttribute[] => {
    const formattedAttributeFilters: FilterAttribute[] = []

    for (const [technicalName, attributeFilterValue] of Object.entries(attributeFiltersData)) {
        if (attributeFilterValue.length > 1) {
            const values = attributeFilterValue.map((attr) => attr.value as string)
            const operators = attributeFilterValue.map((attr) => attr.operator)
            const uniqueOperators = [...new Set(operators)]

            //this means it is multiSelect
            if (uniqueOperators.length > 1) {
                uniqueOperators.forEach((operator, index) => {
                    formattedAttributeFilters.push({ name: technicalName, operator: transformOperatorsFromUrl(operator), value: values[index] })
                })
            } else {
                formattedAttributeFilters.push({ name: technicalName, operator: transformOperatorsFromUrl(operators[0]), value: values })
            }
        } else {
            attributeFilterValue.forEach((attr) => {
                formattedAttributeFilters.push({ name: technicalName, operator: transformOperatorsFromUrl(attr.operator), value: attr.value })
            })
        }
    }

    return formattedAttributeFilters
}

export const mapMetaAttributeFromUrlToFitFilter = (
    name: string,
    operator: string,
    value: string,
): {
    metaAttributeName: FilterMetaAttributesUiKeys | undefined
    metaAttributeValue: string | string[] | undefined
} => {
    if (name === MetainformationColumns.CREATED_AT) {
        if (operator == OPERATOR_OPTIONS_URL.LOWER) {
            return { metaAttributeName: FilterMetaAttributesUiKeys.createdAtTo, metaAttributeValue: new Date(value).toISOString() }
        } else if (operator == OPERATOR_OPTIONS_URL.GREATER) {
            return { metaAttributeName: FilterMetaAttributesUiKeys.createdAtFrom, metaAttributeValue: new Date(value).toISOString() }
        }
    }

    if (name === MetainformationColumns.LAST_MODIFIED_AT) {
        if (operator == OPERATOR_OPTIONS_URL.LOWER) {
            return { metaAttributeName: FilterMetaAttributesUiKeys.lastModifiedAtTo, metaAttributeValue: new Date(value).toISOString() }
        } else if (operator == OPERATOR_OPTIONS_URL.GREATER) {
            return { metaAttributeName: FilterMetaAttributesUiKeys.lastModifiedAtFrom, metaAttributeValue: new Date(value).toISOString() }
        }
    }

    if (name === MetainformationColumns.OWNER) {
        return { metaAttributeName: FilterMetaAttributesUiKeys.liableEntity, metaAttributeValue: value.split(JOIN_OPERATOR) }
    }

    if (name === MetainformationColumns.STATE) {
        return { metaAttributeName: FilterMetaAttributesUiKeys.state, metaAttributeValue: value.split(JOIN_OPERATOR) }
    }

    return { metaAttributeName: undefined, metaAttributeValue: undefined }
}

export const isMatchWithMetaAttributeTechnicalName = (technicalName: string) => {
    return [
        MetainformationColumns.OWNER,
        MetainformationColumns.STATE,
        MetainformationColumns.LAST_MODIFIED_AT,
        MetainformationColumns.CREATED_AT,
    ].some((metaAttributeName) => metaAttributeName === technicalName)
}

export const hasCiType = (
    constraint: AttributeConstraintsItem | AttributeConstraintEnum,
): constraint is AttributeConstraintsItem & { ciType: string } => {
    return 'ciType' in constraint && typeof constraint['ciType'] === 'string'
}

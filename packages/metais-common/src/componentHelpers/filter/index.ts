import { FilterAttributesUi } from '@isdd/metais-common/api'
import { IFilterParams, OPERATOR_OPTIONS } from '@isdd/metais-common/hooks/useFilter'

export enum FILTER_KEY {
    fullTextSearch = 'fullTextSearch',
    attributeFilters = 'attributeFilters',
    sort = 'sort',
    pageSize = 'pageSize',
    pageNumber = 'pageNumber',
}

export const mapFilterParamsToApi = <T extends IFilterParams>(filterParams: T): FilterAttributesUi[] => {
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
            if (Array.isArray(value)) {
                attributes.push({
                    name: key,
                    filterValue: value.map((val) => ({
                        value: val,
                        equality: OPERATOR_OPTIONS.EQUAL,
                    })),
                })
            } else if (value === 'false' || value === 'true') {
                attributes.push({
                    name: key,
                    filterValue: [
                        {
                            value: value,
                            equality: OPERATOR_OPTIONS.EQUAL,
                        },
                    ],
                })
            } else {
                attributes.push({
                    name: key,
                    filterValue: [
                        {
                            value,
                            equality: OPERATOR_OPTIONS.FULLTEXT,
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

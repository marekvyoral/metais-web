import { FilterAttribute } from '@isdd/metais-common/components/dynamicFilterAttributes/DynamicFilterAttributes'

export const filterAttributesBasedOnIgnoreList = (filterAttributes: FilterAttribute[], ignoreListOfNames: string[]): FilterAttribute[] => {
    return filterAttributes.filter((item) => !ignoreListOfNames?.includes(item.name ?? ''))
}

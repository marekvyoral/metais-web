import { IFilter } from '@isdd/idsk-ui-kit/src/types'

import { FILTER_LOCAL_STORAGE_KEY } from '@isdd/metais-common/constants'

export const updateFilterInLocalStorageOnChange = (changedFilter: IFilter, currentLocation: string) => {
    const currentFilterKey = FILTER_LOCAL_STORAGE_KEY + currentLocation
    const storedFilter = localStorage.getItem(currentFilterKey)
    if (storedFilter) {
        const parsedStoredFilter = JSON.parse(storedFilter)
        for (const key in changedFilter) {
            if (key === 'sort') {
                parsedStoredFilter['orderBy'] = changedFilter[key]?.[0]?.orderBy
                parsedStoredFilter['sortDirection'] = changedFilter[key]?.[0]?.sortDirection
            } else {
                parsedStoredFilter[key] = changedFilter[key]
            }
        }
        localStorage.setItem(currentFilterKey, JSON.stringify(parsedStoredFilter))
    }
    return
}

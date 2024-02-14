import { ENTITY_ISVS, ENTITY_PROJECT } from '@isdd/metais-common/constants'
import { IKeyToDisplay } from '@isdd/metais-common/hooks/useEntityRelationsTypesCount'

type CompareRelationsFnType = (a: IKeyToDisplay, b: IKeyToDisplay) => number

interface IRelationSorterConfig {
    default: CompareRelationsFnType
    [key: string]: CompareRelationsFnType
}

const relationSorterConfig: IRelationSorterConfig = {
    [ENTITY_PROJECT]: (a, b) => {
        if (a.count === b.count && a.technicalName === ENTITY_ISVS) {
            return -1
        }
        return a.count > b.count ? -1 : 1
    },
    default: (a, b) => (a.count > b.count ? -1 : 1),
}

export const getRelationsSorter = (technicalName: string): CompareRelationsFnType => {
    return relationSorterConfig[technicalName] ? relationSorterConfig[technicalName] : relationSorterConfig.default
}

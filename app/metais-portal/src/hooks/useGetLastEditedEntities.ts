import { SortBy, SortType } from '@isdd/idsk-ui-kit/types'
import { useReadCiList1 } from '@isdd/metais-common/api/generated/cmdb-swagger'
import { useListCiTypes } from '@isdd/metais-common/api/generated/types-repo-swagger'
import {
    DRAFT,
    ENTITY_ACTIVITY,
    ENTITY_AGENDA,
    ENTITY_AS,
    ENTITY_CIEL,
    ENTITY_INFRA_SLUZBA,
    ENTITY_ISVS,
    ENTITY_KRIS,
    ENTITY_KS,
    ENTITY_OSOBITNY_POSTUP,
    ENTITY_PRINCIP,
    ENTITY_TRAINING,
    PO,
    PROGRAM,
    PROJECT,
    WEBOVE_SIDLO,
} from '@isdd/metais-common/constants'

export const useGetLastEditedEntities = (count: number) => {
    const { data, isLoading, isError } = useReadCiList1(
        {
            filter: {
                type: [
                    ENTITY_KRIS,
                    ENTITY_CIEL,
                    ENTITY_PRINCIP,
                    PROGRAM,
                    PROJECT,
                    ENTITY_ACTIVITY,
                    PO,
                    ENTITY_AS,
                    ENTITY_KS,
                    ENTITY_ISVS,
                    ENTITY_INFRA_SLUZBA,
                    WEBOVE_SIDLO,
                    ENTITY_TRAINING,
                    ENTITY_OSOBITNY_POSTUP,
                    ENTITY_AGENDA,
                ],
                metaAttributes: {
                    state: [DRAFT],
                },
            },
            page: 1,
            perpage: count,
            sortBy: SortBy.LAST_MODIFIED_AT,
            sortType: SortType.DESC,
        },
        { query: { refetchOnMount: 'always' } },
    )

    const {
        data: ciTypes,
        isLoading: isCiTypesLoading,
        isError: isCiTypesError,
    } = useListCiTypes({
        filter: {},
    })

    return {
        data,
        ciTypes,
        isLoading: isLoading || isCiTypesLoading,
        isError: isError || isCiTypesError,
    }
}

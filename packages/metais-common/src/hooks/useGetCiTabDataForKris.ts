import { useMemo } from 'react'

import { CiListFilterContainerUi, useReadCiList1 } from '@isdd/metais-common/api/generated/cmdb-swagger'
import { UserPreferencesFormNamesEnum, useUserPreferences } from '@isdd/metais-common/contexts/userPreferences/userPreferencesContext'
import { ENTITY_ISVS, ENTITY_KS, ENTITY_PROJECT, BASE_PAGE_NUMBER, BASE_PAGE_SIZE } from '@isdd/metais-common/constants'

export const useGetCiTabDataForKris = (neighboursUuid: string) => {
    const { currentPreferences } = useUserPreferences()

    const showInvalidated = currentPreferences?.[UserPreferencesFormNamesEnum.SHOW_INVALIDATED] ?? false

    const ciListFilter: CiListFilterContainerUi = useMemo(() => {
        return {
            filter: {
                metaAttributes: {
                    liableEntity: [neighboursUuid],
                    liableEntityByHierarchy: true,
                    state: showInvalidated ? ['DRAFT', 'INVALIDATED'] : ['DRAFT'],
                },
            },
            page: BASE_PAGE_NUMBER,
            perpage: BASE_PAGE_SIZE,
        }
    }, [neighboursUuid, showInvalidated])

    const {
        data: ISVSListData,
        isLoading: isISVSListLoading,
        isError: isISVSListError,
        fetchStatus: ISVSListFetchStatus,
    } = useReadCiList1({ ...ciListFilter, filter: { ...ciListFilter.filter, type: [ENTITY_ISVS] } }, { query: { enabled: !!neighboursUuid } })

    const {
        data: projectListData,
        isLoading: isProjectListLoading,
        isError: isProjectListError,
        fetchStatus: projectListFetchStatus,
    } = useReadCiList1({ ...ciListFilter, filter: { ...ciListFilter.filter, type: [ENTITY_PROJECT] } }, { query: { enabled: !!neighboursUuid } })

    const {
        data: KSListData,
        isLoading: isKSListLoading,
        isError: isKSListError,
        fetchStatus: KSListFetchStatus,
    } = useReadCiList1({ ...ciListFilter, filter: { ...ciListFilter.filter, type: [ENTITY_KS] } }, { query: { enabled: !!neighboursUuid } })

    const isLoading =
        (isISVSListLoading && ISVSListFetchStatus != 'idle') ||
        (isKSListLoading && KSListFetchStatus != 'idle') ||
        (isProjectListLoading && projectListFetchStatus != 'idle')
    const isError = isISVSListError || isKSListError || isProjectListError

    return {
        ISVSListData,
        projectListData,
        KSListData,
        isLoading,
        isError,
    }
}

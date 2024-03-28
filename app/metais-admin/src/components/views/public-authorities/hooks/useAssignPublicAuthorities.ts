import {
    ConfigurationItemUi,
    useReadCiList1,
    useReadPoSuperiorPoRelationshipHook,
    useReadRelationships,
    useStoreGraph,
} from '@isdd/metais-common/api/generated/cmdb-swagger'
import {
    useFindEaGarpoAdminHook,
    useGenerateUuidsHook,
    useGetPoRelationshipIntegrityConstraints,
} from '@isdd/metais-common/api/generated/iam-swagger'
import { useFilterForCiList, usePagination } from '@isdd/metais-common/api/hooks/containers/containerHelpers'
import { mapFilterParamsToApi } from '@isdd/metais-common/componentHelpers/filter'
import { IFilterParams } from '@isdd/metais-common/hooks/useFilter'
import { FieldValues } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useUserPreferences } from '@isdd/metais-common/contexts/userPreferences/userPreferencesContext'
import { useInvalidateCiListFilteredCache } from '@isdd/metais-common/hooks/invalidate-cache'
import { useGetStatus } from '@isdd/metais-common/hooks/useGetRequestStatus'
import { useActionSuccess } from '@isdd/metais-common/contexts/actionSuccess/actionSuccessContext'
import { AdminRouteNames } from '@isdd/metais-common/navigation/routeNames'
import { useEffect } from 'react'

import { calcBlockedPublicAuthorities, isCiAlreadyAssigned } from '@/components/views/public-authorities/helpers/formatting'

interface iUseAssignPublicAuthorities<T> {
    entityId: string
    entityName: string
    orgIco: string
    defaultFilterValues: T
    defaultFilterOperators?: T
}

export const useAssignPublicAuthorities = <T extends FieldValues & IFilterParams>({
    entityId,
    entityName,
    orgIco,
    defaultFilterValues,
    defaultFilterOperators,
}: iUseAssignPublicAuthorities<T>) => {
    const { t } = useTranslation()

    const { getRequestStatus, isLoading: isStatusLoading, isError: isStatusError, isProcessedError, isTooManyFetchesError } = useGetStatus()
    const { setIsActionSuccess } = useActionSuccess()

    const invalidatePODetail = useInvalidateCiListFilteredCache()

    const getGarpoAdmin = useFindEaGarpoAdminHook()

    const { data: relData, isLoading: relIsLoading, isError: relIsError } = useReadRelationships(entityId)
    const generateUUID = useGenerateUuidsHook()
    const getSuperiorPoRelationShip = useReadPoSuperiorPoRelationshipHook()
    const { mutateAsync: storeGraph, isLoading: isGraphLoading } = useStoreGraph({
        mutation: {
            onSuccess() {
                invalidatePODetail.invalidate({ ciUuid: entityId })
            },
            onError() {
                setIsActionSuccess({
                    value: false,
                    path: `${AdminRouteNames.PUBLIC_AUTHORITIES}/${entityId}/assigned`,
                    additionalInfo: { type: 'error' },
                })
            },
        },
    })
    const idsToFind =
        relData?.endRelationshipSet
            ?.filter((relationship) => relationship?.metaAttributes?.state !== 'INVALIDATED')
            ?.map((val) => val?.startUuid ?? '') ?? []

    const { currentPreferences } = useUserPreferences()

    const metaAttributes = currentPreferences.showInvalidatedItems
        ? { state: ['DRAFT', 'AWAITING_APPROVAL', 'APPROVED_BY_OWNER', 'INVALIDATED'] }
        : { state: ['DRAFT', 'AWAITING_APPROVAL', 'APPROVED_BY_OWNER'] }

    // ALL DATA Related to IDS
    const defaultRequestApi = {
        perpage: 9999,
        page: 1,
        filter: {
            type: ['PO'],
            uuid: idsToFind,
            metaAttributes,
        },
    }
    const {
        data: ciData,
        isError: ciIsError,
        isFetching,
    } = useReadCiList1(
        {
            ...defaultRequestApi,
        },
        { query: { enabled: !relIsLoading && idsToFind?.length > 0 } },
    )

    // PAGINATED DATA
    const defaultRequestApiTableData = {
        filter: {
            type: [entityName],
            metaAttributes: {
                state: ['DRAFT', 'AWAITING_APPROVAL', 'APPROVED_BY_OWNER'],
            },
            poUuid: undefined,
        },
    }

    const { filterToNeighborsApi, filterParams, handleFilterChange } = useFilterForCiList(defaultFilterValues, defaultRequestApiTableData)

    const { data: tableData } = useReadCiList1({
        ...filterToNeighborsApi,
        filter: {
            ...filterToNeighborsApi.filter,
            poUuid: filterParams.onlyFreePO ? undefined : entityId,
            fullTextSearch: filterParams.fullTextSearch || '',
            attributes: mapFilterParamsToApi(filterParams, defaultFilterOperators),
        },
    })
    const pagination = usePagination(tableData, filterParams)

    // INTEGRITY CONSTRAINTS
    const poRelationships =
        tableData?.configurationItemSet?.map((v) => ({
            cmdbId: entityId,
            subCmdbId: v?.uuid,
        })) ?? []

    const { data: integrityData } = useGetPoRelationshipIntegrityConstraints(poRelationships, {
        query: { enabled: filterParams.onlyFreePO ? false : true },
    })

    const handleSave = async (selectedValues: ConfigurationItemUi[]) => {
        const garpoAdminData = await getGarpoAdmin()
        const superiorData = await getSuperiorPoRelationShip({ uuids: selectedValues?.map((ciItem) => ciItem?.uuid ?? '') ?? [] })
        const uuid = await generateUUID(selectedValues?.length)

        const relSet = Object.values(superiorData ?? {})

        storeGraph({
            data: {
                invalidateSet: {
                    relationshipSet: relSet,
                },
                storeSet: {
                    relationshipSet: selectedValues?.map((selectedPO, index) => {
                        return {
                            attributes: [],
                            startUuid: selectedPO?.uuid,
                            owner: garpoAdminData.gid,
                            type: 'PO_je_podriadenou_PO',
                            uuid: uuid?.[index],
                            endUuid: isCiAlreadyAssigned(selectedPO?.uuid, ciData?.configurationItemSet) ? garpoAdminData?.orgId : entityId,
                        }
                    }),
                },
            },
        }).then((res) => {
            getRequestStatus(res.requestId ?? '', () => {
                setIsActionSuccess({ value: true, path: `${AdminRouteNames.PUBLIC_AUTHORITIES}/${entityId}/assigned` })
            })
        })
    }

    const tableDataWithBlockAttribute = calcBlockedPublicAuthorities(tableData, integrityData, filterParams.onlyFreePO, entityId, orgIco, t)

    const isLoading = [relIsLoading, isFetching, isStatusLoading, isGraphLoading].some((item) => item)
    const isError = [relIsError, ciIsError, isProcessedError, isStatusError, isTooManyFetchesError, isProcessedError].some((item) => item)

    useEffect(() => {
        if (isError) {
            setIsActionSuccess({
                value: false,
                path: `${AdminRouteNames.PUBLIC_AUTHORITIES}/${entityId}/assigned`,
                additionalInfo: { type: 'error' },
            })
        }
    }, [entityId, isError, setIsActionSuccess])

    return {
        handleSave,
        tableDataWithBlockAttribute,
        isLoading,
        isError,
        sort: filterParams?.sort ?? [],
        pagination,
        handleFilterChange,
        allOrganizations: ciData?.configurationItemSet ?? [],
    }
}

import {
    ConfigurationItemUi,
    useReadCiList1,
    useReadPoSuperiorPoRelationshipHook,
    useReadRelationships,
    useStoreGraph,
} from '@isdd/metais-common/api'
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

import { calcBlockedOrganizations, isCiAlreadyAssinged } from '@/components/views/organizations/helpers/formatting'

interface iUseAssignOrganizations<T> {
    entityId: string
    entityName: string
    onlyFreePO: boolean
    orgIco: string
    defaultFilterValues: T
    defaultFilterOperators?: T
}

export const useAssignOrganizations = <T extends FieldValues & IFilterParams>({
    entityId,
    entityName,
    onlyFreePO,
    orgIco,
    defaultFilterValues,
    defaultFilterOperators,
}: iUseAssignOrganizations<T>) => {
    const { t } = useTranslation()

    const getGarpoAdmin = useFindEaGarpoAdminHook()

    const { data: relData, isLoading: relIsLoading, isError: relIsError } = useReadRelationships(entityId)
    const generateUUID = useGenerateUuidsHook()
    const getSuperiorPoRelationShip = useReadPoSuperiorPoRelationshipHook()
    const { mutateAsync: storeGraph } = useStoreGraph()
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
        isLoading: ciIsLoading,
        isError: ciIsError,
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
            poUuid: !onlyFreePO ? entityId : undefined,
        },
    }

    const { filterToNeighborsApi, filterParams, handleFilterChange } = useFilterForCiList(defaultFilterValues, entityName, defaultRequestApiTableData)

    const { data: tableData } = useReadCiList1({
        ...filterToNeighborsApi,
        filter: {
            ...filterToNeighborsApi.filter,
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
        query: { enabled: onlyFreePO },
    })

    const handleSave = async (selectedValues: ConfigurationItemUi[]) => {
        const garpoAdminData = await getGarpoAdmin()
        const superiorData = await getSuperiorPoRelationShip({ uuids: selectedValues?.map((ciItem) => ciItem?.uuid ?? '') ?? [] })
        const uuid = await generateUUID(selectedValues?.length)

        const relSet = Object.values(superiorData ?? {})

        await storeGraph({
            data: {
                invalidateSet: {
                    relationshipSet: relSet,
                },
                storeSet: {
                    relationshipSet: relSet?.map((rel, index) => {
                        return {
                            attributes: rel?.attributes,
                            startUuid: rel?.startUuid,
                            owner: rel?.metaAttributes?.owner,
                            type: rel?.type,
                            uuid: uuid?.[index],
                            endUuid: isCiAlreadyAssinged(rel?.startUuid, ciData?.configurationItemSet) ? garpoAdminData?.orgId : entityId,
                        }
                    }),
                },
            },
        })
    }

    const tableDataWithBlockAttribute = calcBlockedOrganizations(tableData, integrityData, onlyFreePO, entityId, orgIco, t)

    const isLoading = relIsLoading || (ciIsLoading && idsToFind?.length > 0)
    const isError = relIsError || ciIsError
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

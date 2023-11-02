import { IFilter, SortType } from '@isdd/idsk-ui-kit/src/types'
import { useEffect, useMemo, useState } from 'react'
import { FieldValues } from 'react-hook-form'

import { mapFilterToNeighborsApi } from '@isdd/metais-common/api/filter/filterApi'
import { ConfigurationItemSetUi } from '@isdd/metais-common/api/generated/cmdb-swagger'
import {
    FavoriteCiType,
    useGetDefaultColumns,
    useGetUserColumns,
    useInsertUserColumns,
    useResetUserColumns,
} from '@isdd/metais-common/api/generated/user-config-swagger'
import { mapConfigurationItemSetToPagination } from '@isdd/metais-common/componentHelpers/pagination'
import { useAuth } from '@isdd/metais-common/contexts/auth/authContext'
import { IFilterParams, useFilterParams } from '@isdd/metais-common/hooks/useFilter'
import { ATTRIBUTE_NAME } from '@isdd/metais-common/src/api'

export const transformColumnsMap = new Map<string, string>([
    ['Gen_Profil_nazov', 'isvsName'],
    ['Gen_Profil_kod_metais', 'isvsCode'],
    ['Gui_Profil_RR_rr_register_kod', 'isvsCode'],
    ['Gui_Profil_RR_rr_register_nazov', 'isvsName'],
    ['Gui_Profil_RR_rr_source_register', 'isvsSource'],
    ['Gui_Profil_RR_rr_register_registrator', 'registratorName'],
    // ['Gui_Profil_RR_rr_evidencia_po', 'managerName'],
    ['Gui_Profil_RR_rr_creator', 'creator'],
    ['Gui_Profil_RR_rr_ref_id', 'isvsRefId'],
    ['Gui_Profil_RR_rr_manager', 'managerName'],
    ['ReferenceRegister_Profile_MUK', 'muk'],
    ['ReferenceRegister_Profile_effectiveTo', 'effectiveTo'],
    ['ReferenceRegister_Profile_effectiveFrom', 'effectiveFrom'],
    ['ReferenceRegister_Profile_contact', 'contact'],
    ['ReferenceRegister_Profile_validFrom', 'validFrom'],
    ['ReferenceRegister_Profile_contactRegistrator', 'contactRegistrator'],
    ['ReferenceRegister_Profile_note', 'note'],
    ['ReferenceRegister_Profile_state', 'state'],
    ['ReferenceRegister_Profile_accessDataDescription', 'additionalData'],
    ['ReferenceRegisterItem_Profile_subjectIdentifications', 'subjectIdentifications'],
    ['ReferenceRegisterItem_Profile_order', 'order'],
    ['ReferenceRegisterItem_Profile_name', 'name'],
    ['ReferenceRegisterItem_Profile_refID', 'refID'],
    ['ReferenceRegisterItem_Profile_note', 'note'],
    ['ReferenceRegisterItem_Profile_dataElementRefID', 'dataElementRefID'],
])

export const columnsToIgnore = [
    'Gui_Profil_RR_Gui_Profil_RR_rr_creator',
    'Gui_Profil_RR_Gui_Profil_RR_rr_isvsRefId',
    'Gui_Profil_RR_Gui_Profil_RR_rr_manager',
    'Gui_Profil_RR_rr_evidencia_as',
    'Gui_Profil_RR_rr_evidencia_po_poznamka',
    'Gui_Profil_RR_rr_evidencia_as_poznamka',
]

export const useGetColumnData = (entityName: string, renameColumns?: boolean) => {
    const {
        state: { user },
    } = useAuth()
    const isUserLogged = !!user

    const getUserColumns = useGetUserColumns(entityName, { query: { enabled: isUserLogged } })
    const getDefaultColumns = useGetDefaultColumns(entityName, { query: { enabled: !isUserLogged } })
    const {
        data: columnListData,
        refetch: refetchColumnData,
        isLoading: isQueryLoading,
        isError: isQueryError,
    } = isUserLogged ? getUserColumns : getDefaultColumns

    //Always show name and first in oreder
    const mergedColumnListData = useMemo(() => {
        const isGenProfile = columnListData?.attributes?.find((i) => i.name === ATTRIBUTE_NAME.Gen_Profil_nazov)
        return isGenProfile
            ? columnListData
            : {
                  ...columnListData,
                  attributes: [...(columnListData?.attributes || []), { name: ATTRIBUTE_NAME.Gen_Profil_nazov, order: 1 }],
              }
    }, [columnListData])

    const getKey = (value: string) => {
        return [...transformColumnsMap].find(([, val]) => val == value)?.[0]
    }

    const transformedColumnsListData = useMemo(() => {
        if (renameColumns) {
            return {
                ...mergedColumnListData,
                attributes: mergedColumnListData?.attributes?.map((attr) => ({
                    ...attr,
                    name: transformColumnsMap?.get(attr?.name ?? '') ?? attr?.name,
                })),
            }
        }
        return mergedColumnListData
    }, [mergedColumnListData, renameColumns])

    const storeUserSelectedColumns = useInsertUserColumns()
    const { isLoading: isStoreLoading, isError: isStoreError } = storeUserSelectedColumns
    const saveColumnSelection = async (columnSelection: FavoriteCiType) => {
        await storeUserSelectedColumns.mutateAsync({
            data: {
                attributes: transformColumnsMap
                    ? columnSelection?.attributes?.map((attr) => ({ ...attr, name: getKey(attr?.name ?? '') ?? attr?.name }))
                    : columnSelection.attributes,
                ciType: entityName ?? '',
                metaAttributes: columnSelection.metaAttributes,
            },
        })
        await refetchColumnData()
    }

    const resetUserSelectedColumns = useResetUserColumns()
    const { isLoading: isResetLoading, isError: isResetError } = resetUserSelectedColumns
    const resetColumns = async () => {
        await resetUserSelectedColumns.mutateAsync({ citype: entityName || '' })
        await refetchColumnData()
    }
    const isLoading = [isQueryLoading, isResetLoading, isStoreLoading].some((item) => item)
    const isError = [isQueryError, isResetError, isStoreError].some((item) => item)

    return {
        columnListData: transformedColumnsListData,
        saveColumnSelection,
        resetColumns,
        isLoading,
        isError,
    }
}

export const useFilterForCiList = <T extends FieldValues & IFilterParams, V>(defaultFilterValues: T, defaultRequestApi?: V) => {
    const { filter: filterParams, handleFilterChange } = useFilterParams<T & IFilter>({
        sort: [{ orderBy: ATTRIBUTE_NAME.Gen_Profil_nazov, sortDirection: SortType.ASC }],
        ...defaultFilterValues,
    })

    const filterToNeighborsApi = mapFilterToNeighborsApi<V>(filterParams, defaultRequestApi)

    return {
        filterParams,
        handleFilterChange,
        filterToNeighborsApi,
    }
}

export const usePagination = <T>(tableData: ConfigurationItemSetUi | undefined, filterParams: T & IFilter) => {
    //so there is always dataLength == pagination wont disappear and total items wont go on page change to zero
    const [dataLength, setDataLength] = useState(0)
    useEffect(() => {
        if (tableData?.pagination?.totaltems) {
            setDataLength(tableData?.pagination?.totaltems)
        }
    }, [tableData?.pagination?.totaltems])
    const pagination = mapConfigurationItemSetToPagination(filterParams, dataLength)

    return pagination
}

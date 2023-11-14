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
import { IFilterParams, useFilterParams } from '@isdd/metais-common/hooks/useFilter'
import { ATTRIBUTE_NAME } from '@isdd/metais-common/src/api'
import { Attribute } from '@isdd/metais-common/api/generated/types-repo-swagger'
import { useAuth } from '@isdd/metais-common/contexts/auth/authContext'

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
        const normalizedColumnListData: typeof columnListData = {
            ...columnListData,
            metaAttributes: columnListData?.metaAttributes?.map((metaAttr) => {
                return metaAttr.name === 'group' ? { ...metaAttr, name: 'owner' } : metaAttr
            }),
        }
        return isGenProfile
            ? normalizedColumnListData
            : {
                  ...normalizedColumnListData,
                  attributes: [...(normalizedColumnListData?.attributes || []), { name: ATTRIBUTE_NAME.Gen_Profil_nazov, order: 1 }],
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
        // has to compare as !== undefined otherwise if totalItems are 0 pagination won't recalculate
        if (tableData?.pagination?.totaltems !== undefined) {
            setDataLength(tableData?.pagination?.totaltems)
        }
    }, [tableData?.pagination?.totaltems])
    const pagination = mapConfigurationItemSetToPagination(filterParams, dataLength)

    return pagination
}

export const guiProfilStandardRequestMap = new Map<string, string>([
    ['Gui_Profil_Standardy_std_proposal_state', 'standardRequestState'],
    ['Gui_Profil_Standardy_std_proposal_type', 'requestChannel'],
    ['Gui_Profil_Standardy_std_proposal_date_creation', 'createdAt'],
    ['Gui_Profil_Standardy_std_proposal_name', 'name'],
    ['Gui_Profil_Standardy_std_proposal_email', 'email'],
    ['Gui_Profil_Standardy_std_proposal_title', 'srName'],
    ['Gui_Profil_Standardy_std_proposal_description', 'srDescription1'],
    // ['Gui_Profil_Standardy_std_proposal_intended_location', 'srDescription2'],
    ['Gui_Profil_Standardy_std_proposal_suitability', 'srDescription3'],
    ['Gui_Profil_Standardy_std_proposal_potential', 'srDescription4'],
    ['Gui_Profil_Standardy_std_proposal_openness', 'srDescription5'],
    ['Gui_Profil_Standardy_std_proposal_market_potential', 'srDescription6'],

    ['Gui_Profil_Standardy_std_proposal_doc', 'relatedDocuments'],

    //WEB type custom attributes
    ['Gui_Profil_Standardy_std_suitability', 'suitability'], //1

    ['Gui_Profil_Standardy_std_applicability', 'applicability'], //1.1
    ['Gui_Profil_Standardy_std_suitability_applicability_purpose', 'applicabilityDescription1'], //1.1.1
    ['Gui_Profil_Standardy_std_suitability_applicability_user', 'applicabilityDescription2'], //1.1.2
    ['Gui_Profil_Standardy_std_suitability_applicability_applications', 'applicabilityDescription3'], //1.1.3
    ['Gui_Profil_Standardy_std_suitability_applicability_functionality', 'applicabilityDescription4'], //1.1.4

    ['Gui_Profil_Standardy_std_relevance', 'relevance'], //1.2
    ['Gui_Profil_Standardy_std_suitability_relevance_benefits', 'relevanceDescription1'], //1.2.1

    ['Gui_Profil_Standardy_std_adaptability', 'adaptability'], //1.3
    ['Gui_Profil_Standardy_std_suitability_adaptability_adapt', 'adaptabilityDescription1'], //1.3.1
    ['Gui_Profil_Standardy_std_suitability_adaptability_dependent', 'adaptabilityDescription2'], //1.3.2

    ['Gui_Profil_Standardy_std_potential', 'potential'], //2

    ['Gui_Profil_Standardy_std_impact', 'impact'], //2.1
    ['Gui_Profil_Standardy_std_potential_impact_financial', 'impactDescription1'], //2.1.1
    ['Gui_Profil_Standardy_std_potential_impact_organizational', 'impactDescription2'], //2.1.2
    ['Gui_Profil_Standardy_std_potential_impact_strategic', 'impactDescription3'], //2.1.3
    ['Gui_Profil_Standardy_std_potential_impact_migration', 'impactDescription4'], //2.1.4
    ['Gui_Profil_Standardy_std_potential_impact_security', 'impactDescriptionSecurity'], //2.1.5
    ['Gui_Profil_Standardy_std_potential_impact_precautions', 'impactDescription5'], //2.1.5a
    ['Gui_Profil_Standardy_std_potential_impact_risks', 'impactDescription6'], //2.1.5b
    ['Gui_Profil_Standardy_std_potential_impact_privacy', 'impactDescription7'], //2.1.6
    ['Gui_Profil_Standardy_std_potential_impact_interoperability', 'impactDescriptionPrivacy'], //2.1.7
    ['Gui_Profil_Standardy_std_potential_impact_interconnection', 'impactDescription8'], //2.1.7a
    ['Gui_Profil_Standardy_std_potential_impact_adapting', 'impactDescription9'], //2.1.7b
    ['Gui_Profil_Standardy_std_potential_impact_compatibility', 'impactDescription10'], //2.1.8
    ['Gui_Profil_Standardy_std_potential_impact_dependency', 'impactDescription11'], //2.1.9
    ['Gui_Profil_Standardy_std_potential_impact_administrative', 'impactDescription12'], //2.1.10

    ['Gui_Profil_Standardy_std_scalability', 'scalability'], //2.2
    ['Gui_Profil_Standardy_std_potential_scalability_modifying', 'scalabilityDescription1'], //2.2.1

    ['Gui_Profil_Standardy_std_expandability', 'expandability'], //2.3
    ['Gui_Profil_Standardy_std_potential_expandability_universally', 'expandabilityDescription1'], //2.3.1
    ['Gui_Profil_Standardy_std_potential_expandability_methodologies', 'expandabilityDescription2'], //2.3.2

    ['Gui_Profil_Standardy_std_stability', 'stability'], //2.4
    ['Gui_Profil_Standardy_std_potential_stability_existence', 'stabilityDescription1'], //2.4.1
    ['Gui_Profil_Standardy_std_potential_stability_versions', 'stabilityDescription2'], //2.4.2
    ['Gui_Profil_Standardy_std_potential_stability_development', 'stabilityDescription3'], //2.4.3

    ['Gui_Profil_Standardy_std_maintenance', 'maintenance'], //2.5
    ['Gui_Profil_Standardy_std_potential_maintenance_organization', 'maintenanceDescription1'], //2.5.1

    ['Gui_Profil_Standardy_std_openness', 'openness'], //3

    ['Gui_Profil_Standardy_std_outputs', 'outputs'], //3.1
    ['Gui_Profil_Standardy_std_openness_outputs_documentation', 'outputsDescriptionDocumentation'], //3.1.1
    ['Gui_Profil_Standardy_std_openness_outputs_availability', 'outputsDescription1'], //3.1.1a
    ['Gui_Profil_Standardy_std_openness_outputs_limitation', 'outputsDescription2'], //3.1.1b
    ['Gui_Profil_Standardy_std_openness_outputs_copyright', 'outputsDescription3'], //3.1.2
    ['Gui_Profil_Standardy_std_openness_outputs_accessibility', 'outputsDescription4'], //3.1.3
    ['Gui_Profil_Standardy_std_openness_outputs_collaborative', 'outputsDescription5'], //3.1.4

    ['Gui_Profil_Standardy_std_process', 'process'], //3.2
    ['Gui_Profil_Standardy_std_openness_process_consultations', 'processDescription1'], //3.2.1
    ['Gui_Profil_Standardy_std_openness_process_consensus', 'processDescription2'], //3.2.2
    ['Gui_Profil_Standardy_std_openness_process_transparency', 'processDescriptionTransparency'], //3.2.3
    ['Gui_Profil_Standardy_std_openness_process_right', 'processDescription3'], //3.2.3a
    ['Gui_Profil_Standardy_std_openness_process_remedies', 'processDescription4'], //3.2.3b
    ['Gui_Profil_Standardy_std_openness_process_changes', 'processDescription5'], //3.2.4
    ['Gui_Profil_Standardy_std_openness_process_support', 'processDescription6'], //3.2.5

    ['Gui_Profil_Standardy_std_market', 'market'], //4

    ['Gui_Profil_Standardy_std_extension', 'extension'], //4.1

    ['Gui_Profil_Standardy_std_market_extension_products', 'extensionDescription1'], //4.1.1
    ['Gui_Profil_Standardy_std_market_extension_suppliers', 'extensionDescription2'], //4.1.2
    ['Gui_Profil_Standardy_std_market_extension_issues', 'extensionDescription3'], //4.1.3
    ['Gui_Profil_Standardy_std_market_extension_slovakia', 'extensionDescription4'], //4.1.4
    ['Gui_Profil_Standardy_std_market_extension_world', 'extensionDescription5'], //4.1.5
    ['Gui_Profil_Standardy_std_market_extension_implementation', 'extensionDescription6'], //4.1.6
    ['Gui_Profil_Standardy_std_market_extension_areas', 'extensionDescription7'], //4.1.7

    ['Gui_Profil_Standardy_std_maturity', 'maturity'], //4.2

    ['Gui_Profil_Standardy_std_market_maturity_standard', 'maturityDescription1'], //4.2.1
    ['Gui_Profil_Standardy_std_market_maturity_revisions', 'maturityDescription2'], //4.2.2
    ['Gui_Profil_Standardy_std_market_maturity_issues', 'maturityDescription3'], //4.2.3

    ['Gui_Profil_Standardy_std_reusability', 'reusability'], //4.3

    ['Gui_Profil_Standardy_std_market_reusability_parts', 'reusabilityDescription1'], //4.3.1
    ['Gui_Profil_Standardy_std_market_reusability_compatibility', 'reusabilityDescription2'], //4.3.2

    //['Gui_Profil_Standardy_std_proposal_description', 'proposalDescription1'],
    ['Gui_Profil_Standardy_std_proposal_intended_location', 'proposalDescription2'],
    ['Gui_Profil_Standardy_std_proposal_own_legislative_text', 'proposalDescription3'],

    ['Gui_Profil_Standardy_std_proposal_denial_reason', 'actionDesription'],
])

export const getLabelGuiProfilStandardRequest = (attributeName: string, attributes?: Attribute[]) => {
    return attributes?.find((val) => val?.technicalName === attributeName)?.name
}

export const getInfoGuiProfilStandardRequest = (attributeName: string, attributes?: Attribute[]) => {
    return attributes?.find((val) => val?.technicalName === attributeName)?.description
}

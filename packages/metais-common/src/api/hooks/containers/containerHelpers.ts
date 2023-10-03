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
import { ATTRIBUTE_NAME, Attribute } from '@isdd/metais-common/src/api'

export const useGetColumnData = (entityName: string) => {
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

    const storeUserSelectedColumns = useInsertUserColumns()
    const { isLoading: isStoreLoading, isError: isStoreError } = storeUserSelectedColumns
    const saveColumnSelection = async (columnSelection: FavoriteCiType) => {
        await storeUserSelectedColumns.mutateAsync({
            data: {
                attributes: columnSelection.attributes,
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
        columnListData: mergedColumnListData,
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

    const filterToNeighborsApi = mapFilterToNeighborsApi(filterParams, defaultRequestApi)

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

export const guiProfilStandardRequestMap = new Map<string, string>([
    ['Gui_Profil_Standardy_std_proposal_state', 'standardRequestState'],
    ['Gui_Profil_Standardy_std_proposal_type', 'requestChannel'],
    ['Gui_Profil_Standardy_std_proposal_date_creation', 'createdAt'],
    ['Gui_Profil_Standardy_std_proposal_name', 'name'],
    ['Gui_Profil_Standardy_std_proposal_email', 'email'],
    ['Gui_Profil_Standardy_std_proposal_title', 'srName'],
    ['Gui_Profil_Standardy_std_proposal_description', 'srDescription1'],
    ['Gui_Profil_Standardy_std_proposal_doc', 'relatedDocuments'],

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
    ['Gui_Profil_Standardy_std_openness_process_consultations', 'processDescription2'], //3.2.2
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
    ['Gui_Profil_Standardy_std_proposal_intended_location', 'proposalDescription2'],
    ['Gui_Profil_Standardy_std_proposal_own_legislative_text', 'proposalDescription3'],
])

export const getLabel = (attributeName: string, attributes?: Attribute[]) => {
    return attributes?.find((val) => val?.technicalName === attributeName)?.name
}

export const getInfo = (attributeName: string, attributes?: Attribute[]) => {
    return attributes?.find((val) => val?.technicalName === attributeName)?.description
}

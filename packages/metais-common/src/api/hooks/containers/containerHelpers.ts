import { IFilter, SortType } from '@isdd/idsk-ui-kit/src/types'
import { useEffect, useMemo, useState } from 'react'
import { FieldValues } from 'react-hook-form'

import { ApiReferenceRegisterList } from '@isdd/metais-common/api/generated/reference-registers-swagger'
import { mapFilterToNeighborsApi } from '@isdd/metais-common/api/filter/filterApi'
import { ConfigurationItemSetUi } from '@isdd/metais-common/api/generated/cmdb-swagger'
import { Attribute } from '@isdd/metais-common/api/generated/types-repo-swagger'
import {
    FavoriteCiType,
    useGetDefaultColumns,
    useGetUserColumns,
    useInsertUserColumns,
    useResetUserColumns,
} from '@isdd/metais-common/api/generated/user-config-swagger'
import { mapConfigurationItemSetToPagination } from '@isdd/metais-common/componentHelpers/pagination'
import { NO_USER_COLUMNS_LS_KEY } from '@isdd/metais-common/constants'
import { useAuth } from '@isdd/metais-common/contexts/auth/authContext'
import { IFilterParams, useFilterParams } from '@isdd/metais-common/hooks/useFilter'
import { ATTRIBUTE_NAME } from '@isdd/metais-common/src/api'

export const transformColumnsMap = new Map<string, string>([
    ['ReferenceRegister_Profile_name', 'Gen_Profil_nazov'], // Názov
    ['ReferenceRegister_Profile_name_en', 'name_en'], // Anglický názov
    ['ReferenceRegister_Profile_effectiveFrom', 'effectiveFrom'], // Dátum účinnosti od
    ['ReferenceRegister_Profile_contactRegistratorEmail', 'contactRegistratorEmail'], // Emailová adresa
    ['ReferenceRegister_Profile_contactEmail', 'contactEmail'], // Emailová adresa
    ['ReferenceRegister_Profile_contactRegistrator', 'contactRegistrator'], // Kontakt na registrátora referenčného registra
    ['ReferenceRegister_Profile_contactRegistratorFirstName', 'contactRegistratorFirstName'], // Meno
    ['ReferenceRegister_Profile_contactFirstName', 'contactFirstName'], // Meno
    ['ReferenceRegister_Profile_MUK', 'muk'], // MUK
    ['ReferenceRegister_Profile_validFrom', 'validFrom'], // Platnosť od
    ['ReferenceRegister_Profile_note', 'note'], // Poznámka
    ['ReferenceRegister_Profile_contactRegistratorLastName', 'contactRegistratorLastName'], // Priezvisko
    ['ReferenceRegister_Profile_contactLastName', 'contactLastName'], // Priezvisko
    ['ReferenceRegister_Profile_state', 'state'], // Stav
    ['ReferenceRegister_Profile_contactRegistratorPhone', 'contactRegistratorPhone'], // Telefónne číslo
    ['ReferenceRegister_Profile_contactPhone', 'contactPhone'], // Telefónne číslo
    ['ReferenceRegister_Profile_accessDataDescription', 'additionalData'], // Údaje o oprávnení
    ['ReferenceRegister_Profile_effectiveTo', 'effectiveTo'], // Dátum platnosti do
    ['Gui_Profil_RR_rr_register_kod', 'Gen_Profil_kod_metais'], // Kód MetaIS
    ['Gui_Profil_RR_rr_register_nazov', 'isvsName'], // Názov referenčného registra
    ['Gui_Profil_RR_rr_ref_id', 'isvsRefId'], // Referenčný identifikátor
    ['Gui_Profil_RR_rr_manager', 'managerName'], // Správca referenčného registra
    ['Gui_Profil_RR_rr_register_registrator', 'registratorName'], //Registrátor referenčného registra
    ['ReferenceRegister_Profile_contact', 'contact'],
])

export const transformNameColumnsMap = new Map<string, string>([
    ['ReferenceRegister_Profile_contactEmail', 'Email správcu'],
    ['ReferenceRegister_Profile_contactRegistratorEmail', 'Email registrátora'],
    ['ReferenceRegister_Profile_contactFirstName', 'Meno správcu'],
    ['ReferenceRegister_Profile_contactRegistratorFirstName', 'Meno registrátora'],
    ['ReferenceRegister_Profile_contactLastName', 'Priezvisko správcu'],
    ['ReferenceRegister_Profile_contactRegistratorLastName', 'Priezvisko registrátora'],
    ['ReferenceRegister_Profile_contactPhone', 'Telefón správcu'],
    ['ReferenceRegister_Profile_contactRegistratorPhone', 'Telefón registrátora'],
])

export const transformAttributes = (attributes?: Attribute[]) => {
    const transformedAttributes: Attribute[] = []
    attributes?.forEach((attr) => {
        const newTechnicalName = transformColumnsMap.get(attr?.technicalName ?? '')
        if (newTechnicalName) {
            transformedAttributes.push({
                ...attr,
                name: transformNameColumnsMap.get(attr?.technicalName ?? '') ?? attr?.name,
                technicalName: newTechnicalName,
            })
        }
    })
    return transformedAttributes
}

export const transformRefRegisters = (data?: ApiReferenceRegisterList): ApiReferenceRegisterList => {
    const referenceRegistersList = data?.referenceRegistersList?.map((obj) => {
        const { name, isvsCode, ...otherProps } = obj
        return { Gen_Profil_nazov: name, Gen_Profil_kod_metais: isvsCode, ...otherProps }
    })
    return { referenceRegistersCount: data?.referenceRegistersCount, referenceRegistersList }
}

export const columnsToIgnore = [
    'Gui_Profil_RR_Gui_Profil_RR_rr_creator',
    'Gui_Profil_RR_Gui_Profil_RR_rr_isvsRefId',
    'Gui_Profil_RR_Gui_Profil_RR_rr_manager',
    'Gui_Profil_RR_rr_evidencia_as',
    'Gui_Profil_RR_rr_evidencia_po_poznamka',
    'Gui_Profil_RR_rr_evidencia_as_poznamka',
]

const getColumnsFromLocalStorageKey = (entityName: string) => {
    return `${NO_USER_COLUMNS_LS_KEY}${entityName}`
}

const useGetColumnsFromLocalStorage = (entityName: string) => {
    const lsColumnsKey = getColumnsFromLocalStorageKey(entityName)
    const [columnsFromLocalStorage, setColumnsFromLocalStorage] = useState<FavoriteCiType | null>(null)
    const lsColumnData = localStorage.getItem(lsColumnsKey)

    useEffect(() => {
        if (lsColumnData != null) {
            const parsedColumnData = JSON.parse(lsColumnData)
            setColumnsFromLocalStorage(parsedColumnData)
        }
    }, [lsColumnData])

    const save = (dataToSave: FavoriteCiType) => {
        localStorage.setItem(`${NO_USER_COLUMNS_LS_KEY}${entityName}`, JSON.stringify(dataToSave))
        setColumnsFromLocalStorage(dataToSave)
    }
    const reset = () => {
        localStorage.removeItem(`${NO_USER_COLUMNS_LS_KEY}${entityName}`)
        setColumnsFromLocalStorage(null)
    }
    return { columnsFromLocalStorage, setColumnsFromLocalStorage, save, reset }
}

export const useGetColumnData = (entityName: string, renameColumns?: boolean) => {
    const {
        state: { user },
    } = useAuth()
    const isUserLogged = !!user?.uuid

    const getUserColumns = useGetUserColumns(entityName, { query: { enabled: isUserLogged } })
    const getDefaultColumns = useGetDefaultColumns(entityName, { query: { enabled: !isUserLogged } })
    const { columnsFromLocalStorage, save: saveColumnsToLocalStorage, reset: resetLocalStorageColumns } = useGetColumnsFromLocalStorage(entityName)

    const hasColumnsInLocalStorage =
        columnsFromLocalStorage &&
        ((columnsFromLocalStorage.attributes && columnsFromLocalStorage?.attributes?.length > 0) ||
            (columnsFromLocalStorage.metaAttributes && columnsFromLocalStorage?.metaAttributes?.length > 0))

    const {
        data: columnListData,
        refetch: refetchColumnData,
        isLoading: isQueryLoading,
        isError: isQueryError,
    } = isUserLogged ? getUserColumns : getDefaultColumns

    //Always show name and first in oreder
    const mergedColumnListData = useMemo(() => {
        const getMergedColumnListData = (clmnData: FavoriteCiType | undefined) => {
            const isGenProfile = clmnData?.attributes?.find((i) => i.name === ATTRIBUTE_NAME.Gen_Profil_nazov)
            const normalizedColumnListData: typeof columnListData = {
                ...clmnData,
                metaAttributes: clmnData?.metaAttributes?.map((metaAttr) => {
                    return metaAttr.name === 'group' ? { ...metaAttr, name: 'owner' } : metaAttr
                }),
            }
            return isGenProfile
                ? normalizedColumnListData
                : {
                      ...normalizedColumnListData,
                      attributes: [...(normalizedColumnListData?.attributes || []), { name: ATTRIBUTE_NAME.Gen_Profil_nazov, order: 1 }],
                  }
        }

        if (hasColumnsInLocalStorage && !isUserLogged) {
            return getMergedColumnListData(columnsFromLocalStorage)
        }
        return getMergedColumnListData(columnListData)
    }, [columnListData, columnsFromLocalStorage, hasColumnsInLocalStorage, isUserLogged])

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
        const dataToSave = {
            attributes: transformColumnsMap
                ? columnSelection?.attributes?.map((attr) => ({ ...attr, name: attr?.name }))
                : columnSelection.attributes,
            ciType: entityName ?? '',
            metaAttributes: columnSelection.metaAttributes,
        }

        if (!isUserLogged) {
            saveColumnsToLocalStorage(dataToSave)
            return
        }

        await storeUserSelectedColumns.mutateAsync({
            data: dataToSave,
        })
        await refetchColumnData()
    }

    const resetUserSelectedColumns = useResetUserColumns()
    const { isLoading: isResetLoading, isError: isResetError } = resetUserSelectedColumns
    const resetColumns = async () => {
        if (!isUserLogged) {
            resetLocalStorageColumns()
            return
        }

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
    const {
        filter: filterParams,
        handleFilterChange,
        reset,
    } = useFilterParams<T & IFilter>({
        sort: [{ orderBy: ATTRIBUTE_NAME.lastModifiedAt, sortDirection: SortType.DESC }],
        ...defaultFilterValues,
    })

    const filterToNeighborsApi = mapFilterToNeighborsApi<V>(filterParams, defaultRequestApi)

    return {
        filterParams,
        handleFilterChange,
        filterToNeighborsApi,
        reset,
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
    ['Gui_Profil_Standardy_std_proposal_name', 'fullName'],
    ['Gui_Profil_Standardy_std_proposal_title', 'name'],
    ['Gui_Profil_Standardy_std_proposal_email', 'email'],
    ['Gui_Profil_Standardy_std_proposal_description', 'description'],
    ['Gui_Profil_Standardy_std_proposal_suitability', 'srDescription3'],
    ['Gui_Profil_Standardy_std_proposal_potential', 'srDescription4'],
    ['Gui_Profil_Standardy_std_proposal_openness', 'srDescription5'],
    ['Gui_Profil_Standardy_std_proposal_market_potential', 'srDescription6'],

    ['Gui_Profil_Standardy_std_proposal_doc', 'relatedDocuments'],

    //WEB type custom attributes
    ['Gui_Profil_Standardy_std_suitability', 'suitability'], //1

    ['Gui_Profil_Standardy_std_applicability', 'applicability'], //1.1

    ['Gui_Profil_Standardy_std_relevance', 'relevance'], //1.2
    ['Gui_Profil_Standardy_std_suitability_relevance_benefits', 'relevanceDescription1'], //1.2.1
    ['Gui_Profil_Standardy_std_suitability_relevance_benefits', 'relevanceDescription1'], //1.2.1

    ['Gui_Profil_Standardy_std_adaptability', 'adaptability'], //1.3
    ['Gui_Profil_Standardy_std_suitability_adaptability_adapt', 'adaptabilityDescription1'], //1.3.1
    ['Gui_Profil_Standardy_std_suitability_adaptability_dependent', 'adaptabilityDescription2'], //1.3.2

    ['Gui_Profil_Standardy_std_potential', 'potential'], //2

    ['Gui_Profil_Standardy_std_impact', 'impact'], //2.1
    ['Gui_Profil_Standardy_std_potential_impact_financial', 'financialImpact'], //2.1.1
    ['Gui_Profil_Standardy_std_potential_impact_organizational', 'impactDescription2'], //2.1.2
    ['Gui_Profil_Standardy_std_potential_impact_strategic', 'impactDescription3'], //2.1.3
    ['Gui_Profil_Standardy_std_potential_impact_migration', 'impactDescription4'], //2.1.4
    ['Gui_Profil_Standardy_std_potential_impact_security', 'impactDescriptionSecurity'], //2.1.5
    ['Gui_Profil_Standardy_std_potential_impact_precautions', 'securityImpact'], //2.1.5a
    ['Gui_Profil_Standardy_std_potential_impact_risks', 'impactDescription6'], //2.1.5b
    ['Gui_Profil_Standardy_std_potential_impact_privacy', 'privacyImpact'], //2.1.6
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
    ['Gui_Profil_Standardy_std_proposal_intended_location', 'placementProposal'],
    ['Gui_Profil_Standardy_std_proposal_own_legislative_text', 'legislativeTextProposal'],

    ['Gui_Profil_Standardy_std_proposal_denial_reason', 'actionDesription'],
])

export const getLabelGuiProfilStandardRequest = (attributeName: string, attributes?: Attribute[]) => {
    return attributes?.find((val) => val?.technicalName === attributeName)?.name
}

export const getInfoGuiProfilStandardRequest = (attributeName: string, attributes?: Attribute[]) => {
    return attributes?.find((val) => val?.technicalName === attributeName)?.description
}

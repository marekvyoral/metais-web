import { SelectLazyLoading } from '@isdd/idsk-ui-kit/index'
import { MetaAttributesState, SortBy, SortType } from '@isdd/idsk-ui-kit/types'
import { ConfigurationItemUi, useReadCiList1Hook } from '@isdd/metais-common/api/generated/cmdb-swagger'
import { ATTRIBUTE_NAME, BASE_PAGE_NUMBER, BASE_PAGE_SIZE } from '@isdd/metais-common/index'
import React, { useCallback, useEffect, useState } from 'react'
import { FieldErrors, FieldValue, UseFormClearErrors, UseFormSetValue } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

interface ISelectISVS {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    errors: FieldErrors<FieldValue<Record<string, any>>>
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setValue: UseFormSetValue<FieldValue<Record<string, any>>>
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    clearErrors?: UseFormClearErrors<FieldValue<Record<string, any>>>
    name: string
    required?: boolean
    filterUuid?: string
    uuid?: string
    additionalName?: string
}

export const ISVSSelect: React.FC<ISelectISVS> = ({ errors, setValue, name, required = false, filterUuid, clearErrors, uuid, additionalName }) => {
    const { t } = useTranslation()
    const loadServices = useReadCiList1Hook()
    const [selectedISVSItem, setSelectedISVSItem] = useState<ConfigurationItemUi>()

    const findISVS = useCallback(
        async (id: string | null) => {
            if (id == null) {
                setSelectedISVSItem(undefined)
                return
            }
            const res = await loadServices({
                filter: {
                    type: ['ISVS'],
                    uuid: [id],
                    searchFields: ['Gen_Profil_nazov', 'Gen_Profil_kod_metais'],
                    metaAttributes: {
                        state: [MetaAttributesState.DRAFT],
                    },
                },
                page: BASE_PAGE_NUMBER,
                perpage: BASE_PAGE_SIZE,
                sortBy: SortBy.GEN_PROFIL_NAZOV,
                sortType: SortType.ASC,
            })
            setSelectedISVSItem(res?.configurationItemSet?.at(0))
        },
        [loadServices],
    )

    useEffect(() => {
        if (uuid && !selectedISVSItem) {
            findISVS(uuid)
        }
    }, [findISVS, selectedISVSItem, uuid])

    const loadOptionsISVS = async (searchQuery: string, additional: { page: number } | undefined) => {
        const page = !additional?.page ? 1 : (additional?.page || 0) + 1
        const response = await loadServices({
            filter: {
                fullTextSearch: searchQuery,
                type: ['ISVS'],
                uuid: [],
                searchFields: ['Gen_Profil_nazov', 'Gen_Profil_kod_metais'],
                metaAttributes: {
                    state: [MetaAttributesState.DRAFT],
                },
            },
            page: page,
            perpage: 50,
            sortBy: SortBy.GEN_PROFIL_NAZOV,
            sortType: SortType.ASC,
        })

        const options = response.configurationItemSet
        return {
            options: options || [],
            hasMore: page < (response.pagination?.totalPages ?? 0),
            additional: {
                page: page,
            },
        }
    }

    useEffect(() => {
        filterUuid && findISVS(filterUuid)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <SelectLazyLoading
            clearErrors={clearErrors}
            required={required}
            key="contractorIsvsUuid"
            id="contractorIsvsUuid"
            getOptionLabel={(item: ConfigurationItemUi) => item.attributes?.[ATTRIBUTE_NAME.Gen_Profil_nazov]}
            getOptionValue={(item: ConfigurationItemUi) => item.uuid ?? ''}
            loadOptions={(searchTerm, _, additional) => loadOptionsISVS(searchTerm, additional)}
            label={t('olaContracts.filter.selectService')}
            name={name}
            onChange={(val) => {
                const value: ConfigurationItemUi | null = Array.isArray(val) ? val[0] : val
                setValue(name, value?.uuid ?? '')
                additionalName && setValue(additionalName, value?.attributes?.['Gen_Profil_nazov'] ?? '')
                findISVS(value?.uuid ?? null)
            }}
            value={selectedISVSItem}
            error={errors?.[name]?.message as string}
        />
    )
}

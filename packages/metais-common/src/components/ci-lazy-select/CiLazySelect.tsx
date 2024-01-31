import { SelectLazyLoading } from '@isdd/idsk-ui-kit/index'
import { SortType } from '@isdd/idsk-ui-kit/types'
import React, { SetStateAction, useCallback, useEffect, useState } from 'react'
import { MultiValue, OptionProps } from 'react-select'
import { Option } from '@isdd/idsk-ui-kit/common/SelectCommon'
import { FieldValues, UseFormClearErrors, UseFormSetValue } from 'react-hook-form'

import {
    ConfigurationItemUi,
    FilterAttributesUi,
    FilterMetaAttributesUi,
    useReadCiList1,
    useReadCiList1Hook,
} from '@isdd/metais-common/api/generated/cmdb-swagger'

interface ICiLazySelect<T extends FieldValues> {
    ciType: string
    selectedCi?: ConfigurationItemUi | undefined
    label: string
    setSelectedCi?: React.Dispatch<SetStateAction<ConfigurationItemUi | undefined>>
    placeholder?: string
    name?: string
    error?: string
    setValue?: UseFormSetValue<T>
    clearErrors?: UseFormClearErrors<T>
    disabled?: boolean
    defaultValue?: string
    info?: string
    metaAttributes?: FilterMetaAttributesUi
    attributes?: FilterAttributesUi[]
    option?: (props: OptionProps<ConfigurationItemUi>) => JSX.Element
    required?: boolean
}

export const CiLazySelect = <T extends FieldValues>({
    ciType,
    selectedCi,
    setSelectedCi,
    label,
    placeholder,
    setValue,
    clearErrors,
    error,
    name,
    disabled,
    defaultValue,
    info,
    metaAttributes,
    attributes,
    option,
    required,
}: ICiLazySelect<T>) => {
    const ciOptionsHook = useReadCiList1Hook()

    const { data } = useReadCiList1({
        filter: { type: [ciType], uuid: defaultValue ? [defaultValue] : undefined },
    })

    const [seed, setSeed] = useState(1)
    useEffect(() => {
        setSeed(Math.random())
    }, [data, defaultValue, ciType, selectedCi])

    const loadCiOptions = useCallback(
        async (searchQuery: string, additional: { page: number } | undefined) => {
            const page = !additional?.page ? 1 : (additional?.page || 0) + 1

            const ciResponse = await ciOptionsHook({
                page,
                perpage: 20,
                sortBy: 'Gen_Profil_nazov',
                sortType: SortType.ASC,
                filter: {
                    type: [ciType],
                    searchFields: ['Gen_Profil_nazov'],
                    fullTextSearch: searchQuery,
                    metaAttributes: { ...(metaAttributes ?? undefined) },
                    attributes: attributes ?? [],
                },
            })

            return {
                options: ciResponse.configurationItemSet || [],
                hasMore: page < (ciResponse.pagination?.totalPages ?? 0),
                additional: {
                    page,
                },
            }
        },
        [ciOptionsHook, ciType, metaAttributes, attributes],
    )

    const selectLazyLoadingCiOption = (props: OptionProps<ConfigurationItemUi>) => {
        return (
            <Option {...props}>
                <div>
                    <span>{props.data.attributes?.Gen_Profil_nazov}</span>
                </div>
            </Option>
        )
    }

    const onChangeProps = {
        ...(setSelectedCi
            ? {
                  onChange: (val: ConfigurationItemUi | MultiValue<ConfigurationItemUi> | null) => setSelectedCi(Array.isArray(val) ? val[0] : val),
                  value: selectedCi,
              }
            : {}),
    }

    return (
        <SelectLazyLoading<ConfigurationItemUi>
            key={seed}
            placeholder={placeholder}
            name={name ?? 'account'}
            label={label + ':'}
            getOptionValue={(item) => item.uuid?.toString() || ''}
            getOptionLabel={(item) => (item.attributes ? item.attributes?.Gen_Profil_nazov : '')}
            option={(props) => (option ? option(props) : selectLazyLoadingCiOption(props))}
            loadOptions={(searchTerm, _, additional) => loadCiOptions(searchTerm, additional)}
            {...onChangeProps}
            setValue={setValue}
            clearErrors={clearErrors}
            error={error}
            disabled={disabled}
            defaultValue={defaultValue ? data?.configurationItemSet?.[0] : undefined}
            info={info}
            required={required}
        />
    )
}

import React, { useCallback } from 'react'
import { MultiValue, OptionProps } from 'react-select'
import { Option } from '@isdd/idsk-ui-kit/common/SelectCommon'
import { CreatableLazySelect } from '@isdd/idsk-ui-kit/select/creatable-select/CreatableLazySelect'

import { CiFilterUi, CiListFilterContainerUi, ConfigurationItemUi, useReadCiList1Hook } from '@isdd/metais-common/api/generated/cmdb-swagger'
import { ATTRIBUTE_NAME } from '@isdd/metais-common/api'
import { isConfigurationItemUi, isCreatableOptionType } from '@isdd/metais-common/utils/utils'

export type CreatableOptionType = {
    label: string
    value: string
}

type Props = {
    ciTypes: string[]
    label: string
    onChange: (val: ConfigurationItemUi[] | CreatableOptionType[]) => void
    fieldValue: ConfigurationItemUi | MultiValue<ConfigurationItemUi | CreatableOptionType> | CreatableOptionType | null
    placeholder?: string
    name: string
    isMulti?: boolean
    disabled?: boolean
    required?: boolean
    ciFilter?: CiFilterUi
    additionalData?: CiFilterUi
    customOptionRender?: (props: OptionProps<ConfigurationItemUi | CreatableOptionType>) => React.JSX.Element
    error?: string
    searchAttributeNames?: string[]
    info?: string
    hint?: string
}

export const CiLazySelectCreatable: React.FC<Props> = ({
    ciTypes,
    label,
    onChange,
    placeholder,
    name,
    ciFilter,
    disabled,
    required,
    isMulti = false,
    additionalData,
    customOptionRender,
    error,
    fieldValue,
    searchAttributeNames,
    info,
    hint,
}) => {
    const ciOptionsHook = useReadCiList1Hook()

    const loadCiOptions = useCallback(
        async (searchQuery: string, additional: { page: number } | undefined) => {
            const page = !additional?.page ? 1 : (additional?.page || 0) + 1

            const defaultFilterValues = {
                page,
                perpage: 20,
                filter: ciFilter ? ciFilter : { type: ciTypes, searchFields: searchAttributeNames, fullTextSearch: searchQuery, ...additionalData },
            } as CiListFilterContainerUi

            const ciResponse = await ciOptionsHook(defaultFilterValues)
            const options = ciResponse.configurationItemSet ?? []

            return {
                options,
                hasMore: page < (ciResponse.pagination?.totalPages ?? 0),
                additional: {
                    page,
                },
            }
        },
        [additionalData, ciFilter, ciOptionsHook, ciTypes, searchAttributeNames],
    )

    const formatOption = (props: OptionProps<ConfigurationItemUi | CreatableOptionType>) => {
        if (isConfigurationItemUi(props.data)) {
            const { attributes } = props.data
            return (
                <Option {...props}>
                    <div>{attributes?.[ATTRIBUTE_NAME.Gen_Profil_nazov]}</div>
                    <span>
                        <small>{attributes?.[ATTRIBUTE_NAME.Gen_Profil_kod_metais]}</small>
                    </span>
                </Option>
            )
        } else {
            return (
                <Option {...props}>
                    <div>{props.data.label}</div>
                    <span>
                        <small>{props.data.value}</small>
                    </span>
                </Option>
            )
        }
    }

    return (
        <CreatableLazySelect<ConfigurationItemUi | CreatableOptionType>
            isMulti={isMulti}
            placeholder={placeholder}
            disabled={disabled}
            required={required}
            name={name}
            label={label}
            getOptionLabel={(item) =>
                isConfigurationItemUi(item) ? item.attributes?.[ATTRIBUTE_NAME.Gen_Profil_nazov] : isCreatableOptionType(item) ? item.label : item
            }
            loadOptions={(searchTerm, _, additional) => loadCiOptions(searchTerm, additional)}
            value={fieldValue}
            onChange={(val) => onChange(Array.isArray(val) ? val : [val])}
            option={(props) => (customOptionRender ? customOptionRender(props) : formatOption(props))}
            error={error}
            info={info}
            hint={hint}
        />
    )
}

import { SelectLazyLoading } from '@isdd/idsk-ui-kit/index'
import { IFilter, SortType } from '@isdd/idsk-ui-kit/types'
import React, { useCallback, useEffect, useState } from 'react'
import { MultiValue, OptionProps } from 'react-select'
import { Option } from '@isdd/idsk-ui-kit/common/SelectCommon'

import {
    CiFilterUi,
    CiListFilterContainerUi,
    ConfigurationItemUi,
    useReadCiList1,
    useReadCiList1Hook,
} from '@isdd/metais-common/api/generated/cmdb-swagger'
import { ATTRIBUTE_NAME } from '@isdd/metais-common/api'

interface ISelectPO {
    ciType: string
    valuesAsUuids: string[]
    label: string
    onChange: (val: ConfigurationItemUi[]) => void
    placeholder?: string
    name: string
    isMulti: boolean
    disabled?: boolean
    required?: boolean
    ciFilter?: CiFilterUi
    additionalData?: IFilter
}

export const SelectPOForFilter: React.FC<ISelectPO> = ({
    ciType,
    valuesAsUuids,
    label,
    onChange,
    placeholder,
    name,
    ciFilter,
    disabled,
    required,
    isMulti = false,
    additionalData,
}) => {
    const ciOptionsHook = useReadCiList1Hook()
    const [seed, setSeed] = useState(1)
    const [selectedLiableEntities, setSelectedLiableEntities] = useState<ConfigurationItemUi[]>([])

    const { data, isLoading, isError, refetch } = useReadCiList1(
        {
            filter: { type: [ciType], uuid: valuesAsUuids, ...additionalData },
        },
        { query: { enabled: valuesAsUuids && valuesAsUuids?.length > 0 && valuesAsUuids.every((v) => v != '') } },
    )
    const [value, setValue] = useState<ConfigurationItemUi | MultiValue<ConfigurationItemUi> | null>()

    useEffect(() => {
        onChange(Array.isArray(value) ? value : [value])
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value])

    useEffect(() => {
        if (data?.configurationItemSet && (!isLoading || !isError)) {
            setValue(data?.configurationItemSet)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isLoading, isError])

    useEffect(() => {
        if (selectedLiableEntities.length === 0 && valuesAsUuids?.length > 0 && valuesAsUuids.every((v) => v != '')) {
            refetch().then((res) => {
                setSelectedLiableEntities(res.data?.configurationItemSet || [])
            })
        }
    }, [valuesAsUuids, refetch, selectedLiableEntities])

    useEffect(() => {
        setSeed(Math.random())
    }, [selectedLiableEntities, ciFilter])

    const loadCiOptions = useCallback(
        async (searchQuery: string, additional: { page: number } | undefined) => {
            const page = !additional?.page ? 1 : (additional?.page || 0) + 1

            const defaultFilterValues = {
                page,
                perpage: 20,
                sortBy: 'Gen_Profil_nazov',
                sortType: SortType.ASC,
                filter: ciFilter ? ciFilter : { type: [ciType], searchFields: ['Gen_Profil_nazov'], fullTextSearch: searchQuery, ...additionalData },
            } as CiListFilterContainerUi

            const ciResponse = await ciOptionsHook(defaultFilterValues)

            return {
                options: ciResponse.configurationItemSet || [],
                hasMore: page < (ciResponse.pagination?.totalPages ?? 0),
                additional: {
                    page,
                },
            }
        },
        [additionalData, ciFilter, ciOptionsHook, ciType],
    )

    const formatOption = (props: OptionProps<ConfigurationItemUi>) => {
        const { attributes } = props.data

        return (
            <Option {...props}>
                <div>{attributes?.[ATTRIBUTE_NAME.Gen_Profil_nazov]}</div>
                <span>
                    <small>{attributes?.[ATTRIBUTE_NAME.Gen_Profil_kod_metais]}</small>
                </span>
            </Option>
        )
    }

    return (
        <SelectLazyLoading<ConfigurationItemUi>
            key={seed}
            isMulti={isMulti}
            placeholder={placeholder}
            disabled={disabled}
            required={required}
            name={name}
            label={label}
            getOptionValue={(item) => item.uuid?.toString() || ''}
            getOptionLabel={(item) => (item.attributes ? item.attributes?.Gen_Profil_nazov : '')}
            loadOptions={(searchTerm, _, additional) => loadCiOptions(searchTerm, additional)}
            value={value}
            onChange={(val) => setValue(val)}
            option={(props) => formatOption(props)}
            defaultValue={selectedLiableEntities}
        />
    )
}

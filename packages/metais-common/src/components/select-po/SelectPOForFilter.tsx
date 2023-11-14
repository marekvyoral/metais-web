import { SelectLazyLoading } from '@isdd/idsk-ui-kit/index'
import { SortType } from '@isdd/idsk-ui-kit/types'
import React, { useCallback, useEffect, useState } from 'react'
import { MultiValue } from 'react-select'

import { ConfigurationItemUi, useReadCiList1, useReadCiList1Hook } from '@isdd/metais-common/api/generated/cmdb-swagger'

interface ISelectPO {
    ciType: string
    valuesAsUuids: string[]
    label: string
    onChange: (val: ConfigurationItemUi[]) => void
    placeholder?: string
    name: string
}

export const SelectPOForFilter: React.FC<ISelectPO> = ({ ciType, valuesAsUuids, label, onChange, placeholder, name }) => {
    const ciOptionsHook = useReadCiList1Hook()

    const { data } = useReadCiList1(
        {
            filter: { type: [ciType], uuid: valuesAsUuids },
        },
        { query: { enabled: valuesAsUuids.length > 0 && !!valuesAsUuids[0] } },
    )

    const [value, setValue] = useState<ConfigurationItemUi | MultiValue<ConfigurationItemUi> | null>()

    useEffect(() => {
        onChange(Array.isArray(value) ? value : [value])
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value])

    useEffect(() => {
        if (data?.configurationItemSet) {
            setValue(data?.configurationItemSet)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const loadCiOptions = useCallback(
        async (searchQuery: string, additional: { page: number } | undefined) => {
            const page = !additional?.page ? 1 : (additional?.page || 0) + 1

            const ciResponse = await ciOptionsHook({
                page,
                perpage: 20,
                sortBy: 'Gen_Profil_nazov',
                sortType: SortType.ASC,
                filter: { type: [ciType], searchFields: ['Gen_Profil_nazov'], fullTextSearch: searchQuery },
            })

            return {
                options: ciResponse.configurationItemSet || [],
                hasMore: page < (ciResponse.pagination?.totalPages ?? 0),
                additional: {
                    page,
                },
            }
        },
        [ciOptionsHook, ciType],
    )

    return (
        <SelectLazyLoading<ConfigurationItemUi>
            isMulti
            placeholder={placeholder}
            name={name}
            label={label}
            getOptionValue={(item) => item.uuid?.toString() || ''}
            getOptionLabel={(item) => (item.attributes ? item.attributes?.Gen_Profil_nazov : '')}
            loadOptions={(searchTerm, _, additional) => loadCiOptions(searchTerm, additional)}
            value={value}
            onChange={(val) => setValue(val)}
        />
    )
}

import { SelectLazyLoading } from '@isdd/idsk-ui-kit/index'
import { SortType } from '@isdd/idsk-ui-kit/types'
import { ConfigurationItemUi, useReadCiList1Hook } from '@isdd/metais-common/api'
import React, { SetStateAction, useCallback } from 'react'
import { OptionProps, components } from 'react-select'

interface ICiLazySelect {
    ciType: string
    selectedCi: ConfigurationItemUi | undefined
    label: string
    setSelectedCi: React.Dispatch<SetStateAction<ConfigurationItemUi | undefined>>
    placeholder?: string
}

export const CiLazySelect: React.FC<ICiLazySelect> = ({ ciType, selectedCi, setSelectedCi, label, placeholder }) => {
    const ciOptionsHook = useReadCiList1Hook()

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

    const selectLazyLoadingCiOption = (props: OptionProps<ConfigurationItemUi>) => {
        return (
            <components.Option {...props}>
                <div>
                    <span>{props.data.attributes?.Gen_Profil_nazov}</span>
                </div>
            </components.Option>
        )
    }

    return (
        <SelectLazyLoading<ConfigurationItemUi>
            placeholder={placeholder}
            name="account"
            label={label + ':'}
            value={selectedCi}
            onChange={(val) => setSelectedCi(Array.isArray(val) ? val[0] : val)}
            getOptionValue={(item) => item.uuid?.toString() || ''}
            getOptionLabel={(item) => (item.attributes ? item.attributes?.Gen_Profil_nazov : '')}
            option={(props) => selectLazyLoadingCiOption(props)}
            loadOptions={(searchTerm, _, additional) => loadCiOptions(searchTerm, additional)}
        />
    )
}

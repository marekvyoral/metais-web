import { SelectLazyLoading } from '@isdd/idsk-ui-kit'
import { Option } from '@isdd/idsk-ui-kit/common/SelectCommon'
import React, { useCallback, useEffect, useState } from 'react'
import { OptionProps } from 'react-select'

import { Identity, useFind1Hook, useFindAll311 } from '@isdd/metais-common/api/generated/iam-swagger'

export type SelectFilterIdentityOptionType = {
    uuid: string
    displayName: string
    login: string
}

const formatOption = (optionProps: OptionProps<SelectFilterIdentityOptionType>) => {
    return (
        <Option {...optionProps}>
            <div>{optionProps.data.displayName}</div>
        </Option>
    )
}

const mapToOption = (data?: Identity[]): SelectFilterIdentityOptionType[] => {
    return (
        data?.map((item) => ({
            uuid: item.uuid || '',
            displayName: item?.displayName ?? '',
            login: item?.login ?? '',
        })) || []
    )
}

interface SelectUserIdentitiesProps<T> {
    name: string
    label: string
    value?: T
    onChange: (val?: SelectFilterIdentityOptionType) => void
}

export const SelectUserIdentities = <T,>({ value, name, label, onChange }: SelectUserIdentitiesProps<T>) => {
    const getIdentities = useFind1Hook()
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    const { data, isLoading, isError, refetch } = useFindAll311({ login: value }, { query: { enabled: !!value && value != '' } })
    const [selectedOption, setSelectedOption] = useState<SelectFilterIdentityOptionType>()

    const [seed, setSeed] = useState(1)

    const loadOptions = useCallback(
        async (searchQuery: string, additional: { page: number } | undefined) => {
            const page = !additional?.page ? 1 : (additional?.page || 0) + 1

            const response = await getIdentities(page, 50, { expression: searchQuery, orderBy: 'firstName', direction: 'ASC' })

            const options = mapToOption(response) || []

            return {
                options: options,
                hasMore: options?.length ? true : false,
                additional: {
                    page: page,
                },
            }
        },
        [getIdentities],
    )

    useEffect(() => {
        onChange(selectedOption)
        setSeed(Math.random())
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedOption])

    useEffect(() => {
        if (!selectedOption && data && (!isLoading || !isError)) {
            setSelectedOption(mapToOption(Array.isArray(data) ? (data as Identity[]) : [data as Identity])[0])
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isLoading, isError])

    useEffect(() => {
        if (!selectedOption && value) {
            refetch().then((res) => {
                setSelectedOption(mapToOption(Array.isArray(res?.data) ? (res.data as Identity[]) : [res.data as Identity])[0])
            })
        }
    }, [value, refetch, selectedOption])

    return (
        <>
            <SelectLazyLoading
                key={seed}
                getOptionLabel={(item) => item.displayName}
                getOptionValue={(item) => item.login}
                loadOptions={(searchQuery, _prevOptions, additional) => loadOptions(searchQuery, additional)}
                label={label}
                name={name}
                option={(ctx) => formatOption(ctx)}
                value={selectedOption}
                onChange={(val) => setSelectedOption(val as SelectFilterIdentityOptionType)}
            />
        </>
    )
}

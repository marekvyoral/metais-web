import { SelectLazyLoading } from '@isdd/idsk-ui-kit'
import { Option } from '@isdd/idsk-ui-kit/common/SelectCommon'
import React, { useCallback, useEffect, useState } from 'react'
import { UseFormSetValue } from 'react-hook-form'
import { OptionProps } from 'react-select'

import { Identity, useFind1Hook, useFindAll311Hook } from '@isdd/metais-common/api/generated/iam-swagger'
import { GetFOPStandardRequestsParams } from '@isdd/metais-common/api/generated/standards-swagger'

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

interface SelectUserIdentitiesProps {
    filter: GetFOPStandardRequestsParams
    setValue: UseFormSetValue<GetFOPStandardRequestsParams>
    name: string
    label: string
}

export const SelectUserIdentities = ({ filter, setValue, name, label }: SelectUserIdentitiesProps) => {
    const getIdentities = useFind1Hook()
    const getIdentityByLogin = useFindAll311Hook()
    const [defaultValue, setDefaultValue] = useState<SelectFilterIdentityOptionType | undefined>(undefined)

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
        if (!defaultValue && filter.createdBy) {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            //@ts-ignore
            getIdentityByLogin({ login: filter?.createdBy }).then((response) => {
                if (response) setDefaultValue(mapToOption([response as Identity])[0])
            })
        }
    }, [defaultValue, filter.createdBy, getIdentityByLogin])

    useEffect(() => {
        // SelectLazyLoading component does not rerender on defaultValue change.
        // Once default value is set, it cant be changed.
        // Change of key forces the component to render changed default value.
        setSeed(Math.random())
    }, [defaultValue])

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
                setValue={setValue}
                defaultValue={defaultValue}
            />
        </>
    )
}

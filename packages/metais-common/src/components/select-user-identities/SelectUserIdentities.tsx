import React, { useCallback, useEffect, useState } from 'react'
import { OptionProps } from 'react-select'
import { Option } from '@isdd/idsk-ui-kit/common/SelectCommon'
import { SelectLazyLoading } from '@isdd/idsk-ui-kit'
import { useTranslation } from 'react-i18next'
import { UseFormSetValue } from 'react-hook-form'

import { Identity, useFindAll3Hook } from '@isdd/metais-common/api/generated/iam-swagger'
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
}

export const SelectUserIdentities = ({ filter, setValue }: SelectUserIdentitiesProps) => {
    const getIdentities = useFindAll3Hook()
    const { t } = useTranslation()
    const [defaultValue, setDefaultValue] = useState<SelectFilterIdentityOptionType | undefined>(undefined)

    const [seed, setSeed] = useState(1)

    const loadOptions = useCallback(
        async (searchQuery: string, additional: { page: number } | undefined) => {
            const page = !additional?.page ? 1 : (additional?.page || 0) + 1

            const response = await getIdentities(page, 50)

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
            // TODO: vyriesit ako potiahnut zaznam po refreshi ked som zvolil nieco vo filtri.
            getIdentities(1, 150).then((response) => {
                const foundIdentity = response.find((item) => item?.login === filter?.createdBy)
                if (foundIdentity) setDefaultValue(mapToOption([foundIdentity])[0])
            })
        }
    }, [defaultValue, filter.createdBy, getIdentities])

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
                label={t('DraftsList.filter.createdBy')}
                name="createdBy"
                option={(ctx) => formatOption(ctx)}
                setValue={setValue}
                defaultValue={defaultValue}
            />
        </>
    )
}

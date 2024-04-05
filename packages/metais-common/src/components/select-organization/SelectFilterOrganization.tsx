import { Option } from '@isdd/idsk-ui-kit/common/SelectCommon'
import { DEFAULT_LAZY_LOAD_PER_PAGE, ILoadOptionsResponse, SelectLazyLoading } from '@isdd/idsk-ui-kit/index'
import { IFilter, SortType } from '@isdd/idsk-ui-kit/types'
import React, { useCallback, useEffect, useState } from 'react'
import { FieldValues, UseFormSetValue } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { MultiValue, OptionProps } from 'react-select'

import { QueryFeedback } from '@isdd/metais-common/index'
import { ConfigurationItemUi, useReadCiList1Hook } from '@isdd/metais-common/api/generated/cmdb-swagger'
import { IFilterParams } from '@isdd/metais-common/hooks/useFilter'

export type SelectFilterOrganizationOptionType = {
    uuid: string
    name: string
    address: string
    code: string
}

interface SelectFilterOrganizationProps<T extends FieldValues & IFilterParams> {
    filter?: T
    setValue?: UseFormSetValue<T>
    additionalData?: IFilter
    name: string
    label: string
    isMulti?: boolean
    option?: (row: OptionProps<SelectFilterOrganizationOptionType>) => JSX.Element
    onChange?: (val: MultiValue<SelectFilterOrganizationOptionType> | null) => void
}

const formatOption = (optionProps: OptionProps<SelectFilterOrganizationOptionType>) => {
    return (
        <Option {...optionProps}>
            <div>{optionProps.data.name}</div>
            <span>
                <small>{optionProps.data.address}</small>
            </span>
        </Option>
    )
}

const mapToOption = (data?: ConfigurationItemUi[]): SelectFilterOrganizationOptionType[] => {
    return (
        data?.map((item) => ({
            uuid: item.uuid || '',
            name: item.attributes?.Gen_Profil_nazov || '',
            code: item?.attributes?.Gen_Profil_kod_metais || '',
            address: [item.attributes?.EA_Profil_PO_ulica, item.attributes?.EA_Profil_PO_psc, item.attributes?.EA_Profil_PO_obec].join(' '),
        })) || []
    )
}

export const SelectFilterOrganization = <T extends FieldValues & IFilterParams>({
    name,
    isMulti,
    label,
    filter,
    setValue,
    additionalData,
    option,
    onChange,
}: SelectFilterOrganizationProps<T>) => {
    const { t } = useTranslation()

    const readCiListHook = useReadCiList1Hook()
    const [defaultValue, setDefaultValue] = useState<SelectFilterOrganizationOptionType[] | undefined>(undefined)
    const [seed, setSeed] = useState(1)

    const isError = false
    const loadOptions = useCallback(
        async (searchQuery: string, additional: { page: number } | undefined): Promise<ILoadOptionsResponse<SelectFilterOrganizationOptionType>> => {
            const page = !additional?.page ? 1 : (additional?.page || 0) + 1
            const response = await readCiListHook({
                filter: {
                    fullTextSearch: searchQuery,
                    type: ['PO'],
                    ...additionalData,
                },
                sortBy: 'Gen_Profil_nazov',
                sortType: SortType.ASC,
                page,
                perpage: DEFAULT_LAZY_LOAD_PER_PAGE,
            })

            return {
                options: mapToOption(response.configurationItemSet),
                hasMore: page < (response.pagination?.totalPages ?? 0),
                additional: {
                    page: page,
                },
            }
        },
        [readCiListHook, additionalData],
    )

    useEffect(() => {
        if (!defaultValue && filter && filter?.[name]?.length > 0) {
            readCiListHook({
                filter: {
                    uuid: isMulti ? [...filter[name]] : [filter?.[name]],
                },
            }).then((response) => {
                setDefaultValue(mapToOption(response.configurationItemSet))
            })
        }
    }, [defaultValue, filter, name, isMulti, readCiListHook])

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
                getOptionLabel={(item) => item.name}
                getOptionValue={(item) => item.uuid}
                loadOptions={(searchQuery, _prevOptions, additional) => loadOptions(searchQuery, additional)}
                label={label}
                name={name}
                isMulti={isMulti}
                option={(ctx) => (option ? option?.(ctx) : formatOption(ctx))}
                setValue={setValue}
                onChange={(value) => onChange?.(Array.isArray(value) ? value : [value])}
                defaultValue={defaultValue}
            />
            <QueryFeedback loading={false} error={isError} errorProps={{ errorMessage: t('feedback.failedFetch') }} />
        </>
    )
}

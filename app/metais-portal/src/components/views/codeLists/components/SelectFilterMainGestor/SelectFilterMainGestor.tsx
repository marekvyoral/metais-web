import { DEFAULT_LAZY_LOAD_PER_PAGE, ILoadOptionsResponse, SelectLazyLoading } from '@isdd/idsk-ui-kit/index'
import { SortType } from '@isdd/idsk-ui-kit/types'
import { ConfigurationItemUi, useReadCiList1Hook } from '@isdd/metais-common/api'
import { QueryFeedback } from '@isdd/metais-common/index'
import React, { useCallback, useEffect, useState } from 'react'
import { UseFormSetValue } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { OptionProps, components } from 'react-select'

import style from './selectFilterMainGestor.module.scss'

import { CodeListListFilterData } from '@/components/containers/CodeListListContainer'

export type SelectFilterMainGestorOptionType = {
    uuid: string
    name: string
    address: string
}

interface SelectFilterMainGestorProps {
    filter: CodeListListFilterData
    setValue: UseFormSetValue<CodeListListFilterData>
}

const formatOption = (optionProps: OptionProps<SelectFilterMainGestorOptionType>) => {
    return (
        <components.Option {...optionProps} className={style.selectOption}>
            <div>{optionProps.data.name}</div>
            <span>
                <small>{optionProps.data.address}</small>
            </span>
        </components.Option>
    )
}

const mapToOption = (data?: ConfigurationItemUi[]): SelectFilterMainGestorOptionType[] => {
    return (
        data?.map((item) => ({
            uuid: item.uuid || '',
            name: item.attributes?.Gen_Profil_nazov || '',
            address: [item.attributes?.EA_Profil_PO_ulica, item.attributes?.EA_Profil_PO_psc, item.attributes?.EA_Profil_PO_obec].join(' '),
        })) || []
    )
}

export const SelectFilterOrganization: React.FC<SelectFilterMainGestorProps> = ({ filter, setValue }) => {
    const { t } = useTranslation()

    const readCiListHook = useReadCiList1Hook()
    const [defaultValue, setDefaultValue] = useState<SelectFilterMainGestorOptionType | undefined>(undefined)
    const [seed, setSeed] = useState(1)

    const isError = false

    const loadOptions = useCallback(
        async (searchQuery: string, additional: { page: number } | undefined): Promise<ILoadOptionsResponse<SelectFilterMainGestorOptionType>> => {
            const page = !additional?.page ? 1 : (additional?.page || 0) + 1
            const response = await readCiListHook({
                filter: {
                    fullTextSearch: searchQuery,
                    type: ['PO'],
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
        [readCiListHook],
    )

    useEffect(() => {
        if (!defaultValue && filter.mainGestorPoUuid) {
            readCiListHook({
                filter: {
                    uuid: [filter.mainGestorPoUuid],
                },
            }).then((response) => {
                setDefaultValue(mapToOption(response.configurationItemSet)[0])
            })
        }
    }, [defaultValue, filter.mainGestorPoUuid, readCiListHook])

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
                label={t('codeList.filter.mainGestor')}
                name="mainGestorPoUuid"
                option={(ctx) => formatOption(ctx)}
                setValue={setValue}
                defaultValue={defaultValue}
            />
            <QueryFeedback loading={false} error={isError} errorProps={{ errorMessage: t('feedback.failedFetch') }} />
        </>
    )
}

import { ILoadOptionsResponse, SelectLazyLoading } from '@isdd/idsk-ui-kit/index'
import { useFindAll11 } from '@isdd/metais-common/api/generated/iam-swagger'
import { QueryFeedback } from '@isdd/metais-common/index'
import React, { useCallback, useEffect, useState } from 'react'
import { UseFormSetValue } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { OptionProps } from 'react-select'
import { Option } from '@isdd/idsk-ui-kit/common/SelectCommon'

import { UserManagementFilterData } from '@/components/containers/ManagementList/UserManagementListUtils'

type SelectFilterRoleOptionType = {
    uuid: string
    name?: string
    description?: string
}

interface SelectFilterRoleProps {
    filter: UserManagementFilterData
    setValue: UseFormSetValue<UserManagementFilterData>
}

const formatOption = (props: OptionProps<SelectFilterRoleOptionType>) => {
    return (
        <Option {...props}>
            <div>{props.data.name}</div>
            <span>
                <small>{props.data.description}</small>
            </span>
        </Option>
    )
}

export const SelectFilterRole: React.FC<SelectFilterRoleProps> = ({ filter, setValue }) => {
    const { t } = useTranslation()
    const [defaultValue, setDefaultValue] = useState<SelectFilterRoleOptionType | undefined>(undefined)
    const [options, setOptions] = useState<SelectFilterRoleOptionType[]>([])
    const [seed, setSeed] = useState(1)

    const { data, isError } = useFindAll11()

    const loadOptions = useCallback(async (): Promise<ILoadOptionsResponse<SelectFilterRoleOptionType>> => {
        return {
            options,
            hasMore: false,
            additional: {
                page: 1,
            },
        }
    }, [options])

    useEffect(() => {
        const roles = Array.isArray(data) ? data : [data]
        setOptions(roles.map((role) => ({ uuid: role?.uuid ?? '', name: role?.name ?? '', description: role?.description ?? '' })))
    }, [data])

    useEffect(() => {
        if (!defaultValue && filter.roleUuid) {
            const defaultOption = options.find((option) => option.uuid === filter.roleUuid)
            setDefaultValue(defaultOption)
        }
    }, [defaultValue, filter.roleUuid, options])

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
                getOptionLabel={(item) => item.name ?? ''}
                getOptionValue={(item) => item.uuid ?? ''}
                loadOptions={loadOptions}
                label={t('userManagement.filter.role')}
                name="roleUuid"
                option={(ctx) => formatOption(ctx)}
                setValue={setValue}
                defaultValue={defaultValue}
            />
            <QueryFeedback loading={false} error={isError} errorProps={{ errorMessage: t('userManagement.error.query') }} />
        </>
    )
}

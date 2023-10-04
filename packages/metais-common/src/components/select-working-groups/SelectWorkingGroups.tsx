import React, { useEffect, useMemo, useState } from 'react'
import { IOption, SimpleSelect } from '@isdd/idsk-ui-kit'
import { UseFormSetValue } from 'react-hook-form'

import { Group, useFind2111 } from '@isdd/metais-common/api/generated/iam-swagger'
import { GetFOPStandardRequestsParams } from '@isdd/metais-common/api/generated/standards-swagger'

interface SelectWorkingGroupsProps {
    filter?: GetFOPStandardRequestsParams
    setValue: UseFormSetValue<GetFOPStandardRequestsParams>
    name: string
    label: string
    optionLabel?: (option: Group | undefined) => string
}

export const SelectWorkingGroups = ({ filter, setValue, name, label, optionLabel }: SelectWorkingGroupsProps) => {
    const { data } = useFind2111({})
    const [seed, setSeed] = useState(1)

    const workingGroupOptions: IOption[] = useMemo(() => {
        if (Array.isArray(data)) {
            return data?.map((dataGroup) => ({
                label: optionLabel ? optionLabel?.(dataGroup) : dataGroup?.shortName ?? '',
                value: dataGroup?.uuid ?? '',
            }))
        }
        return [
            {
                label: optionLabel ? optionLabel?.(data) : data?.shortName ?? '',
                value: data?.uuid ?? '',
            },
        ]
    }, [data, optionLabel])

    useEffect(() => {
        setSeed(Math.random())
    }, [workingGroupOptions])
    return (
        <>
            <SimpleSelect key={seed} label={label} name={name} options={workingGroupOptions} setValue={setValue} defaultValue={filter?.workGroupId} />
        </>
    )
}

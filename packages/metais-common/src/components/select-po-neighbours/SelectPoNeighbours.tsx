import { IOption, SimpleSelect } from '@isdd/idsk-ui-kit/index'
import React, { useEffect, useState } from 'react'
import { FieldValues, UseFormSetValue } from 'react-hook-form'

import { useReadNeighboursConfigurationItems } from '@isdd/metais-common/api/generated/cmdb-swagger'
import { ATTRIBUTE_NAME } from '@isdd/metais-common/api'

interface ISelectPO {
    nodeType: string
    relationshipType: string
    relatedPoUuid: string
    label: string
    placeholder?: string
    name: string
    type: 'toCiSet' | 'fromCiSet'
    setValue: UseFormSetValue<FieldValues>
    defaultValue: string
}

export const SelectPoNeighbours = ({
    nodeType,
    relatedPoUuid,
    relationshipType,
    label,
    placeholder,
    name,
    setValue,
    defaultValue,
    type,
}: ISelectPO) => {
    const { data } = useReadNeighboursConfigurationItems(
        relatedPoUuid,
        {
            nodeType,
            relationshipType,
        },
        { query: { enabled: !!relatedPoUuid } },
    )

    const options: IOption<string>[] =
        data?.[type]?.map((item) => ({
            label: item.attributes?.[ATTRIBUTE_NAME.Gen_Profil_nazov] ?? '',
            value: item.uuid ?? '',
        })) ?? []

    const [seed, setSeed] = useState(1)

    useEffect(() => {
        setValue(name, null)
        setSeed(Math.random())
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [relatedPoUuid])

    return (
        <SimpleSelect
            key={seed}
            placeholder={placeholder}
            label={label}
            name={name}
            options={options}
            setValue={setValue}
            defaultValue={defaultValue}
            disabled={!relatedPoUuid}
        />
    )
}

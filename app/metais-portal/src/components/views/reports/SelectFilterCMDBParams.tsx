import { ISelectProps, SelectLazyLoading } from '@isdd/idsk-ui-kit/index'
import { useReadCiList1Hook, useReadConfigurationItem } from '@isdd/metais-common/api'
import { mapReportsCiItemToOptions } from '@isdd/metais-common/componentHelpers'
import React, { useEffect, useState } from 'react'

import { IOptions, SelectFilterCMDBParamsOption } from './SelectFilterCMDBParamsOptions'

import { loadEnumsCiOptions } from '@/componentHelpers'

interface ISelectFilterCMDBParams extends Omit<ISelectProps<IOptions>, 'loadOptions'> {
    type?: string
    defaultValueKey?: string
}

export const SelectFilterCMDBParams: React.FC<ISelectFilterCMDBParams> = ({
    label,
    name,
    id,
    getOptionValue,
    getOptionLabel,
    setValue,
    error,
    clearErrors,
    type,
    defaultValueKey,
}) => {
    const readCiList1 = useReadCiList1Hook()
    const [defaultValue, setDefaultValue] = useState<IOptions>()
    const [seed, setSeed] = useState(1)
    const { data } = useReadConfigurationItem(defaultValueKey ?? '')

    useEffect(() => {
        if (data) {
            setDefaultValue(mapReportsCiItemToOptions([data])?.[0])
            // SelectLazyLoading component does not rerender on defaultValue change.
            // Once default value is set, it cant be changed.
            // Change of key forces the component to render changed default value.
            setSeed(Math.random())
        }
    }, [data])

    return (
        <SelectLazyLoading<IOptions>
            key={seed}
            label={label}
            name={name}
            id={id}
            loadOptions={(searchTerm, _, additional) => loadEnumsCiOptions(searchTerm, additional, type ?? '', readCiList1)}
            option={(optionProps) => SelectFilterCMDBParamsOption(optionProps)}
            getOptionValue={getOptionValue}
            getOptionLabel={getOptionLabel}
            setValue={setValue}
            defaultValue={defaultValue}
            error={error}
            clearErrors={clearErrors}
        />
    )
}

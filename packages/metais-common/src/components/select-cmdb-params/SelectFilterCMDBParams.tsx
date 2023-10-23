import { ISelectProps, SelectLazyLoading } from '@isdd/idsk-ui-kit/index'
import React, { useEffect, useState } from 'react'

import { IOptions, SelectFilterCMDBParamsOption } from './SelectFilterCMDBParamsOptions'

import { useReadCiList1Hook, useReadConfigurationItemHook } from '@isdd/metais-common/api'
import { mapReportsCiItemToOptions } from '@isdd/metais-common/componentHelpers'
import { useUserPreferences } from '@isdd/metais-common/contexts/userPreferences/userPreferencesContext'
import { loadEnumsCiOptions } from '@isdd/metais-common/componentHelpers/ci/ciEnum'

interface ISelectFilterCMDBParams extends Omit<ISelectProps<IOptions>, 'loadOptions'> {
    type?: string
    defaultValueKey?: string[]
    isMulti?: boolean
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
    isMulti,
    defaultValueKey,
}) => {
    const readCiList1 = useReadCiList1Hook()
    const [defaultValue, setDefaultValue] = useState<IOptions[]>()
    const [seed, setSeed] = useState(1)

    const readConfigurationItem = useReadConfigurationItemHook()
    const { currentPreferences } = useUserPreferences()

    useEffect(() => {
        const promises = defaultValueKey?.map((i) => readConfigurationItem(i))
        if (promises)
            Promise.all(promises).then((res) => {
                setDefaultValue(mapReportsCiItemToOptions(res))
                setSeed(Math.random())
            })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [defaultValueKey])

    return (
        <SelectLazyLoading<IOptions>
            key={seed}
            label={label}
            name={name}
            id={id}
            loadOptions={(searchTerm, _, additional) =>
                loadEnumsCiOptions(searchTerm, additional, type ?? '', readCiList1, currentPreferences.showInvalidatedItems)
            }
            isMulti={isMulti}
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

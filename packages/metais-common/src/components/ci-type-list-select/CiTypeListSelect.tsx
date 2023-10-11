import React from 'react'
import { SimpleSelect } from '@isdd/idsk-ui-kit'
import { FieldValues, UseFormClearErrors, UseFormSetValue } from 'react-hook-form'
import { t } from 'i18next'

import { useListCiTypes } from '@isdd/metais-common/api'

type CiTypeListSelectProps<T extends FieldValues> = {
    label: string
    name: string
    setValue: UseFormSetValue<T>
    clearErrors: UseFormClearErrors<T>
    error?: string
}

export const CiTypeListSelect = <T extends FieldValues>({ setValue, clearErrors, label, name, error }: CiTypeListSelectProps<T>) => {
    const { data, isError, isLoading } = useListCiTypes({ filter: {} })

    const options = isLoading
        ? [{ label: t('feedback.loading'), value: '', disabled: true }]
        : data?.results?.map((item) => ({
              value: item.technicalName ?? '',
              label: item.name ?? '',
          })) ?? []

    return (
        <SimpleSelect
            label={label}
            name={name}
            setValue={setValue}
            clearErrors={clearErrors}
            error={isError ? t('feedback.error') : error ? error : ''}
            options={options}
        />
    )
}

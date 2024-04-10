import React from 'react'
import { SimpleSelect } from '@isdd/idsk-ui-kit'
import { FieldValues, UseFormClearErrors, UseFormSetValue } from 'react-hook-form'
import { t } from 'i18next'
import { useTranslation } from 'react-i18next'

import { useListCiTypes } from '@isdd/metais-common/api/generated/types-repo-swagger'
import { CI_TYPES_QUERY_KEY } from '@isdd/metais-common/constants'

type CiTypeListSelectProps<T extends FieldValues> = {
    label: string
    name: string
    setValue: UseFormSetValue<T>
    clearErrors: UseFormClearErrors<T>
    error?: string
}

export const CiTypeListSelect = <T extends FieldValues>({ setValue, clearErrors, label, name, error }: CiTypeListSelectProps<T>) => {
    const { i18n } = useTranslation()
    const { data, isError, isLoading } = useListCiTypes({ filter: {} }, { query: { queryKey: [CI_TYPES_QUERY_KEY, i18n.language] } })

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

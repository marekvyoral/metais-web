import { SelectLazyLoading } from '@isdd/idsk-ui-kit/index'
import { Identity, useFind1Hook, useGetPages2 } from '@isdd/metais-common/api/generated/iam-swagger'
import React, { useCallback } from 'react'
import { UseFormClearErrors, UseFormRegister, UseFormSetValue } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { MultiValue, OptionProps, PropsValue, components } from 'react-select'

import styles from './identity-select.module.scss'

interface IIdentitySelect {
    name: string
    onChange?: (val: Identity | MultiValue<Identity> | null) => void
    label?: string
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setValue?: UseFormSetValue<any>
    error?: string
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    clearErrors?: UseFormClearErrors<any>
    placeholder?: string
    required?: boolean
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    register?: UseFormRegister<any>
    defaultValue?: PropsValue<Identity>
}

export const IdentitySelect: React.FC<IIdentitySelect> = ({
    label,
    clearErrors,
    setValue,
    name,
    required,
    error,
    onChange,
    placeholder,
    register,
    defaultValue,
}) => {
    const perPage = 20
    const { t } = useTranslation()
    const { data: numberOfIdentities } = useGetPages2()
    const loginOptionsHook = useFind1Hook()

    const loadLoginOptions = useCallback(
        async (searchQuery: string, additional: { page: number } | undefined) => {
            const page = !additional?.page ? 1 : (additional?.page || 0) + 1

            const loginOptions = await loginOptionsHook(page, perPage, { searchIn: 'login', expression: searchQuery })

            return {
                options: loginOptions || [],
                hasMore: numberOfIdentities ? page < numberOfIdentities / perPage : false,
                additional: {
                    page,
                },
            }
        },
        [loginOptionsHook, numberOfIdentities],
    )

    const selectLazyLoadingLoginOption = (props: OptionProps<Identity>) => {
        return (
            <components.Option {...props} className={styles.selectOption}>
                <div className={styles.selectOption}>
                    <span>{props.data.displayName}</span>
                    <span>
                        <small> ({props.data.login})</small>
                    </span>
                </div>
            </components.Option>
        )
    }

    return (
        <SelectLazyLoading<Identity>
            placeholder={placeholder}
            id={name}
            label={
                label
                    ? `${label} ${required ? t('input.requiredField') : ''}`
                    : `${t('tasks.selectLogin')} ${required ? t('input.requiredField') : ''}`
            }
            {...(register ? { ...register(`${name}`) } : undefined)}
            name={name}
            getOptionValue={(item) => item.uuid || ''}
            getOptionLabel={(item) => item.displayName || ''}
            option={(props) => selectLazyLoadingLoginOption(props)}
            loadOptions={(searchTerm, _, additional) => loadLoginOptions(searchTerm, additional)}
            setValue={setValue}
            error={error}
            clearErrors={clearErrors}
            onChange={onChange}
            defaultValue={defaultValue}
        />
    )
}

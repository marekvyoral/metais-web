import { SelectLazyLoading } from '@isdd/idsk-ui-kit/index'
import { Identity, useFindNotRelatedWithHook } from '@isdd/metais-common/api/generated/iam-swagger'
import React, { useCallback } from 'react'
import { UseFormClearErrors, UseFormRegister, UseFormSetValue } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { MultiValue, OptionProps, PropsValue, components } from 'react-select'

import styles from './add-member-select.module.scss'

interface IAddMemberSelect {
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
    groupUuid: string
}

export const AddMemberSelect: React.FC<IAddMemberSelect> = ({
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
    groupUuid,
}) => {
    const perPage = 20
    const { t } = useTranslation()
    const loginOptionsHook = useFindNotRelatedWithHook()

    const loadLoginOptions = useCallback(
        async (searchQuery: string, additional: { page: number } | undefined) => {
            const page = !additional?.page ? 1 : (additional?.page || 0) + 1

            //const loginOptions = await loginOptionsHook(page, perPage, { searchIn: 'login', expression: searchQuery, state: 'ACTIVATED' })
            const loginOptions = await loginOptionsHook(page, perPage, {
                expression: searchQuery,
                groupUuid,
                relName: 'memberOf',
                state: 'ACTIVATED',
            })
            return {
                options: loginOptions,
                hasMore: !(perPage > loginOptions.length),
                additional: {
                    page,
                },
            }
        },
        [groupUuid, loginOptionsHook],
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

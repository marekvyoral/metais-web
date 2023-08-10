import React, { SetStateAction, useCallback } from 'react'
import { SelectLazyLoading } from '@isdd/idsk-ui-kit/index'
import { Identity, useFind1Hook, useGetPages2 } from '@isdd/metais-common/api/generated/iam-swagger'
import { OptionProps, components } from 'react-select'
import { useTranslation } from 'react-i18next'

import styles from './tasks.module.scss'

interface IAssignToUserSelect {
    selectedLogin: Identity | undefined
    setSelectedLogin: React.Dispatch<SetStateAction<Identity | undefined>>
}

export const AssignToUserSelect: React.FC<IAssignToUserSelect> = ({ selectedLogin, setSelectedLogin }) => {
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
            name="account"
            label={t('tasks.selectLogin')}
            value={selectedLogin}
            onChange={(val) => setSelectedLogin(Array.isArray(val) ? val[0] : val)}
            getOptionValue={(item) => item.login || ''}
            getOptionLabel={(item) => item.displayName || ''}
            option={(props) => selectLazyLoadingLoginOption(props)}
            loadOptions={(searchTerm, _, additional) => loadLoginOptions(searchTerm, additional)}
        />
    )
}

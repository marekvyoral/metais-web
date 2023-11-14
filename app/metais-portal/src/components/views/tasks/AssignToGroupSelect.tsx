import { SelectLazyLoading } from '@isdd/idsk-ui-kit/index'
import { RoleOrgIdentity, useFindAllWithParamsHook } from '@isdd/metais-common/api/generated/iam-swagger'
import React, { SetStateAction, useCallback } from 'react'
import { OptionProps, components } from 'react-select'
import { useTranslation } from 'react-i18next'

import styles from './tasks.module.scss'

interface IAssignToGroupSelect {
    selectedGroup: RoleOrgIdentity | undefined
    setSelectedGroup: React.Dispatch<SetStateAction<RoleOrgIdentity | undefined>>
}

export const AssignToGroupSelect: React.FC<IAssignToGroupSelect> = ({ selectedGroup, setSelectedGroup }) => {
    const perPage = 20
    const { t } = useTranslation()
    const groupOptionsHook = useFindAllWithParamsHook()

    const loadGroupOptions = useCallback(
        async (searchQuery: string, additional: { page: number } | undefined) => {
            const page = searchQuery && !additional?.page ? 1 : (additional?.page || 0) + 1

            const groupOptions = await groupOptionsHook(page, perPage, { search: searchQuery })

            return {
                options: groupOptions?.gids || [],
                hasMore: groupOptions.total ? page < groupOptions?.total / perPage : false,
                additional: {
                    page: page,
                },
            }
        },
        [groupOptionsHook],
    )

    const selectLazyLoadingGroupOption = (props: OptionProps<RoleOrgIdentity>) => {
        return (
            <components.Option {...props} className={styles.selectOption}>
                <div className={styles.selectOption}>{props.data.orgName}</div>
            </components.Option>
        )
    }

    return (
        <SelectLazyLoading<RoleOrgIdentity>
            name="account"
            label={t('tasks.selectGroup')}
            onChange={(val) => setSelectedGroup(Array.isArray(val) ? val[0] : val)}
            value={selectedGroup}
            getOptionValue={(item) => item.gid || ''}
            getOptionLabel={(item) => item.orgName || ''}
            option={(props) => selectLazyLoadingGroupOption(props)}
            loadOptions={(searchTerm, _, additional) => loadGroupOptions(searchTerm, additional)}
        />
    )
}

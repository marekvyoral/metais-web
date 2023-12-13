import React, { SetStateAction, useCallback } from 'react'
import { SelectLazyLoading } from '@isdd/idsk-ui-kit/index'
import { Find2111Params, Group, useFind2111Hook } from '@isdd/metais-common/api/generated/iam-swagger'
import { OptionProps, components } from 'react-select'
import { useTranslation } from 'react-i18next'

import styles from '@/components/views/standardization/groups/groupslist.module.scss'

interface IGroupSelect {
    selectedGroup: Group | undefined
    setSelectedGroup: React.Dispatch<SetStateAction<Group | undefined>>
}

export const GroupSelect: React.FC<IGroupSelect> = ({ selectedGroup, setSelectedGroup }) => {
    const { t } = useTranslation()

    const groupOptionsHook = useFind2111Hook()

    const loadGroupOptions = useCallback(
        async (searchQuery: string, additional: { page: number } | undefined) => {
            const page = !additional?.page ? 1 : (additional?.page || 0) + 1
            const request: Find2111Params = {
                sortBy: 'name',
                ascending: false,
            }
            if (searchQuery && searchQuery.length > 0) request.name = searchQuery

            const groupOptions = await groupOptionsHook(request)

            return {
                options: (groupOptions as Group[]) || [],
                hasMore: false,
                additional: {
                    page,
                },
            }
        },
        [groupOptionsHook],
    )

    const selectLazyLoadingGroupOption = (props: OptionProps<Group>) => {
        return (
            <components.Option {...props} className={styles.selectOption}>
                <div className={styles.selectOption}>
                    <span>{props.data.name}</span>
                    <span>
                        <small> ({props.data.shortName})</small>
                    </span>
                </div>
            </components.Option>
        )
    }

    return (
        <SelectLazyLoading<Group>
            name="account"
            label={`${t('groups.groupName')}:`}
            value={selectedGroup}
            onChange={(val) => setSelectedGroup(Array.isArray(val) ? val[0] : val)}
            getOptionValue={(item) => item.uuid || ''}
            getOptionLabel={(item) => item.name || ''}
            option={(props) => selectLazyLoadingGroupOption(props)}
            loadOptions={(searchTerm, _, additional) => loadGroupOptions(searchTerm, additional)}
        />
    )
}

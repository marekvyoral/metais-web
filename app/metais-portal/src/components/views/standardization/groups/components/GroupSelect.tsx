import React, { SetStateAction, useMemo } from 'react'
import { IOption, SimpleSelect } from '@isdd/idsk-ui-kit/index'
import { useFind2111 } from '@isdd/metais-common/api/generated/iam-swagger'
import { useTranslation } from 'react-i18next'
import { QueryFeedback } from '@isdd/metais-common/index'

interface IGroupSelect {
    setSelectedGroup: React.Dispatch<SetStateAction<string>>
}

export const GroupSelect: React.FC<IGroupSelect> = ({ setSelectedGroup }) => {
    const { t } = useTranslation()

    const { data: groupList, isLoading } = useFind2111({ sortBy: 'name', ascending: false })

    const optionsGroups: IOption<string>[] = useMemo(() => {
        if (Array.isArray(groupList)) {
            return groupList?.map((group) => ({
                value: `${group.shortName}`,
                label: `${group.name} (${group.shortName})`,
            }))
        } else if (groupList) {
            return [
                {
                    value: `${groupList.shortName}`,
                    label: `${groupList.name} (${groupList.shortName})`,
                },
            ]
        }
        return []
    }, [groupList])

    return (
        <QueryFeedback loading={isLoading}>
            <SimpleSelect
                name="account"
                label={`${t('groups.groupName')}`}
                onChange={(val) => setSelectedGroup(Array.isArray(val) ? val[0] : val)}
                options={optionsGroups}
            />
        </QueryFeedback>
    )
}

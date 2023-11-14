import { MultiSelect } from '@isdd/idsk-ui-kit'
import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useFind2111 } from '@isdd/metais-common/api/generated/iam-swagger'

interface ISelectMeetingGroup {
    meetingGroups: string[]
    id: string
    label: string
}

export const SelectMeetingGroup = ({ meetingGroups, id, label }: ISelectMeetingGroup) => {
    const { t } = useTranslation()

    const { data: groupList } = useFind2111({ sortBy: 'name', ascending: false })

    const optionsGroups = useMemo(() => {
        if (Array.isArray(groupList)) {
            return groupList?.map((group) => ({
                value: `${group.uuid}`,
                label: `${group.name} (${group.shortName})`,
            }))
        } else if (groupList) {
            return [
                {
                    value: `${groupList.uuid}`,
                    label: `${groupList.name} (${groupList.shortName})`,
                },
            ]
        }
        return []
    }, [groupList])

    return (
        <>
            <MultiSelect
                key={id}
                name={id}
                label={label}
                placeholder={t('filter.chooseValue')}
                options={optionsGroups}
                defaultValue={meetingGroups}
            />
        </>
    )
}

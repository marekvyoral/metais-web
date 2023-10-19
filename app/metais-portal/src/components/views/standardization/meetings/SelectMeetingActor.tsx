import { MultiSelect } from '@isdd/idsk-ui-kit'
import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useFindAllWithIdentities1 } from '@isdd/metais-common/api/generated/iam-swagger'
import { ApiMeetingActor } from '@isdd/metais-common/api/generated/standards-swagger'

interface ISelectMeetingActor {
    meetingActors: ApiMeetingActor[]
    id: string
    label: string
}

export const SelectMeetingActor = ({ meetingActors, id, label }: ISelectMeetingActor) => {
    const { t } = useTranslation()

    const { data: userList } = useFindAllWithIdentities1({ expression: '' })

    const optionsUsers = useMemo(
        () =>
            userList?.flatMap((group) =>
                (group?.identities || []).map((actor) => ({
                    value: actor?.identity?.uuid ?? '',
                    label: `${actor?.identity?.displayName} (${group?.group?.name})`,
                })),
            ) || [],
        [userList],
    )

    return (
        <>
            <MultiSelect
                key={id}
                name={id}
                label={label}
                placeholder={t('filter.chooseValue')}
                options={optionsUsers}
                defaultValue={meetingActors.map((actor) => actor.userId || '')}
            />
        </>
    )
}

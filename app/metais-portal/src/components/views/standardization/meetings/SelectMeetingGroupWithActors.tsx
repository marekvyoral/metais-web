import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { ApiMeetingActor, ApiMeetingRequest } from '@isdd/metais-common/api/generated/standards-swagger'
import { FieldErrors, UseFormSetValue, UseFormWatch } from 'react-hook-form'
import { QueryFeedback } from '@isdd/metais-common/index'
import { MultiSelect } from '@isdd/idsk-ui-kit/index'
import { useFind2111, useFindAllWithIdentities1 } from '@isdd/metais-common/api/generated/iam-swagger'

import { MeetingFormEnum } from './meetingSchema'

export interface IError {
    meetingActors: ApiMeetingActor
}

interface ISelectMeetingGroupWithActors {
    groupDefaultValue?: ApiMeetingRequest
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setValue: UseFormSetValue<any>
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    watch: UseFormWatch<any>
    errors: FieldErrors<IError>
}

export const SelectMeetingGroupWithActors = ({ groupDefaultValue, setValue, watch, errors }: ISelectMeetingGroupWithActors) => {
    const { t } = useTranslation()
    const { data: userList, isLoading, isError } = useFindAllWithIdentities1({ expression: '' })
    const { data: groupList } = useFind2111({ sortBy: 'name', ascending: false })
    const meetingActors: ApiMeetingActor[] | undefined = watch(MeetingFormEnum.MEETING_ACTORS)
    const meetingGroups: string[] | undefined = watch(MeetingFormEnum.GROUP)

    const optionsUsers = useMemo(
        () =>
            userList?.flatMap((group) =>
                (group?.identities || []).map((actor) => ({
                    value: `${actor?.identity?.login}-${group?.group?.uuid}` ?? '',
                    label: `${actor?.identity?.displayName} (${group?.group?.name})`,
                })),
            ) || [],
        [userList],
    )
    const findUser = (id: string) => {
        if (!userList) return
        for (let i = 0; i < userList?.length; i++) {
            const group = userList[i]
            const user = group.identities?.find((o) => `${o.identity?.login}-${group?.group?.uuid}` === id)
            if (user)
                return {
                    userId: user.identity?.login,
                    groupId: group.group?.uuid,
                    userRoleId: user.gids?.[0].roleId,
                    userOrgId: user.gids?.[0].orgId,
                }
        }
    }
    const onActorChange = (value: string[]) => {
        const newActors = value.map((id) => {
            const user = findUser(id)
            if (user) return user
        })
        setValue(MeetingFormEnum.MEETING_ACTORS, newActors)

        const groupedActors: {
            [key: string]: string[]
        } = {}
        newActors.forEach((actor) => {
            if (actor?.groupId && actor?.userId) groupedActors[actor.groupId] = [...(groupedActors[actor.groupId] || []), actor.userId]
        })
        const selectedGroups = []
        for (const key in groupedActors) {
            if (Object.hasOwn(groupedActors, key)) {
                const group = userList?.find((item) => item?.group?.uuid === key)
                if (group?.identities?.length === groupedActors[key].length) {
                    selectedGroups.push(key)
                }
            }
        }
        setValue(MeetingFormEnum.GROUP, selectedGroups)
    }

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

    const onMeetingGroupChange = (values: string[]) => {
        const prevGroups = [...(meetingGroups || [])]
        setValue(MeetingFormEnum.GROUP, values)
        const newActors = [...(meetingActors || [])]
        if (prevGroups.length > values.length) {
            const removedGroupId = prevGroups.find((id) => !values.includes(id))
            setValue(
                MeetingFormEnum.MEETING_ACTORS,
                newActors.filter((actor) => actor.groupId !== removedGroupId),
            )
        } else {
            values.forEach((groupId) => {
                const group = userList?.find((o) => o?.group?.uuid === groupId)
                group?.identities?.forEach((identity) => {
                    if (!newActors.some((o) => o.userId === identity.identity?.login)) {
                        newActors.push({
                            userId: identity.identity?.login,
                            groupId: group.group?.uuid,
                            userRoleId: identity.gids?.[0].roleId,
                            userOrgId: identity.gids?.[0].orgId,
                        })
                    }
                })
            })
            setValue(MeetingFormEnum.MEETING_ACTORS, newActors)
        }
    }
    if (!groupList) return null

    return (
        <QueryFeedback loading={isLoading} error={isError} withChildren>
            <MultiSelect
                key={MeetingFormEnum.GROUP}
                name={MeetingFormEnum.GROUP}
                label={`${t('meetings.form.group')}:`}
                placeholder={t('filter.chooseValue')}
                options={optionsGroups}
                defaultValue={groupDefaultValue?.groups ?? []}
                onChange={onMeetingGroupChange}
                value={meetingGroups}
            />

            <MultiSelect
                key={MeetingFormEnum.MEETING_ACTORS}
                name={MeetingFormEnum.MEETING_ACTORS}
                label={`${t('meetings.form.meetingActors')} (${t('meetings.mandatory')}):`}
                placeholder={t('filter.chooseValue')}
                options={optionsUsers}
                onChange={onActorChange}
                value={meetingActors?.map((actor) => `${actor.userId}-${actor.groupId}` || '')}
                error={errors[MeetingFormEnum.MEETING_ACTORS]?.message}
            />
        </QueryFeedback>
    )
}

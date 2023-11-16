import React, { useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { ApiVoteActor } from '@isdd/metais-common/api/generated/standards-swagger'
import { FieldErrors, UseFormSetValue, UseFormWatch } from 'react-hook-form'
import { QueryFeedback } from '@isdd/metais-common/index'
import { IOption, MultiSelect } from '@isdd/idsk-ui-kit/index'
import { GroupWithIdentities } from '@isdd/metais-common/api/generated/iam-swagger'

export interface IError {
    invitedUsers: ApiVoteActor[]
}

interface ISelectVoteActors {
    userList?: GroupWithIdentities[]
    isLoading?: boolean
    isError?: boolean
    defaultValues?: ApiVoteActor[]
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setValue: UseFormSetValue<any>
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    watch: UseFormWatch<any>
    errors: FieldErrors<IError>
}

enum VoteActorsEnum {
    INVITED_GROUPS = 'invitedGroups',
    INVITED_USERS = 'invitedUsers',
}

const getInvitedGroupsOptions = (groupWithIdentitiesDataArray: GroupWithIdentities[] | undefined): IOption<string>[] => {
    return (
        groupWithIdentitiesDataArray?.map((ig) => {
            return { value: ig.group?.uuid ?? '', label: ig.group?.name ?? '' }
        }) ?? []
    )
}

const getDefaultSelectedUsers = (voteActorArray: ApiVoteActor[] | undefined, invitedUsersOptions: IOption<string>[]): string[] => {
    const defaultSelectedUsers = voteActorArray?.map<string>((va) => {
        const resultVal = invitedUsersOptions.find((iuo) => iuo.value == va.userId)?.value
        return resultVal ?? ''
    })
    return (
        defaultSelectedUsers?.filter((dsa) => {
            return dsa != ''
        }) ?? []
    )
}

export const SelectVoteActors = ({ defaultValues, setValue, watch, errors, userList, isLoading = false, isError = false }: ISelectVoteActors) => {
    const { t } = useTranslation()
    const watchInvitedUsers: ApiVoteActor[] | undefined = watch(VoteActorsEnum.INVITED_USERS)
    const watchInvitedGroups: string[] | undefined = watch(VoteActorsEnum.INVITED_GROUPS)

    const invitedGroupsOptions: IOption<string>[] = useMemo(() => {
        return getInvitedGroupsOptions(userList)
    }, [userList])

    const invitedUsersOptions = useMemo(
        () =>
            userList?.flatMap((group) =>
                (group?.identities || []).map((actor) => ({
                    value: `${actor?.identity?.login}` ?? '',
                    label: `${actor?.identity?.displayName} (${group?.group?.name})`,
                })),
            ) || [],
        [userList],
    )

    const defaultSelectedUsers = getDefaultSelectedUsers(defaultValues, invitedUsersOptions) ?? []

    const selectedInvitedUsers = watchInvitedUsers?.map((user) => `${user.userId}` || '') ?? []

    const findUser = (id: string) => {
        if (!userList) return
        for (let i = 0; i < userList?.length; i++) {
            const group = userList[i]
            const user = group.identities?.find((o) => `${o.identity?.login}` === id)
            if (user)
                return {
                    userId: user.identity?.login,
                    groupId: group.group?.uuid,
                    userRoleId: user.gids?.[0].roleId,
                    userOrgId: user.gids?.[0].orgId,
                }
        }
    }
    const onUserChange = (value: string[]) => {
        const newActors = value.map((id) => {
            const user = findUser(id)
            if (user) return user
        })
        setValue(VoteActorsEnum.INVITED_USERS, newActors)

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
        setValue(VoteActorsEnum.INVITED_GROUPS, selectedGroups)
    }

    const onGroupChange = (values: string[]) => {
        const prevGroups = [...(watchInvitedGroups || [])]
        setValue(VoteActorsEnum.INVITED_GROUPS, values)
        const newActors = [...(watchInvitedUsers || [])]
        if (prevGroups.length > values.length) {
            const removedGroupId = prevGroups.find((id) => !values.includes(id))
            setValue(
                VoteActorsEnum.INVITED_USERS,
                newActors.filter((user) => user.groupId !== removedGroupId),
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
            setValue(VoteActorsEnum.INVITED_USERS, newActors)
        }
    }

    useEffect(() => {
        setValue(
            VoteActorsEnum.INVITED_USERS,
            defaultSelectedUsers.map((userLogin) => findUser(userLogin)),
        )
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userList])

    if (!invitedGroupsOptions) return null

    return (
        <QueryFeedback loading={isLoading} error={isError} withChildren>
            <MultiSelect
                key={VoteActorsEnum.INVITED_GROUPS}
                name={VoteActorsEnum.INVITED_GROUPS}
                label={t('votes.voteEdit.invited.invitedGroups')}
                placeholder={t('filter.chooseValue')}
                options={invitedGroupsOptions}
                onChange={onGroupChange}
                value={watchInvitedGroups}
            />

            <MultiSelect
                key={VoteActorsEnum.INVITED_USERS}
                name={VoteActorsEnum.INVITED_USERS}
                label={t('votes.voteEdit.invited.invitedUsers')}
                placeholder={t('filter.chooseValue')}
                options={invitedUsersOptions}
                onChange={onUserChange}
                value={selectedInvitedUsers}
                error={errors[VoteActorsEnum.INVITED_USERS]?.message}
            />
        </QueryFeedback>
    )
}
